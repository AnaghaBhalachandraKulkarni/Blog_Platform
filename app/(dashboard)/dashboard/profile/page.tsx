import { redirect } from "next/navigation";
import { getMyProfile } from "@/services/profiles/queries";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Update your public profile information.</p>
      </div>
      <ProfileForm initial={profile} />
    </div>
  );
}

