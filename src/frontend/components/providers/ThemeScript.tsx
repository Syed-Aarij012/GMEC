import Script from "next/script";

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("gmec-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return (
    // Rendered from the root layout (app/layout.tsx), which is the supported
    // location for beforeInteractive scripts in the App Router — this rule
    // is a Pages Router holdover and false-positives here.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="theme-init" strategy="beforeInteractive">
      {THEME_INIT_SCRIPT}
    </Script>
  );
}
