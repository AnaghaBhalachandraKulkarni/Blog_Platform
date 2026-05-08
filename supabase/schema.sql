-- Schema for Cloud Blog Platform
-- Apply in Supabase SQL editor or via migrations.

create extension if not exists "pgcrypto";

-- Roles
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'writer', 'reader');
  end if;
end $$;

-- Updated-at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'reader',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  markdown text not null,
  cover_image text,
  published boolean not null default false,
  tags text[] not null default '{}'::text[],
  reading_time integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_slug_unique unique (slug)
);

create index if not exists posts_author_idx on public.posts (author);
create index if not exists posts_published_created_at_idx on public.posts (published, created_at desc);
create index if not exists posts_tags_gin_idx on public.posts using gin (tags);

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

-- Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_created_at_idx on public.comments (post_id, created_at asc);
create index if not exists comments_user_id_idx on public.comments (user_id);

-- Post Images
create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists post_images_post_id_idx on public.post_images (post_id);

-- Audit Logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_id_created_at_idx on public.audit_logs (actor_id, created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

-- Helper: admin check
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- Ensure a profile row exists for each auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := nullif(coalesce(new.raw_user_meta_data->>'display_name', new.email), '');

  insert into public.profiles (id, display_name, role)
  values (new.id, display_name, 'reader')
  on conflict (id) do update
    set display_name = excluded.display_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

