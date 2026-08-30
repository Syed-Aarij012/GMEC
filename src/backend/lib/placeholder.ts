const BG = "0b1428";
const FG = "f0ab1e";

export function placeholderImage(text: string, size = 800): string {
  const encoded = encodeURIComponent(text);
  return `https://placehold.co/${size}x${size}/${BG}/${FG}.png?font=roboto&text=${encoded}`;
}
