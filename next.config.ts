import type { NextConfig } from "next";

// Canonical production host. The old site lived on the bare (non-www)
// domain; the new site must always be served from `www`.
const CANONICAL_HOST = "gmeccorporation.com";
const CANONICAL_WWW_HOST = `www.${CANONICAL_HOST}`;

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
      // Permanent (301) host canonicalization: any request that arrives on
      // the bare `gmeccorporation.com` host — over http or https — is
      // redirected to the same path/query on `https://www.gmeccorporation.com`.
      // This must stay first in the list so it wins before the path-specific
      // fixes below, guaranteeing every non-www URL lands on the www host.
      // `/api/*` is excluded so webhooks (e.g. Stripe) and other server-to-
      // server calls are never redirected.
      {
        source: "/:path((?!api/).*)",
        has: [
          {
            type: "host",
            value: CANONICAL_HOST.replace(/\./g, "\\."),
          },
        ],
        destination: `https://${CANONICAL_WWW_HOST}/:path`,
        statusCode: 301,
      },
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
        destination: "/shop/cool-white-led-bulbs",
        permanent: true,
      },
      {
        source: "/shop/warm-white-color",
        destination: "/shop/warm-white-led-bulbs",
        permanent: true,
      },
      {
        source: "/shop/led-cool-white-bulbs",
        destination: "/shop/cool-white-led-bulbs",
        permanent: true,
      },
      {
        source: "/shop/led-warm-white-bulbs",
        destination: "/shop/warm-white-led-bulbs",
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
