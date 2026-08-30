import Link from "next/link";
import { Zap } from "lucide-react";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 text-ink-950">
        <Zap className="h-5 w-5" fill="currentColor" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-xl font-extrabold tracking-tight ${
            dark ? "text-white" : "text-text"
          }`}
        >
          GMEC
        </span>
        <span
          className={`text-[10px] font-semibold tracking-[0.2em] ${
            dark ? "text-gold-400" : "text-gold-600"
          }`}
        >
          CORPORATION
        </span>
      </span>
    </Link>
  );
}
