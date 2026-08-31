create or replace function public.cancel_booking(input_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  booking_record public.bookings%rowtype;
  class_record public.classes%rowtype;
begin
  if current_user_id is null then
    raise exception 'Login required.';
  end if;

  select * into booking_record
  from public.bookings
  where id = input_booking_id
  for update;

  if not found then
    raise exception 'Booking not found.';
  end if;

  if booking_record.user_id <> current_user_id then
    raise exception 'Only your own booking can be cancelled.';
  end if;

  if booking_record.status not in ('pending', 'confirmed') then
    raise exception 'Only pending or confirmed bookings can be cancelled.';
  end if;

  select * into class_record
  from public.classes
  where id = booking_record.class_id;

  if found and class_record.starts_at <= now() then
    raise exception 'This class has already started.';
  end if;

  update public.bookings
  set status = 'cancelled'
  where id = input_booking_id;
end;
$$;

grant execute on function public.cancel_booking(uuid) to authenticated;
