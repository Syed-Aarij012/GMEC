export function getProductImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ["https://placehold.co/800x800/0b1428/f0ab1e.png?text=GMEC"];
  } catch {
    return ["https://placehold.co/800x800/0b1428/f0ab1e.png?text=GMEC"];
  }
}
