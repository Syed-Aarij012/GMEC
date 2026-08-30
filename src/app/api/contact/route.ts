import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { contactSchema } from "@/backend/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: parsed.data });

  return NextResponse.json({ success: true });
}
