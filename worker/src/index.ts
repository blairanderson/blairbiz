import { signJwt, verifyJwt } from './jwt';
import { sendOtp } from './email';

export interface Env {
  AI: Ai;
  SEND_EMAIL: SendEmail;
  JWT_SECRET: string;
  FROM_ADDRESS: string;
  TURNSTILE_SECRET_KEY: string;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SYSTEM_PROMPT = `You are a helpful assistant for Blair Anderson's software consulting agency at blair.biz. Blair is a senior software engineer and consultant based in Kirkland, WA. He offers custom software development, AI & automation, and consulting/strategy engagements at roughly $5K/week. Help visitors understand Blair's services, past work, and how to get started. Be concise, friendly, and direct — no fluff.`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const { pathname } = new URL(request.url);

    try {
      // ── POST /turnstile ──────────────────────────────────────────────────────
      // Verifies a Cloudflare Turnstile token. Must pass before email is collected.
      if (pathname === '/turnstile') {
        const body = (await request.json()) as { token?: string };
        const token = (body.token ?? '').trim();

        if (!token) return json({ valid: false, error: 'Missing token.' }, 400);

        const form = new FormData();
        form.append('secret', env.TURNSTILE_SECRET_KEY);
        form.append('response', token);

        const verifyRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          { method: 'POST', body: form },
        );
        const result = (await verifyRes.json()) as { success: boolean };

        if (!result.success) {
          return json({ valid: false, error: 'Verification failed. Please try again.' }, 401);
        }

        return json({ valid: true });
      }

      // ── POST /email ─────────────────────────────────────────────────────────
      // Accepts { email }, generates a signed OTP JWT, sends the 6-digit code
      // via email, and returns { sent: true, token } to the frontend.
      if (pathname === '/email') {
        const body = (await request.json()) as { email?: string };
        const email = (body.email ?? '').trim().toLowerCase();

        if (!email || !EMAIL_RE.test(email)) {
          return json({ error: 'Please enter a valid email address.' }, 400);
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const exp = Math.floor(Date.now() / 1000) + 600; // 10 min
        const token = await signJwt({ email, otp, type: 'otp', exp }, env.JWT_SECRET);

        await sendOtp(env, email, otp);

        return json({ sent: true, token });
      }

      // ── POST /verify ─────────────────────────────────────────────────────────
      // Accepts { token, otp }. Verifies the JWT, checks the OTP matches,
      // and returns { valid: true, session } — a long-lived session JWT.
      if (pathname === '/verify') {
        const body = (await request.json()) as { token?: string; otp?: string };
        const { token = '', otp = '' } = body;

        let payload: Record<string, unknown>;
        try {
          payload = await verifyJwt(token, env.JWT_SECRET);
        } catch {
          return json({ valid: false, error: 'Code expired or invalid. Please start over.' }, 401);
        }

        if (payload.type !== 'otp') {
          return json({ valid: false, error: 'Invalid token type.' }, 400);
        }

        if (payload.otp !== otp.trim()) {
          return json({ valid: false, error: 'Incorrect code — please try again.' }, 401);
        }

        const exp = Math.floor(Date.now() / 1000) + 86400; // 24 h session
        const session = await signJwt(
          { email: payload.email, type: 'session', exp },
          env.JWT_SECRET,
        );

        return json({ valid: true, session, email: payload.email });
      }

      // ── POST /chat ───────────────────────────────────────────────────────────
      // Requires Authorization: Bearer <session-jwt>.
      // Accepts { messages: [{role, content}] }, streams Workers AI response.
      if (pathname === '/chat') {
        const authHeader = request.headers.get('Authorization') ?? '';
        const sessionToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

        if (!sessionToken) return json({ error: 'Unauthorized' }, 401);

        let sessionPayload: Record<string, unknown>;
        try {
          sessionPayload = await verifyJwt(sessionToken, env.JWT_SECRET);
        } catch {
          return json({ error: 'Session expired. Please refresh and verify again.' }, 401);
        }

        if (sessionPayload.type !== 'session') {
          return json({ error: 'Invalid session.' }, 401);
        }

        const body = (await request.json()) as {
          messages?: { role: string; content: string }[];
        };
        const messages = body.messages ?? [];

        const aiStream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          stream: true,
          max_tokens: 512,
        });

        return new Response(aiStream as unknown as ReadableStream, {
          headers: {
            ...CORS,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        });
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      console.error(err);
      return json({ error: 'Internal server error' }, 500);
    }
  },
};
