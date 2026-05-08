# Deployment (Vercel)

## 1) Supabase

1. Create a Supabase project.
2. In **SQL Editor**, run (in order):
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/storage.sql`
3. In **Auth → URL Configuration**:
   - Site URL: `https://<your-domain>`
   - Redirect URLs (at minimum): `https://<your-domain>/auth/callback`

## 2) Vercel project

1. Import this repo into Vercel.
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` = `https://<your-domain>`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; do **not** expose to client)
3. Deploy.

## 3) Post-deploy

- Sign up with your email and confirm.
- Promote your user to `admin` once (Supabase SQL):
  - `update public.profiles set role = 'admin' where id = '<your-user-uuid>';`
- Use `/dashboard/admin` to manage roles and moderation going forward.

