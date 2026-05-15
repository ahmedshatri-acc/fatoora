"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Receipt,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/dashboard/invoices", label: "الفواتير", icon: FileText },
  { href: "/dashboard/invoices/new", label: "فاتورة جديدة", icon: PlusCircle },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

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
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
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
      <aside className="hidden md:flex h-full w-56 flex-col border-r border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-4">
          <Receipt className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-gray-900">فاتورة</span>
        </div>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold text-gray-900">فاتورة</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-900">فاتورة</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
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
