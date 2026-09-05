import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { contactSchema } from "@/backend/lib/validation";
import { sendEmail } from "@/backend/lib/mailer";
import { buildContactNotificationEmail } from "@/backend/lib/emails/contactNotification";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: parsed.data });

  try {
    const { subject, html } = buildContactNotificationEmail(parsed.data);
    await sendEmail({
      to: process.env.CONTACT_NOTIFICATION_EMAIL || "info@gmeccorporation.com",
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }

  return NextResponse.json({ success: true });
}
