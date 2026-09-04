// Royal Mail does not expose a live pricing API (confirmed against their official
// Click & Drop OpenAPI spec — it only creates shipments/labels, no cost is ever
// returned). This replicates the same approach their old WooCommerce plugin used:
// classify the parcel into Royal Mail's published Small/Medium/Large Parcel format
// by whichever is larger — total volume or total weight — then price by weight
// within that format.
//
// IMPORTANT: the prices below are best-effort public estimates (only the Small
// Parcel up to 2kg / £3.99 figure is a confirmed current published rate). Business
// Click & Drop accounts often have negotiated rates that differ from these. Check
// your Click & Drop dashboard for your account's actual rates and update the
// RATE_TABLE below — nothing else needs to change.

export type ParcelFormat = "SMALL" | "MEDIUM" | "LARGE";

// Product prices on this site are VAT-inclusive ("Inc. VAT"), so the customer-facing
// free-delivery threshold of "£100+VAT" is £120 against our (already inc.-VAT)
// subtotal. Orders totalling exactly £120 still pay for delivery — only orders
// strictly above £120 are free.
export const FREE_DELIVERY_THRESHOLD = 120;

const LBS_TO_KG = 0.453592;
const IN_TO_CM = 2.54;

// Royal Mail's published format envelopes (each dimension checked individually —
// a long thin item can exceed a format's max length even with low total volume).
const SMALL_MAX_DIMENSIONS_CM = [45, 35, 16] as const;
const SMALL_MAX_VOLUME_CM3 = 45 * 35 * 16; // 25,200 cm³
const SMALL_MAX_WEIGHT_KG = 2;
const MEDIUM_MAX_DIMENSIONS_CM = [61, 46, 46] as const;
const MEDIUM_MAX_VOLUME_CM3 = 61 * 46 * 46; // 129,076 cm³
const MEDIUM_MAX_WEIGHT_KG = 20;

interface RateTier {
  maxWeightKg: number;
  price: number;
}

// Royal Mail Tracked 48 — verify against your Click & Drop account and adjust.
const RATE_TABLE: Record<ParcelFormat, RateTier[]> = {
  SMALL: [
    { maxWeightKg: 0.25, price: 2.79 },
    { maxWeightKg: 0.5, price: 3.29 },
    { maxWeightKg: 1, price: 3.69 },
    { maxWeightKg: 2, price: 3.99 },
  ],
  MEDIUM: [
    { maxWeightKg: 2, price: 5.49 },
    { maxWeightKg: 5, price: 7.49 },
    { maxWeightKg: 10, price: 9.99 },
    { maxWeightKg: 20, price: 13.99 },
  ],
  LARGE: [{ maxWeightKg: Infinity, price: 15.99 }],
};

const FORMAT_RANK: Record<ParcelFormat, number> = { SMALL: 0, MEDIUM: 1, LARGE: 2 };

export interface ShippableItem {
  weightLbs: number | null;
  lengthIn: number | null;
  widthIn: number | null;
  heightIn: number | null;
  quantity: number;
}

// Products missing weight/dimension data fall back to a conservative small-parcel
// estimate so checkout never breaks — better to slightly over/under-charge than fail.
const FALLBACK_WEIGHT_LBS = 0.2;
const FALLBACK_DIMENSION_IN = 4;

function formatByVolume(totalVolumeCm3: number): ParcelFormat {
  if (totalVolumeCm3 <= SMALL_MAX_VOLUME_CM3) return "SMALL";
  if (totalVolumeCm3 <= MEDIUM_MAX_VOLUME_CM3) return "MEDIUM";
  return "LARGE";
}

function formatByWeight(totalWeightKg: number): ParcelFormat {
  if (totalWeightKg <= SMALL_MAX_WEIGHT_KG) return "SMALL";
  if (totalWeightKg <= MEDIUM_MAX_WEIGHT_KG) return "MEDIUM";
  return "LARGE";
}

// A box must be at least as large as the biggest single item inside it — so a
// long/wide/tall item can force a bigger format even if it's light or thin.
function formatByDimensions(lengthCm: number, widthCm: number, heightCm: number): ParcelFormat {
  const dims = [lengthCm, widthCm, heightCm].sort((a, b) => b - a);
  const fitsSmall = dims.every((d, i) => d <= SMALL_MAX_DIMENSIONS_CM[i]);
  if (fitsSmall) return "SMALL";
  const fitsMedium = dims.every((d, i) => d <= MEDIUM_MAX_DIMENSIONS_CM[i]);
  if (fitsMedium) return "MEDIUM";
  return "LARGE";
}

function priceForFormat(format: ParcelFormat, totalWeightKg: number): number {
  const tier = RATE_TABLE[format].find((t) => totalWeightKg <= t.maxWeightKg);
  return (tier ?? RATE_TABLE[format][RATE_TABLE[format].length - 1]).price;
}

export interface ParcelClassification {
  format: ParcelFormat;
  totalWeightKg: number;
}

export function classifyParcel(items: ShippableItem[]): ParcelClassification {
  let totalWeightKg = 0;
  let totalVolumeCm3 = 0;
  let largestItemFormat: ParcelFormat = "SMALL";

  for (const item of items) {
    const weightLbs = item.weightLbs ?? FALLBACK_WEIGHT_LBS;
    const lengthIn = item.lengthIn ?? FALLBACK_DIMENSION_IN;
    const widthIn = item.widthIn ?? FALLBACK_DIMENSION_IN;
    const heightIn = item.heightIn ?? FALLBACK_DIMENSION_IN;

    const weightKg = weightLbs * LBS_TO_KG;
    const lengthCm = lengthIn * IN_TO_CM;
    const widthCm = widthIn * IN_TO_CM;
    const heightCm = heightIn * IN_TO_CM;
    const volumeCm3 = lengthCm * widthCm * heightCm;

    totalWeightKg += weightKg * item.quantity;
    totalVolumeCm3 += volumeCm3 * item.quantity;

    const itemFormat = formatByDimensions(lengthCm, widthCm, heightCm);
    if (FORMAT_RANK[itemFormat] > FORMAT_RANK[largestItemFormat]) largestItemFormat = itemFormat;
  }

  const byVolume = formatByVolume(totalVolumeCm3);
  const byWeight = formatByWeight(totalWeightKg);
  const format = [byVolume, byWeight, largestItemFormat].reduce((a, b) =>
    FORMAT_RANK[b] > FORMAT_RANK[a] ? b : a
  );

  return { format, totalWeightKg };
}

export function calculateRoyalMailShipping(items: ShippableItem[]): number {
  if (items.length === 0) return 0;
  const { format, totalWeightKg } = classifyParcel(items);
  return priceForFormat(format, totalWeightKg);
}
