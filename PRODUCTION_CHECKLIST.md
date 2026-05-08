# Production Checklist

## Security

- [ ] RLS enabled and policies applied: `supabase/rls.sql`
- [ ] Storage bucket and policies applied: `supabase/storage.sql`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only set server-side (Vercel env var; never in client)
- [ ] Supabase Auth redirect URLs include `/<your-domain>/auth/callback`
- [ ] Password policy enforced (min 12 chars in app + Supabase settings)

## Operations

- [ ] `NEXT_PUBLIC_APP_URL` set to canonical production URL
- [ ] Health endpoint responding: `/api/health`
- [ ] CI green: lint, typecheck, unit tests, build
- [ ] Error monitoring/logging configured (console logs are compatible with Vercel logs)

## Performance & SEO

- [ ] `app/sitemap.ts` and `app/robots.ts` reachable
- [ ] Blog routes render server-side and metadata is populated per post
- [ ] Image optimization enabled (`next/image` remotePatterns for Supabase)

