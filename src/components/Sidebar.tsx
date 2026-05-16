"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, PlusCircle, Users, Package, BarChart3, Settings, LogOut, Receipt, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();

  const navItems = [
    { href: "/dashboard", label: t.sidebar.dashboard, icon: LayoutDashboard },
    { href: "/dashboard/invoices", label: t.sidebar.invoices, icon: FileText },
    { href: "/dashboard/invoices/new", label: t.sidebar.newInvoice, icon: PlusCircle },
    { href: "/dashboard/clients", label: t.sidebar.clients, icon: Users },
    { href: "/dashboard/items", label: t.sidebar.items, icon: Package },
    { href: "/dashboard/reports", label: t.sidebar.reports, icon: BarChart3 },
    { href: "/dashboard/settings", label: t.sidebar.settings, icon: Settings },
  ];

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-1">
        <div className="flex items-center justify-between px-3 py-1">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t.sidebar.logout}
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-full w-56 flex-col border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
          <Receipt className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">Wathq</span>
        </div>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">Wathq</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LocaleSwitcher />
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="فتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer panel */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Wathq</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavContent onClose={() => setMobileOpen(false)} />
      </div>
    </>
  );
}
