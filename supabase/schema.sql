-- EM-CURE Design Studio, dedicated Free-tier project
-- Paste into the Supabase SQL Editor after creating the project.
-- Auth: email + password, public sign-up disabled. Invite users in the dashboard.
-- Add redirect URLs: http://localhost:5173/** and the GCS SPA origin.

create table if not exists public.designs (
  id uuid primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  open_error_count integer not null default 0,
  open_warning_count integer not null default 0,
  body jsonb not null
);

create index if not exists designs_owner_updated_idx
  on public.designs (owner_id, updated_at desc);

alter table public.designs enable row level security;

create policy "owners select designs"
  on public.designs for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "owners insert designs"
  on public.designs for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "owners update designs"
  on public.designs for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "owners delete designs"
  on public.designs for delete
  to authenticated
  using (auth.uid() = owner_id);

-- One published card snapshot per design. Unlisted rows are not listable by anon.
create table if not exists public.published_cards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  design_id uuid not null references public.designs (id) on delete cascade,
  slug text not null,
  visibility text not null default 'unlisted'
    check (visibility in ('unlisted', 'public')),
  published_at timestamptz not null default now(),
  card jsonb not null,
  image_path text,
  unique (slug),
  unique (design_id)
);

create index if not exists published_cards_visibility_idx
  on public.published_cards (visibility, published_at desc);

alter table public.published_cards enable row level security;

create policy "owners select published cards"
  on public.published_cards for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "owners insert published cards"
  on public.published_cards for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "owners update published cards"
  on public.published_cards for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "owners delete published cards"
  on public.published_cards for delete
  to authenticated
  using (auth.uid() = owner_id);

-- Public gallery later: only visibility = public is listable.
create policy "anyone can read public cards"
  on public.published_cards for select
  to anon, authenticated
  using (visibility = 'public');

-- Unlisted lookup by exact slug (does not allow listing all unlisted rows).
create or replace function public.get_published_card_by_slug(p_slug text)
returns setof public.published_cards
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.published_cards
  where slug = p_slug
    and visibility in ('unlisted', 'public')
  limit 1;
$$;

revoke all on function public.get_published_card_by_slug(text) from public;
grant execute on function public.get_published_card_by_slug(text) to anon, authenticated;

insert into storage.buckets (id, name, public)
values
  ('design-assets', 'design-assets', false),
  ('card-images', 'card-images', true)
on conflict (id) do nothing;

-- Private faculty files: {userId}/{designId}/...
create policy "owners read design assets"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'design-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners insert design assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'design-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners update design assets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'design-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners delete design assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'design-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Published featured images: public read, owner write {userId}/...
create policy "public read card images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'card-images');

create policy "owners insert card images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'card-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners update card images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'card-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners delete card images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'card-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
