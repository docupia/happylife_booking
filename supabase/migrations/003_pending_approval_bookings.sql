alter table public.bookings drop column if exists used_voucher_id;
drop table if exists public.vouchers;
drop function if exists public.request_booking(uuid);

do $$
begin
  if exists (
    select 1
    from pg_type type_info
    join pg_enum enum_info on enum_info.enumtypid = type_info.oid
    where type_info.typnamespace = 'public'::regnamespace
      and type_info.typname = 'payment_status'
      and enum_info.enumlabel = 'voucher'
  ) then
    update public.bookings
    set payment_status = 'payment_confirmed'
    where payment_status::text = 'voucher';

    alter table public.bookings alter column payment_status drop default;
    alter type public.payment_status rename to payment_status_with_voucher;
    create type public.payment_status as enum ('unpaid', 'payment_confirmed');
    alter table public.bookings
      alter column payment_status type public.payment_status
      using payment_status::text::public.payment_status;
    alter table public.bookings alter column payment_status set default 'unpaid';
    drop type public.payment_status_with_voucher;
  end if;
end $$;

create function public.request_booking(input_class_id uuid)
returns table (
  booking_id uuid,
  booking_status public.booking_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  class_record public.classes%rowtype;
  confirmed_count integer;
  new_booking_id uuid;
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

  return query select new_booking_id, 'pending'::public.booking_status;
end;
$$;

grant execute on function public.request_booking(uuid) to authenticated;
