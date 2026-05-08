import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Cloud Blog",
    template: "%s | Cloud Blog"
  },
  description: "A production-ready Supabase + Next.js blogging platform.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: "Cloud Blog",
    description: "A production-ready Supabase + Next.js blogging platform."
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Blog",
    description: "A production-ready Supabase + Next.js blogging platform."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

