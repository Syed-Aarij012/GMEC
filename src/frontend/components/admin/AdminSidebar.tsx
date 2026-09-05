"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Users, MessageSquare } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-2xl border border-line/10 bg-canvas p-3">
      <p className="px-2.5 py-2 text-xs font-bold uppercase tracking-wide text-text/40">
        Admin Panel
      </p>
      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
          return (
            <Link key={href} href={href} className="relative block">
              {isActive && (
                <motion.span
                  layoutId="admin-nav-active"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-ink-900"
                />
              )}
              <span
                className={cn(
                  "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-text hover:bg-canvas-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
