"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ShoppingCart, Heart, User, Phone, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useCartStore } from "@/frontend/store/cart";
import { useWishlistStore } from "@/frontend/store/wishlist";
import { useMounted } from "@/frontend/hooks/useMounted";

interface CategoryLink {
  slug: string;
  name: string;
}

export default function Header({ categories }: { categories: CategoryLink[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistItems = useWishlistStore((s) => s.totalItems());
  const mounted = useMounted();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    setMobileOpen(false);
  }

  return (
    <header className="relative z-50 bg-canvas shadow-sm print:hidden">
      <div className="hidden bg-ink-950 text-cream-100 md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p>Free UK delivery on orders over £100 +VAT · 14-day returns</p>
          <a href="tel:+447951282482" className="flex items-center gap-1.5 hover:text-gold-400">
            <Phone className="h-3.5 w-3.5" />
            +44 7951 282482
          </a>
        </div>
      </div>

      <div className="container-page flex h-[4.5rem] items-center gap-4 py-3 md:h-20">
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6 text-text" />
        </button>

        <Logo />

        <form
          onSubmit={handleSearch}
          className="mx-auto hidden max-w-xl flex-1 md:flex"
        >
          <div className="relative w-full">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bulbs, fittings, smart gadgets..."
              suppressHydrationWarning
              className="w-full rounded-full border border-line/10 bg-canvas-soft py-2.5 pl-4 pr-11 text-sm outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
            <button
              type="submit"
              aria-label="Search"
              suppressHydrationWarning
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-ink-900 p-1.5 text-white hover:bg-gold-600"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-5">
          {session ? (
            <div className="group relative hidden md:block">
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-sm font-medium text-text hover:text-gold-600"
              >
                <User className="h-5 w-5" />
                {session.user.name?.split(" ")[0] ?? "Account"}
              </Link>
              <div className="invisible absolute right-0 top-full w-40 -translate-y-1 rounded-lg border border-line/10 bg-canvas py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link href="/account" className="block px-4 py-2 text-sm hover:bg-canvas-muted">
                  My Account
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-canvas-muted">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-canvas-muted"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-1.5 text-sm font-medium text-text hover:text-gold-600 md:flex"
            >
              <User className="h-5 w-5" />
              Login
            </Link>
          )}

          <ThemeToggle className="hidden md:flex" />

          <Link href="/wishlist" aria-label="Wishlist" className="relative hidden items-center text-text hover:text-gold-600 md:flex">
            <Heart className="h-6 w-6" />
            <AnimatePresence>
              {mounted && wishlistItems > 0 && (
                <motion.span
                  key={wishlistItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-ink-950"
                >
                  {wishlistItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative flex items-center text-text hover:text-gold-600">
            <ShoppingCart className="h-6 w-6" />
            <AnimatePresence>
              {mounted && totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-ink-950"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      <nav className="hidden border-t border-line/10 bg-ink-900 md:block">
        <div className="container-page flex h-11 items-center gap-2 text-sm font-medium text-cream-100">
          <div className="group relative shrink-0 pr-6">
            <Link
              href="/shop"
              className="flex items-center gap-1 whitespace-nowrap py-2.5 hover:text-gold-400"
            >
              Shop All <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-56 -translate-y-1 rounded-lg border border-line/10 bg-canvas py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  className="block px-4 py-2 text-sm text-text hover:bg-canvas-muted"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="group flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-10 group-hover:[animation-play-state:paused]">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  className="shrink-0 whitespace-nowrap hover:text-gold-400"
                >
                  {c.name}
                </Link>
              ))}
              {/* Visual-only repeat for the seamless scroll loop; hidden from crawlers/AT so links aren't triplicated in the DOM's semantic content. */}
              <div className="flex shrink-0 items-center gap-10" aria-hidden="true">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop/${c.slug}`}
                    tabIndex={-1}
                    className="shrink-0 whitespace-nowrap hover:text-gold-400"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-6 pl-4">
            <Link href="/about" className="whitespace-nowrap hover:text-gold-400">
              About Us
            </Link>
            <Link href="/contact" className="whitespace-nowrap hover:text-gold-400">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-canvas p-5"
            >
            <div className="mb-5 flex items-center justify-between">
              <Logo />
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSearch} className="mb-5 flex">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                suppressHydrationWarning
                className="w-full rounded-l-full border border-line/10 bg-canvas-soft px-4 py-2 text-sm outline-none"
              />
              <button type="submit" suppressHydrationWarning className="rounded-r-full bg-ink-900 px-3 text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <nav className="flex flex-col gap-1 text-sm font-medium text-text">
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-canvas-muted">
                Shop All
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-canvas-muted">
                Wishlist
                {wishlistItems > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-ink-950">
                    {wishlistItems}
                  </span>
                )}
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 hover:bg-canvas-muted"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/about" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-canvas-muted">
                About Us
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-canvas-muted">
                Contact Us
              </Link>
              <div className="my-2 border-t border-line/10" />
              {session ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-canvas-muted">
                    My Account
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-canvas-muted">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="rounded-lg px-3 py-2.5 text-left hover:bg-canvas-muted"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-canvas-muted">
                  Login / Register
                </Link>
              )}
            </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
