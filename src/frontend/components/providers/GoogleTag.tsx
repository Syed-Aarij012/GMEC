const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-18480322920";

// Plain native <script> tags, not next/script's <Script> component: next/script
// always loads scripts via its own client-side JS loader, so even its
// "beforeInteractive" strategy never leaves a literal <script src="…gtag/js…">
// tag in the server-rendered HTML — only a <link rel="preload"> plus a
// runtime bootstrap that injects the real tag after hydration starts. A
// crawler that reads raw HTML without executing JS (as Google Ads'
// installation checker appears to) never sees that, which is why the tag
// showed as "not detected" despite loading correctly for real browsers.
// Rendering the exact tags Google gave us, as ordinary JSX elements in this
// Server Component, has them appear byte-for-byte as static HTML instead.
export default function GoogleTag() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
    </>
  );
}
