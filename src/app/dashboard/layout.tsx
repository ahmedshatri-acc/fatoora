import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* pt-14 on mobile to clear the fixed top bar; md:pt-0 restores normal flow */}
      <main className="flex-1 overflow-auto p-4 pt-[3.75rem] md:p-8 md:pt-8">{children}</main>
    </div>
  );
}
