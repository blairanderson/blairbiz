import { EmailMessage } from 'cloudflare:email';
import type { Env } from './index';

export async function sendOtp(env: Env, toEmail: string, otp: string): Promise<void> {
  const from = env.FROM_ADDRESS;

  const raw = [
    `From: Blair Anderson <${from}>`,
    `To: ${toEmail}`,
    `Subject: Your blair.biz verification code`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    `Your verification code for blair.biz is:`,
    ``,
    `    ${otp}`,
    ``,
    `This code is valid for 10 minutes.`,
    `If you didn't request this, you can safely ignore this email.`,
    ``,
    `— Blair Anderson`,
    `   blair.biz`,
  ].join('\r\n');

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(raw));
      controller.close();
    },
  });

  // In local dev (wrangler dev), SEND_EMAIL binding is unavailable.
  // The OTP is logged to the console so you can still test the flow.
  if (!env.SEND_EMAIL) {
    console.log(`[DEV] OTP for ${toEmail}: ${otp}`);
    return;
  }

  const message = new EmailMessage(from, toEmail, stream);
  await env.SEND_EMAIL.send(message);
}
