import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/services/auth/session";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold">
            Cloud Blog
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">Blog</Link>
            </Button>
            {session ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t">
        <div className="container py-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Cloud Blog
        </div>
      </footer>
    </div>
  );
}

