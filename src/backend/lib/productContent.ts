// Generates the "Key Features" / "Specifications" / "Ideal Applications"
// copy shown on the product page. Everything here is either pulled straight
// from real product data (fitting, wattage, colour, and any lumens/colour
// temperature already present in the product name) or is generic,
// non-specific language about the fixture type — nothing invents a
// technical spec (CRI, exact lifespan hours, beam angle, etc.) that we
// don't actually have data for.

export function parseLumens(name: string): string | null {
  const m = name.match(/(\d{2,5})\s*Lumens/i);
  return m ? `${m[1]} Lumens` : null;
}

export function parseColourTemp(name: string): string | null {
  const m = name.match(/(\d{4})\s*K\b/i);
  return m ? `${m[1]}K` : null;
}

interface ProductLike {
  name: string;
  fitting: string | null;
  wattage: string | null;
  colour: string | null;
}

export function getKeyFeatures(product: ProductLike, categoryName: string): string[] {
  const lumens = parseLumens(product.name);
  const colourTemp = parseColourTemp(product.name);
  const features: string[] = [];

  if (product.wattage && product.fitting) {
    features.push(`${product.wattage} ${product.fitting} LED, energy-efficient illumination with low running costs.`);
  } else if (product.wattage) {
    features.push(`${product.wattage} LED, energy-efficient illumination with low running costs.`);
  }

  if (product.colour) {
    features.push(
      `${product.colour} light${colourTemp ? ` (${colourTemp})` : ""}, consistent, even colour suited to everyday use.`
    );
  }

  if (lumens) {
    features.push(`${lumens} output, bright and dependable illumination for the space it's fitted in.`);
  }

  features.push(`${categoryName} design, built to fit standard UK fixtures without modification.`);
  features.push("Instant full brightness, switches on immediately with no warm-up delay.");
  features.push("Long-lasting LED, built for reliable, low-maintenance everyday performance.");

  return features;
}

export function getSpecRows(
  product: ProductLike & { sku: string },
  categoryName: string
): { label: string; value: string }[] {
  const lumens = parseLumens(product.name);
  const colourTemp = parseColourTemp(product.name);

  return [
    { label: "Product Type", value: categoryName },
    product.fitting && { label: "Fitting", value: product.fitting },
    product.wattage && { label: "Wattage", value: product.wattage },
    product.colour && { label: "Colour", value: product.colour },
    colourTemp && { label: "Colour Temperature", value: colourTemp },
    lumens && { label: "Luminous Output", value: lumens },
    { label: "SKU", value: product.sku },
  ].filter(Boolean) as { label: string; value: string }[];
}

const APPLICATIONS_BY_CATEGORY: Record<string, string[]> = {
  "led-frosted-bulbs": [
    "Living rooms and bedrooms",
    "Kitchens and dining areas",
    "Hallways and landings",
    "Table and floor lamps",
    "General household fittings",
  ],
  "led-filament-bulbs": [
    "Feature pendant fittings",
    "Exposed-bulb fixtures",
    "Cafes, bars and retail displays",
    "Living rooms and dining areas",
    "Decorative lamp fittings",
  ],
  "led-candle-bulbs": [
    "Chandeliers and decorative fittings",
    "Wall lights and wall sconces",
    "Bedside and table lamps",
    "Dressing rooms and vanity units",
    "Hallways and entrances",
  ],
  "led-ceiling-lights": [
    "Hallways and landings",
    "Kitchens and utility rooms",
    "Garages and workshops",
    "Offices and commercial spaces",
    "Stairwells and communal areas",
  ],
  "led-3-colours-in-1": [
    "Living rooms and bedrooms",
    "Home offices and studies",
    "Kitchens and dining areas",
    "Anywhere you want flexible warm-to-cool lighting",
  ],
  "cool-white-led-bulbs": [
    "Kitchens and workspaces",
    "Bathrooms and utility rooms",
    "Offices and commercial units",
    "Garages and workshops",
  ],
  "warm-white-led-bulbs": [
    "Living rooms and bedrooms",
    "Dining areas",
    "Hallways and entrances",
    "Anywhere a soft, relaxing light is wanted",
  ],
  "gu10-downlights": [
    "Kitchens and bathrooms",
    "Hallways and entrances",
    "Offices and retail spaces",
    "Recessed ceiling fittings throughout the home",
  ],
  "led-rgb-lights": [
    "Home entertainment and media rooms",
    "Mood and accent lighting",
    "Parties and events",
    "Bedrooms and living spaces",
  ],
  "smart-gadgets": [
    "Homes and flats of any size",
    "Kitchens and hallways (smoke/CO detection)",
    "Landlord and rental property compliance",
    "Everyday household use",
  ],
};

export function getApplications(categorySlug: string): string[] {
  return APPLICATIONS_BY_CATEGORY[categorySlug] ?? [
    "Homes and everyday household use",
    "Compatible standard UK fittings",
  ];
}
