-- Run this in the Supabase SQL editor after creating your project.
-- Then create your admin user in Authentication and add that user to portfolio_admins.

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.portfolio_admins enable row level security;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portfolio_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

drop policy if exists "Admins can view their own admin row" on public.portfolio_admins;
create policy "Admins can view their own admin row"
on public.portfolio_admins
for select
to authenticated
using (user_id = auth.uid());

create table if not exists public.portfolio_state (
  key text primary key check (key in ('projects', 'config')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_state enable row level security;

drop policy if exists "Public can read portfolio state" on public.portfolio_state;
create policy "Public can read portfolio state"
on public.portfolio_state
for select
to anon, authenticated
using (key in ('projects', 'config'));

drop policy if exists "Admins can insert portfolio state" on public.portfolio_state;
create policy "Admins can insert portfolio state"
on public.portfolio_state
for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "Admins can update portfolio state" on public.portfolio_state;
create policy "Admins can update portfolio state"
on public.portfolio_state
for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create table if not exists public.portfolio_requests (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.portfolio_requests enable row level security;

drop policy if exists "Anyone can submit portfolio requests" on public.portfolio_requests;
create policy "Anyone can submit portfolio requests"
on public.portfolio_requests
for insert
to anon, authenticated
with check (jsonb_typeof(payload) = 'object');

drop policy if exists "Admins can read portfolio requests" on public.portfolio_requests;
create policy "Admins can read portfolio requests"
on public.portfolio_requests
for select
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "Admins can delete portfolio requests" on public.portfolio_requests;
create policy "Admins can delete portfolio requests"
on public.portfolio_requests
for delete
to authenticated
using (public.is_portfolio_admin());

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio media" on storage.objects;
create policy "Public can read portfolio media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-media' and public.is_portfolio_admin())
with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

-- After creating your Supabase Auth user, run this with your admin email:
-- insert into public.portfolio_admins (user_id)
-- select id from auth.users where email = 'your-email@example.com'
-- on conflict (user_id) do nothing;
