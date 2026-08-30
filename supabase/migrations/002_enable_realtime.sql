do $$
begin
  begin
    alter publication supabase_realtime add table public.classes;
  exception
    when duplicate_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.bookings;
  exception
    when duplicate_object then null;
  end;
end $$;
