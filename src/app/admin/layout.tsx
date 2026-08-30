import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";
import AdminTopBar from "@/frontend/components/admin/AdminTopBar";
import AdminSidebar from "@/frontend/components/admin/AdminSidebar";
import AdminPageTransition from "@/frontend/components/admin/AdminPageTransition";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-canvas-soft">
      <AdminTopBar />
      <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-[220px_1fr]">
        <AdminSidebar />
        <AdminPageTransition>{children}</AdminPageTransition>
      </div>
    </div>
  );
}
