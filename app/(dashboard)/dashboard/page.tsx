import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyProfile } from "@/services/profiles/queries";

export default async function DashboardHomePage() {
  const profile = await getMyProfile();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your account</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Role: <span className="font-medium text-foreground">{profile?.role ?? "reader"}</span>
        </CardContent>
      </Card>
    </div>
  );
}

