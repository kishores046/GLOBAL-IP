import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto text-slate-900">
        {children}
      </main>
    </div>
  );
}
