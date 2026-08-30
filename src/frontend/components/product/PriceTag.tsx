import { formatPrice } from "@/frontend/lib/utils";

export default function PriceTag({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold text-text ${sizes[size]}`}>{formatPrice(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-text/40 line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
