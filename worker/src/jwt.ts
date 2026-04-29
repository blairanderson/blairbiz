// HMAC-SHA256 JWT — zero dependencies, uses Workers built-in Web Crypto

function b64urlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signJwt(
  payload: Record<string, unknown>,
  secret: string,
): Promise<string> {
  const enc = new TextEncoder();
  const header = b64urlEncode(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const signingInput = `${header}.${body}`;

  const key = await importKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput));

  return `${signingInput}.${b64urlEncode(sig)}`;
}

export async function verifyJwt(
  token: string,
  secret: string,
): Promise<Record<string, unknown>> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');

  const [header, body, sigB64] = parts;
  const signingInput = `${header}.${body}`;

  const key = await importKey(secret);
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    b64urlDecode(sigB64),
    new TextEncoder().encode(signingInput),
  );
  if (!valid) throw new Error('Invalid signature');

  const payload = JSON.parse(
    new TextDecoder().decode(b64urlDecode(body)),
  ) as Record<string, unknown>;

  if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}
