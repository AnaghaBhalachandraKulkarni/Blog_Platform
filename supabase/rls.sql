-- Row Level Security Policies

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_images enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES: users can read public profile data, update only their own.
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- POSTS:
-- Public can read published posts.
drop policy if exists "posts_select_published" on public.posts;
create policy "posts_select_published"
on public.posts
for select
to anon, authenticated
using (published = true);

-- Authors can read their own drafts; admins can read all.
drop policy if exists "posts_select_owner_or_admin" on public.posts;
create policy "posts_select_owner_or_admin"
on public.posts
for select
to authenticated
using (
  author = auth.uid()
  or public.is_admin()
);

-- Writers manage their own posts; Admins manage all.
drop policy if exists "posts_insert_writer" on public.posts;
create policy "posts_insert_writer"
on public.posts
for insert
to authenticated
with check (
  author = auth.uid()
  and (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('writer','admin'))
  )
);

drop policy if exists "posts_update_owner_or_admin" on public.posts;
create policy "posts_update_owner_or_admin"
on public.posts
for update
to authenticated
using (
  author = auth.uid()
  or public.is_admin()
)
with check (
  author = auth.uid()
  or public.is_admin()
);

drop policy if exists "posts_delete_owner_or_admin" on public.posts;
create policy "posts_delete_owner_or_admin"
on public.posts
for delete
to authenticated
using (
  author = auth.uid()
  or public.is_admin()
);

-- COMMENTS:
-- Public can read comments only for published posts (avoids leaking comments on drafts).
drop policy if exists "comments_select_published_posts" on public.comments;
create policy "comments_select_published_posts"
on public.comments
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.posts p
    where p.id = comments.post_id
      and p.published = true
  )
);

-- Authenticated users can insert comments on published posts.
drop policy if exists "comments_insert_authenticated" on public.comments;
create policy "comments_insert_authenticated"
on public.comments
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.posts p where p.id = comments.post_id and p.published = true
  )
);

-- Admin moderation and self-delete (optional).
drop policy if exists "comments_delete_self_or_admin" on public.comments;
create policy "comments_delete_self_or_admin"
on public.comments
for delete
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

-- POST_IMAGES: author owns images for their posts; admin can manage all.
drop policy if exists "post_images_select_published" on public.post_images;
create policy "post_images_select_published"
on public.post_images
for select
to anon, authenticated
using (
  exists (
    select 1 from public.posts p
    where p.id = post_images.post_id
      and p.published = true
  )
);

drop policy if exists "post_images_insert_owner_or_admin" on public.post_images;
create policy "post_images_insert_owner_or_admin"
on public.post_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.posts p
    where p.id = post_images.post_id
      and (p.author = auth.uid() or public.is_admin())
  )
);

drop policy if exists "post_images_delete_owner_or_admin" on public.post_images;
create policy "post_images_delete_owner_or_admin"
on public.post_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.posts p
    where p.id = post_images.post_id
      and (p.author = auth.uid() or public.is_admin())
  )
);

-- AUDIT_LOGS: only admins can read.
drop policy if exists "audit_logs_select_admin" on public.audit_logs;
create policy "audit_logs_select_admin"
on public.audit_logs
for select
to authenticated
using (public.is_admin());

-- Prevent writes from clients; audit logs are written via server-side admin client if desired.
revoke insert, update, delete on public.audit_logs from anon, authenticated;
