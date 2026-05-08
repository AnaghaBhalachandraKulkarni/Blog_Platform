import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">A production-grade blog platform</h1>
          <p className="text-muted-foreground">
            Built with Next.js App Router, Supabase Auth/Postgres/Storage, strict TypeScript, and
            security-first defaults.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/blog">Read the blog</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SSR Auth</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Secure cookie-based sessions with server components and middleware.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">RLS by default</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Policies enforce access at the database boundary.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO ready</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Metadata, sitemap, robots, OpenGraph, and canonical URLs.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

