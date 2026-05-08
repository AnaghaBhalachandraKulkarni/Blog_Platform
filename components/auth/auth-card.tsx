import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard({
  title,
  children,
  footer
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <div className="text-xs text-muted-foreground">
          By continuing, you agree to the platform security and content policies.
          <span className="ml-2">
            <Link href="/" className="underline underline-offset-4">
              Learn more
            </Link>
          </span>
        </div>
        {footer ? <div className="border-t pt-4 text-sm text-muted-foreground">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}

