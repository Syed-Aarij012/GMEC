import { prisma } from "@/backend/lib/prisma";

// Serves images uploaded through the admin panel (stored in the database).
// The id segment is "<id>.<ext>"; the extension is cosmetic, the stored
// content type is what gets sent.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = raw.replace(/\.[a-z]+$/i, "");
  const image = await prisma.uploadedImage.findUnique({ where: { id } });
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      // Ids are unique per upload, so the content never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
