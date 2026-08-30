import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { placeholderImage } from "../src/backend/lib/placeholder";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "led-frosted-bulbs",
    name: "LED Frosted Bulbs",
    description: "Soft, glare-free frosted LED bulbs in every common fitting.",
  },
  {
    slug: "led-filament-bulbs",
    name: "LED Filament Bulbs",
    description: "Vintage-style filament bulbs with an exposed-wire glow, perfect for feature fittings.",
  },
  {
    slug: "led-candle-bulbs",
    name: "LED Candle Bulbs",
    description: "Candle-shaped LED bulbs for chandeliers, wall lights and decorative fittings.",
  },
  {
    slug: "led-ceiling-lights",
    name: "LED Ceiling Lights",
    description: "Flush-mount and panel LED ceiling lights for even, glare-free room lighting.",
  },
  {
    slug: "led-3-colours-in-1",
    name: "LED 3 Colours in 1",
    description: "Switchable warm white, cool white and daylight in a single bulb or fitting.",
  },
  {
    slug: "cool-white-color",
    name: "Cool White Colour",
    description: "Crisp, energising cool white lighting for kitchens, bathrooms and workspaces.",
  },
  {
    slug: "warm-white-color",
    name: "Warm White Colour",
    description: "Soft, inviting warm white lighting for living spaces and bedrooms.",
  },
  {
    slug: "gu10-downlights",
    name: "GU10 Downlights",
    description: "Fire-rated and adjustable GU10 recessed downlights for every room.",
  },
  {
    slug: "led-rgb-lights",
    name: "LED RGB Lights",
    description: "App and voice-controlled colour-changing bulbs, strips and panels.",
  },
  {
    slug: "smart-gadgets",
    name: "Smart Gadgets",
    description: "Smart alarms, doorbells, scales and connected devices for the smart home.",
  },
] as const;

type Fitting = "GU10" | "E14" | "B22" | "E27" | null;

interface SeedProduct {
  slug: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: (typeof categories)[number]["slug"];
  fitting?: Fitting;
  wattage?: string;
  colour?: string;
  featured?: boolean;
  stock?: number;
}

const products: SeedProduct[] = [
  // LED Frosted Bulbs
  { slug: "gu10-frosted-led-5w-warm-white", name: "GU10 Frosted LED Bulb 5W", sku: "GMC-FR-GU10-5W-WW", description: "A frosted-glass GU10 LED bulb that softens glare while keeping full brightness, ideal for kitchens and living spaces.", price: 3.49, compareAtPrice: 5.99, category: "led-frosted-bulbs", fitting: "GU10", wattage: "5W", colour: "Warm White", featured: true },
  { slug: "e27-frosted-led-gls-9w-warm-white", name: "E27 Frosted LED GLS Bulb 9W", sku: "GMC-FR-E27-9W-WW", description: "A classic frosted E27 GLS bulb that diffuses light evenly, replacing 60W incandescent bulbs.", price: 3.29, category: "led-frosted-bulbs", fitting: "E27", wattage: "9W", colour: "Warm White" },
  { slug: "b22-frosted-led-gls-9w-cool-white", name: "B22 Frosted LED GLS Bulb 9W", sku: "GMC-FR-B22-9W-CW", description: "A bayonet-cap frosted LED bulb with soft, glare-free cool white light for everyday rooms.", price: 3.29, category: "led-frosted-bulbs", fitting: "B22", wattage: "9W", colour: "Cool White" },
  { slug: "e14-frosted-led-golf-ball-5w-warm-white", name: "E14 Frosted LED Golf Ball Bulb 5W", sku: "GMC-FR-E14-5W-WW", description: "A small-screw frosted golf ball bulb, perfect for decorative fittings and wall lights.", price: 2.99, category: "led-frosted-bulbs", fitting: "E14", wattage: "5W", colour: "Warm White" },

  // LED Filament Bulbs
  { slug: "e27-globe-filament-6w-vintage-amber", name: "E27 Globe Filament Bulb 6W", sku: "GMC-FIL-E27-6W-GLOBE", description: "A statement round globe filament bulb, popular in exposed-fitting pendant lights and festoon displays.", price: 5.49, category: "led-filament-bulbs", fitting: "E27", wattage: "6W", colour: "Vintage Amber", featured: true },
  { slug: "e14-twisted-filament-st64-6w-amber", name: "E14 Twisted Filament ST64 Bulb 6W", sku: "GMC-FIL-E14-6W-ST64", description: "A stylish ST64 twisted-filament bulb that makes a feature of the light source itself, perfect for exposed fittings.", price: 6.99, category: "led-filament-bulbs", fitting: "E14", wattage: "6W", colour: "Amber" },
  { slug: "b22-filament-gls-6w-warm-white", name: "B22 Filament GLS Bulb 6W", sku: "GMC-FIL-B22-6W-WW", description: "A bayonet-cap filament GLS bulb with a warm vintage glow, ideal for open fittings.", price: 4.99, category: "led-filament-bulbs", fitting: "B22", wattage: "6W", colour: "Warm White" },
  { slug: "e27-filament-squirrel-cage-4w-amber", name: "E27 Filament Squirrel Cage Bulb 4W", sku: "GMC-FIL-E27-4W-SQC", description: "A characterful squirrel-cage filament bulb with a decorative amber-tinted finish.", price: 6.49, category: "led-filament-bulbs", fitting: "E27", wattage: "4W", colour: "Amber" },

  // LED Candle Bulbs
  { slug: "e14-candle-led-4w-warm-white", name: "E14 Candle LED Bulb 4W", sku: "GMC-CND-E14-4W-WW", description: "A small-screw candle-shaped LED bulb offering soft warm white light for chandeliers and wall lights.", price: 2.79, category: "led-candle-bulbs", fitting: "E14", wattage: "4W", colour: "Warm White", featured: true },
  { slug: "b22-candle-led-4w-warm-white", name: "B22 Candle LED Bulb 4W", sku: "GMC-CND-B22-4W-WW", description: "A bayonet-fit candle bulb offering soft warm white light for chandeliers and wall lights.", price: 2.89, category: "led-candle-bulbs", fitting: "B22", wattage: "4W", colour: "Warm White" },
  { slug: "e14-candle-filament-4w-amber", name: "E14 Candle Filament Bulb 4W", sku: "GMC-CND-E14-4W-FIL", description: "A decorative E14 candle-shaped filament LED bulb with an amber glass finish for a warm vintage glow.", price: 3.79, category: "led-candle-bulbs", fitting: "E14", wattage: "4W", colour: "Amber" },
  { slug: "e14-twist-candle-led-5w-warm-white", name: "E14 Twist Candle LED Bulb 5W", sku: "GMC-CND-E14-5W-TW", description: "A twisted-tip candle bulb that adds a decorative flourish to exposed candelabra fittings.", price: 3.29, category: "led-candle-bulbs", fitting: "E14", wattage: "5W", colour: "Warm White" },

  // LED Ceiling Lights
  { slug: "flush-mount-led-ceiling-light-24w", name: "Flush Mount LED Ceiling Light 24W", sku: "GMC-CL-24W-RND", description: "A round flush-mount LED ceiling light providing even, glare-free illumination for bedrooms and hallways.", price: 24.99, compareAtPrice: 32.99, category: "led-ceiling-lights", wattage: "24W", colour: "Warm White", featured: true },
  { slug: "square-led-panel-ceiling-light-18w", name: "Square LED Panel Ceiling Light 18W", sku: "GMC-CL-18W-SQ", description: "A slimline square LED panel light, ideal for kitchens, offices and modern living spaces.", price: 21.99, category: "led-ceiling-lights", wattage: "18W", colour: "Cool White" },
  { slug: "flush-mount-led-ceiling-light-36w", name: "Flush Mount LED Ceiling Light 36W", sku: "GMC-CL-36W-RND", description: "A large round flush-mount LED ceiling light for bright, even coverage in bigger rooms.", price: 32.99, category: "led-ceiling-lights", wattage: "36W", colour: "Cool White" },
  { slug: "bathroom-ip44-led-ceiling-light-18w", name: "Bathroom IP44 LED Ceiling Light 18W", sku: "GMC-CL-18W-IP44", description: "A moisture-resistant IP44-rated ceiling light, safe for use in bathrooms and utility rooms.", price: 19.99, category: "led-ceiling-lights", wattage: "18W", colour: "Warm White" },

  // LED 3 Colours in 1
  { slug: "gu10-3-colours-in-1-5w", name: "GU10 LED 3 Colours in 1 Bulb 5W", sku: "GMC-3C1-GU10-5W", description: "Switch between warm white, cool white and daylight on the same GU10 bulb, no need to stock three separate colours.", price: 4.49, category: "led-3-colours-in-1", fitting: "GU10", wattage: "5W", colour: "3 Colours in 1", featured: true },
  { slug: "e27-3-colours-in-1-9w", name: "E27 LED 3 Colours in 1 Bulb 9W", sku: "GMC-3C1-E27-9W", description: "A screw-fit E27 bulb with a built-in switch to select warm white, cool white or daylight.", price: 4.99, category: "led-3-colours-in-1", fitting: "E27", wattage: "9W", colour: "3 Colours in 1" },
  { slug: "led-3-colours-in-1-ceiling-panel-24w", name: "LED 3 Colours in 1 Ceiling Panel 24W", sku: "GMC-3C1-CL-24W", description: "A flush ceiling panel with selectable colour temperature, so one fitting suits any room.", price: 27.99, category: "led-3-colours-in-1", wattage: "24W", colour: "3 Colours in 1" },
  { slug: "gu10-3-cct-fire-rated-downlight-5w", name: "GU10 3-CCT Fire-Rated Downlight 5W", sku: "GMC-3C1-DL-5W", description: "A fire-rated downlight with switchable colour temperature, built into a fully fire-rated housing.", price: 9.99, category: "led-3-colours-in-1", fitting: "GU10", wattage: "5W", colour: "3 Colours in 1" },

  // Cool White Colour
  { slug: "gu10-led-spotlight-7w-cool-white", name: "GU10 LED Spotlight Bulb 7W", sku: "GMC-CW-GU10-7W", description: "A brighter 7W GU10 LED spotlight with crisp cool white light, perfect for task lighting in kitchens and bathrooms.", price: 3.99, category: "cool-white-color", fitting: "GU10", wattage: "7W", colour: "Cool White", featured: true },
  { slug: "b22-led-gls-9w-cool-white", name: "B22 LED GLS Bulb 9W", sku: "GMC-CW-B22-9W", description: "A bayonet-cap B22 LED GLS bulb with cool white light output, suited to everyday living areas.", price: 3.29, category: "cool-white-color", fitting: "B22", wattage: "9W", colour: "Cool White" },
  { slug: "e27-led-gls-12w-cool-white", name: "E27 LED GLS Bulb 12W", sku: "GMC-CW-E27-12W", description: "A high-output 12W E27 LED bulb with cool white tone, equivalent to a 100W traditional bulb.", price: 4.49, category: "cool-white-color", fitting: "E27", wattage: "12W", colour: "Cool White" },
  { slug: "square-led-panel-light-18w-cool-white", name: "Square LED Panel Light 18W", sku: "GMC-CW-PANEL-18W", description: "A slimline cool white LED panel light, ideal for kitchens, offices and workspaces.", price: 21.99, category: "cool-white-color", wattage: "18W", colour: "Cool White" },

  // Warm White Colour
  { slug: "gu10-led-spotlight-5w-warm-white", name: "GU10 LED Spotlight Bulb 5W", sku: "GMC-WW-GU10-5W", description: "A compact GU10 LED spotlight bulb delivering warm, inviting light with instant full brightness and no flicker.", price: 3.49, compareAtPrice: 5.99, category: "warm-white-color", fitting: "GU10", wattage: "5W", colour: "Warm White", featured: true },
  { slug: "e27-led-gls-9w-warm-white", name: "E27 LED GLS Bulb 9W", sku: "GMC-WW-E27-9W", description: "A classic-shaped E27 LED bulb replacing 60W incandescent bulbs, using a fraction of the energy.", price: 3.29, category: "warm-white-color", fitting: "E27", wattage: "9W", colour: "Warm White" },
  { slug: "e14-led-golf-ball-5w-warm-white", name: "E14 LED Golf Ball Bulb 5W", sku: "GMC-WW-E14-5W", description: "A small-screw E14 golf ball LED bulb, ideal for decorative fittings, wall lights and chandeliers.", price: 2.99, category: "warm-white-color", fitting: "E14", wattage: "5W", colour: "Warm White" },
  { slug: "flush-mount-ceiling-light-24w-warm-white", name: "Flush Mount Ceiling Light 24W", sku: "GMC-WW-CL-24W", description: "A warm white flush-mount ceiling light for a cosy, inviting glow in bedrooms and living rooms.", price: 24.99, category: "warm-white-color", wattage: "24W", colour: "Warm White" },

  // GU10 Downlights
  { slug: "fire-rated-gu10-downlight-5w-white", name: "Fire-Rated GU10 Downlight 5W", sku: "GMC-DL-GU10-5W-FR", description: "A fully fire-rated recessed GU10 downlight offering 30 minutes of fire protection, with a clean white bezel finish.", price: 8.99, category: "gu10-downlights", fitting: "GU10", wattage: "5W", colour: "Warm White", featured: true },
  { slug: "adjustable-gu10-downlight-7w-chrome", name: "Adjustable GU10 Downlight 7W", sku: "GMC-DL-GU10-7W-ADJ", description: "A tiltable GU10 downlight with a brushed chrome bezel, letting you direct light exactly where it's needed.", price: 10.49, category: "gu10-downlights", fitting: "GU10", wattage: "7W", colour: "Cool White" },
  { slug: "bathroom-ip65-gu10-downlight-6w", name: "Bathroom IP65 GU10 Downlight 6W", sku: "GMC-DL-GU10-6W-IP65", description: "A splash-proof IP65-rated GU10 downlight, safe for use in bathroom zones 1 and 2.", price: 9.49, category: "gu10-downlights", fitting: "GU10", wattage: "6W", colour: "Warm White" },
  { slug: "slim-gu10-downlight-5w-black", name: "Slim GU10 Downlight 5W", sku: "GMC-DL-GU10-5W-BLK", description: "A low-profile GU10 downlight with a sleek black bezel for a modern, minimal ceiling finish.", price: 9.99, category: "gu10-downlights", fitting: "GU10", wattage: "5W", colour: "Cool White" },

  // LED RGB Lights
  { slug: "smart-wifi-rgb-gu10-bulb", name: "Smart WiFi RGB GU10 Bulb", sku: "GMC-RGB-GU10", description: "Control colour, brightness and schedules from your phone or voice assistant with this app-enabled GU10 bulb.", price: 8.99, category: "led-rgb-lights", fitting: "GU10", colour: "16 Million Colours", featured: true },
  { slug: "smart-led-strip-light-5m-rgbic", name: "Smart LED Strip Light 5m RGBIC", sku: "GMC-RGB-STRIP-5M", description: "A 5-metre RGBIC LED strip with multi-colour zones, music sync and app control for feature walls and shelves.", price: 19.99, compareAtPrice: 26.99, category: "led-rgb-lights", colour: "RGBIC", featured: true },
  { slug: "smart-rgb-ceiling-panel-light-30w", name: "Smart RGB Ceiling Panel Light 30W", sku: "GMC-RGB-PANEL-30W", description: "A colour-changing ceiling panel light with app scenes and dimming, bright enough for full-room lighting.", price: 34.99, category: "led-rgb-lights", wattage: "30W", colour: "16 Million Colours" },
  { slug: "smart-wifi-e27-rgb-bulb", name: "Smart WiFi E27 RGB Bulb", sku: "GMC-RGB-E27", description: "A screw-fit E27 smart bulb with colour-changing and dimming, controllable via app or voice assistant.", price: 8.49, category: "led-rgb-lights", fitting: "E27", colour: "16 Million Colours" },

  // Smart Gadgets
  { slug: "wireless-smoke-alarm-10-year-battery", name: "Wireless Smoke Alarm with 10-Year Battery", sku: "GMC-GDG-SMOKE-10Y", description: "A sealed 10-year battery smoke alarm with no beeping low-battery warnings and easy test button.", price: 14.99, category: "smart-gadgets", featured: true },
  { slug: "smart-wifi-smoke-co2-detector", name: "Smart WiFi Smoke & CO2 Detector", sku: "GMC-GDG-SMOKE-WIFI", description: "Get instant phone alerts for smoke or carbon monoxide, wherever you are, with this connected detector.", price: 29.99, category: "smart-gadgets" },
  { slug: "smart-video-doorbell", name: "Smart Video Doorbell", sku: "GMC-GDG-DOORBELL", description: "HD video, two-way talk and motion alerts straight to your phone, see who's at the door from anywhere.", price: 49.99, compareAtPrice: 64.99, category: "smart-gadgets", featured: true },
  { slug: "smart-bluetooth-body-fat-scale", name: "Smart Bluetooth Body Fat Scale", sku: "GMC-GDG-SCALE", description: "Track weight, body fat, BMI and more, synced automatically to a companion fitness app over Bluetooth.", price: 22.99, category: "smart-gadgets" },
  { slug: "smart-wifi-plug-socket-2-pack", name: "Smart WiFi Plug Socket (2-Pack)", sku: "GMC-GDG-PLUG2", description: "Turn any appliance smart, schedule, time and control your devices remotely from your phone.", price: 15.99, category: "smart-gadgets", featured: true },
  { slug: "smart-home-hub-controller", name: "Smart Home Hub Controller", sku: "GMC-GDG-HUB", description: "The central hub that brings your smart bulbs, plugs and sensors together into one simple app.", price: 32.99, category: "smart-gadgets" },
];

async function main() {
  console.log("Clearing old catalog data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();

  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: placeholderImage(c.name, 600) },
      create: {
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: placeholderImage(c.name, 600),
      },
    });
    categoryIdBySlug.set(c.slug, created.id);
  }

  console.log("Seeding products...");
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.category);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        images: JSON.stringify([placeholderImage(p.name), placeholderImage(`${p.name} - view 2`)]),
        categoryId,
        fitting: p.fitting ?? null,
        wattage: p.wattage ?? null,
        colour: p.colour ?? null,
        featured: p.featured ?? false,
        stock: p.stock ?? 100,
      },
      create: {
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        images: JSON.stringify([placeholderImage(p.name), placeholderImage(`${p.name} - view 2`)]),
        categoryId,
        fitting: p.fitting ?? null,
        wattage: p.wattage ?? null,
        colour: p.colour ?? null,
        featured: p.featured ?? false,
        stock: p.stock ?? 100,
      },
    });
  }

  console.log("Seeding users...");
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@gmeccorporation.com" },
    update: {},
    create: {
      name: "GMEC Admin",
      email: "admin@gmeccorporation.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("Customer123!", 10);
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
