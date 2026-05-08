import { redirect } from "next/navigation";
import { getMyProfile } from "@/services/profiles/queries";

export async function requireAdmin() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");
  return profile;
}

