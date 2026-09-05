interface ContactNotificationParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function buildContactNotificationEmail(params: ContactNotificationParams): {
  subject: string;
  html: string;
} {
  const { name, email, subject, message } = params;

  const html = `
  <div style="background:#f3f4f6;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="height:6px;background:linear-gradient(to right,#f0ab1e,#d1900f);"></div>
      <div style="padding:32px;">
        <p style="margin:0;color:#d1900f;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">GMEC Corporation</p>
        <h1 style="margin:8px 0 20px;color:#111827;font-size:20px;">New Contact Form Message</h1>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#6b7280;font-size:13px;width:80px;">From</td>
            <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:bold;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td>
            <td style="padding:6px 0;color:#111827;font-size:14px;">
              <a href="mailto:${escapeHtml(email)}" style="color:#d1900f;text-decoration:none;">${escapeHtml(email)}</a>
            </td>
          </tr>
          ${
            subject
              ? `<tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:13px;">Subject</td>
                  <td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(subject)}</td>
                </tr>`
              : ""
          }
        </table>

        <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:12px;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</div>

        <p style="margin:24px 0 0;text-align:center;">
          <a href="mailto:${escapeHtml(email)}" style="display:inline-block;background:#0b1428;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:999px;font-size:13px;font-weight:bold;">
            Reply to ${escapeHtml(name)}
          </a>
        </p>
      </div>
    </div>
  </div>`;

  return {
    subject: `New contact message${subject ? `: ${subject}` : ""} — from ${name}`,
    html,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
