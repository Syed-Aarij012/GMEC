import { NextResponse } from "next/server";
import { getAdminSession } from "@/backend/lib/admin";
import { prisma } from "@/backend/lib/prisma";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large (max 5MB)" }, { status: 400 });
  }

  // Stored in the database rather than on disk so uploads also work on
  // hosts with a read-only filesystem. Served back by /api/media/[id].
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const image = await prisma.uploadedImage.create({
      data: { contentType: file.type, data: buffer },
      select: { id: true },
    });
    return NextResponse.json({ url: `/api/media/${image.id}.${extension}` });
  } catch (err) {
    console.error("Image upload failed", err);
    return NextResponse.json({ error: "Could not save the image. Please try again." }, { status: 500 });
  }
}
