import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}
