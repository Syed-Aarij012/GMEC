import { getResend, isEmailConfigured, getEmailFrom } from "@/backend/lib/resend";
import { getSmtpTransport, isSmtpConfigured, getSmtpFrom } from "@/backend/lib/smtp";

export function isMailerConfigured(): boolean {
  return isSmtpConfigured() || isEmailConfigured();
}

export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<void> {
  if (isSmtpConfigured()) {
    const transport = getSmtpTransport()!;
    await transport.sendMail({
      from: getSmtpFrom(),
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return;
  }

  if (isEmailConfigured()) {
    const resend = getResend()!;
    await resend.emails.send({
      from: getEmailFrom(),
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }
}
