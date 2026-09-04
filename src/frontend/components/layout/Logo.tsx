import Link from "next/link";
import Image from "next/image";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center">
      <span className="flex items-center rounded-lg bg-white px-3 py-2">
        <Image
          src="/brand/gmec-logo.png"
          alt="GMEC Corporation"
          width={600}
          height={193}
          priority
          className={dark ? "h-10 w-auto sm:h-12" : "h-9 w-auto sm:h-11"}
        />
      </span>
    </Link>
  );
}
