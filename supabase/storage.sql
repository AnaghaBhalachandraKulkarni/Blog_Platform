-- Supabase Storage setup for post images
-- Bucket: post-images

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Read: public
drop policy if exists "post_images_public_read" on storage.objects;
create policy "post_images_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'post-images');

-- Write: authenticated user owns object
drop policy if exists "post_images_owner_insert" on storage.objects;
create policy "post_images_owner_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and owner = auth.uid()
);

drop policy if exists "post_images_owner_update" on storage.objects;
create policy "post_images_owner_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'post-images'
  and owner = auth.uid()
)
with check (
  bucket_id = 'post-images'
  and owner = auth.uid()
);

drop policy if exists "post_images_owner_delete" on storage.objects;
create policy "post_images_owner_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'post-images'
  and owner = auth.uid()
);

