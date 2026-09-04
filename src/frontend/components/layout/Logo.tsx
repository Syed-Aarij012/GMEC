import Link from "next/link";
import Image from "next/image";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center">
      <span className="flex items-center rounded-lg bg-white px-2.5 py-1.5">
        <Image
          src="/brand/gmec-logo.png"
          alt="GMEC Corporation"
          width={600}
          height={193}
          priority
          className={dark ? "h-8 w-auto sm:h-9" : "h-7 w-auto sm:h-8"}
        />
      </span>
    </Link>
  );
}
