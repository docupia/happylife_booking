create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'class_status') then
    create type public.class_status as enum ('upcoming', 'open', 'closed');
  end if;
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('pending', 'confirmed', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('unpaid', 'payment_confirmed', 'voucher');
  end if;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'shswjs7682@gmail.com';
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  location text not null,
  starts_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  status public.class_status not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total_count integer not null check (total_count > 0),
  remaining_count integer not null check (remaining_count >= 0),
  expires_at date not null,
  note text,
  created_at timestamptz not null default now(),
  constraint vouchers_remaining_not_above_total check (remaining_count <= total_count)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.booking_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  used_voucher_id uuid references public.vouchers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists bookings_one_active_per_class
  on public.bookings(user_id, class_id)
  where status in ('pending', 'confirmed');

create index if not exists classes_starts_at_idx on public.classes(starts_at);
create index if not exists bookings_class_id_idx on public.bookings(class_id);
create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists vouchers_user_id_idx on public.vouchers(user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_classes_updated_at on public.classes;
create trigger touch_classes_updated_at
before update on public.classes
for each row execute function public.touch_updated_at();

drop trigger if exists touch_bookings_updated_at on public.bookings;
create trigger touch_bookings_updated_at
before update on public.bookings
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    lower(new.email),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.request_booking(input_class_id uuid)
returns table (
  booking_id uuid,
  booking_status public.booking_status,
  used_voucher boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  class_record public.classes%rowtype;
  confirmed_count integer;
  voucher_record public.vouchers%rowtype;
  new_booking_id uuid;
  new_status public.booking_status;
  voucher_was_used boolean := false;
begin
  if current_user_id is null then
    raise exception 'Login required.';
  end if;

  select * into class_record
  from public.classes
  where id = input_class_id
  for update;

  if not found then
    raise exception 'Class not found.';
  end if;

  if class_record.starts_at <= now() or class_record.status = 'closed' then
    raise exception 'This class is closed.';
  end if;

  if class_record.status <> 'open' then
    raise exception 'This class is not open for booking yet.';
  end if;

  if exists (
    select 1 from public.bookings
    where class_id = input_class_id
      and user_id = current_user_id
      and status in ('pending', 'confirmed')
  ) then
    raise exception 'You already have an active booking for this class.';
  end if;

  select count(*) into confirmed_count
  from public.bookings
  where class_id = input_class_id
    and status = 'confirmed';

  if confirmed_count >= class_record.capacity then
    raise exception 'This class is full.';
  end if;

  select * into voucher_record
  from public.vouchers
  where user_id = current_user_id
    and remaining_count > 0
    and expires_at >= (now() at time zone 'Asia/Kuala_Lumpur')::date
  order by expires_at asc, created_at asc
  for update skip locked
  limit 1;

  if found then
    update public.vouchers
    set remaining_count = remaining_count - 1
    where id = voucher_record.id;

    new_status := 'confirmed';
    voucher_was_used := true;

    insert into public.bookings (
      class_id,
      user_id,
      status,
      payment_status,
      used_voucher_id
    )
    values (
      input_class_id,
      current_user_id,
      'confirmed',
      'voucher',
      voucher_record.id
    )
    returning id into new_booking_id;
  else
    new_status := 'pending';

    insert into public.bookings (
      class_id,
      user_id,
      status,
      payment_status
    )
    values (
      input_class_id,
      current_user_id,
      'pending',
      'unpaid'
    )
    returning id into new_booking_id;
  end if;

  return query select new_booking_id, new_status, voucher_was_used;
end;
$$;

create or replace function public.approve_booking(input_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_record public.bookings%rowtype;
  class_record public.classes%rowtype;
  confirmed_count integer;
begin
  if not public.is_admin() then
    raise exception 'Admin access is restricted.';
  end if;

  select * into booking_record
  from public.bookings
  where id = input_booking_id
  for update;

  if not found then
    raise exception 'Booking not found.';
  end if;

  if booking_record.status <> 'pending' then
    raise exception 'Only pending bookings can be approved.';
  end if;

  select * into class_record
  from public.classes
  where id = booking_record.class_id
  for update;

  if not found then
    raise exception 'Class not found.';
  end if;

  select count(*) into confirmed_count
  from public.bookings
  where class_id = booking_record.class_id
    and status = 'confirmed';

  if confirmed_count >= class_record.capacity then
    raise exception 'This class is full.';
  end if;

  update public.bookings
  set status = 'confirmed',
      payment_status = 'payment_confirmed'
  where id = input_booking_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.bookings enable row level security;
alter table public.vouchers enable row level security;

drop policy if exists "profiles select own or admin" on public.profiles;
create policy "profiles select own or admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "classes select all" on public.classes;
create policy "classes select all"
on public.classes for select
to anon, authenticated
using (true);

drop policy if exists "classes admin insert" on public.classes;
create policy "classes admin insert"
on public.classes for insert
to authenticated
with check (public.is_admin());

drop policy if exists "classes admin update" on public.classes;
create policy "classes admin update"
on public.classes for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "bookings select own or admin" on public.bookings;
create policy "bookings select own or admin"
on public.bookings for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings admin update" on public.bookings;
create policy "bookings admin update"
on public.bookings for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "vouchers select own or admin" on public.vouchers;
create policy "vouchers select own or admin"
on public.vouchers for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "vouchers admin insert" on public.vouchers;
create policy "vouchers admin insert"
on public.vouchers for insert
to authenticated
with check (public.is_admin());

drop policy if exists "vouchers admin update" on public.vouchers;
create policy "vouchers admin update"
on public.vouchers for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.classes to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.bookings to authenticated;
grant select on public.vouchers to authenticated;
grant insert, update on public.classes to authenticated;
grant insert, update on public.vouchers to authenticated;
grant update on public.bookings to authenticated;
grant execute on function public.request_booking(uuid) to authenticated;
grant execute on function public.approve_booking(uuid) to authenticated;
