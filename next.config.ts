import type { NextConfig } from "next";

const nickleToNickelSlugs = [
  "gu10-fire-rated-downlight-die-cast-tilted-twist-and-lock-gm-dtt003-satin-nickle",
  "gu10-fire-rated-downlight-changeable-bezel-gm-pcb001-satin-nickle",
  "gu10-fire-rated-downlight-compact-die-cast-twist-and-lock-gm-dts004-satin-nickle",
  "gu10-fire-rated-downlight-die-cast-twist-and-lock-gm-dt002-satin-nickle",
];

const chormeToChromeSlugs = [
  "gu10-fire-rated-downlight-changeable-bezel-gm-pcb001-chorme",
  "gu10-fire-rated-downlight-die-cast-tilted-twist-and-lock-gm-dtt003-chorme",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...nickleToNickelSlugs.map((slug) => ({
        source: `/product/${slug}`,
        destination: `/product/${slug.replace("nickle", "nickel")}`,
        permanent: true,
      })),
      ...chormeToChromeSlugs.map((slug) => ({
        source: `/product/${slug}`,
        destination: `/product/${slug.replace("chorme", "chrome")}`,
        permanent: true,
      })),
      {
        source: "/shop/cool-white-color",
        destination: "/shop/led-cool-white-bulbs",
        permanent: true,
      },
      {
        source: "/shop/warm-white-color",
        destination: "/shop/led-warm-white-bulbs",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
