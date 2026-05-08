# Cloud Blog Platform (Next.js + Supabase)

## Prereqs

- Node.js 20+
- A Supabase project (Auth + Postgres + Storage)

## Environment

1. Copy `.env.example` to `.env.local`
2. Fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only; required for admin role management)
   - `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)

## Supabase SQL

Run these in Supabase SQL Editor (in order):

1. `supabase/schema.sql`
2. `supabase/rls.sql`
3. `supabase/storage.sql`

## Local development

```bash
npm install
npm run dev
```

App:

- Public blog: `/blog`
- Auth: `/login`, `/signup`, `/reset-password`
- Dashboard: `/dashboard`

## Docker

```bash
docker compose up --build
```

## Production notes

- Set `NEXT_PUBLIC_APP_URL` to your canonical URL (e.g. `https://your-domain.com`)
- Configure Supabase Auth redirect URLs to include:
  - `https://your-domain.com/auth/callback`
- Use Supabase Storage bucket `post-images` as defined in `supabase/storage.sql`

