"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ExternalLink, LogOut } from "lucide-react";
import Logo from "@/frontend/components/layout/Logo";
import ThemeToggle from "@/frontend/components/layout/ThemeToggle";

export default function AdminTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-canvas">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />
        <span className="rounded-full bg-canvas-muted px-3 py-1 text-xs font-bold uppercase tracking-wide text-text/60">
          Admin
        </span>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-text hover:bg-canvas-muted"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-text hover:bg-canvas-muted"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
