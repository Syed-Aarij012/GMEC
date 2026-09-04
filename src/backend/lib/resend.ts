import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getEmailFrom(): string {
  return process.env.RESEND_FROM_EMAIL ?? "GMEC Corporation <onboarding@resend.dev>";
}
