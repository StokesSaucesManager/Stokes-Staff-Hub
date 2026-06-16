# Stokes Staff Hub V15 Photo Upload

Adds manager-only photo uploads from phone/computer library.

Supabase setup:
1. Supabase → Storage → New bucket
2. Name: employee-photos
3. Make it public

Then run:

create policy "authenticated users can upload employee photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'employee-photos');

create policy "public can view employee photos"
on storage.objects
for select
to public
using (bucket_id = 'employee-photos');
