import { ADMIN_EMAIL } from "./config";
import { createSupabaseServerClient } from "./supabase-server";
import { ClassStatus, getEffectiveClassStatus } from "./time";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type ClassRow = {
  id: string;
  title: string;
  summary: string;
  location: string;
  starts_at: string;
  capacity: number;
  status: ClassStatus;
  created_at: string;
};

export type BookingRow = {
  id: string;
  class_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: "unpaid" | "payment_confirmed" | "voucher";
  used_voucher_id: string | null;
  created_at: string;
  profiles?: Pick<Profile, "email" | "full_name"> | null;
  classes?: Pick<ClassRow, "title" | "starts_at"> | null;
};

export type VoucherRow = {
  id: string;
  user_id: string;
  total_count: number;
  remaining_count: number;
  expires_at: string;
  note: string | null;
  created_at: string;
  profiles?: Pick<Profile, "email" | "full_name"> | null;
};

export type ClassWithCounts = ClassRow & {
  effective_status: ClassStatus;
  confirmed_count: number;
  pending_count: number;
};

export const sampleClasses: ClassWithCounts[] = [
  {
    id: "sample-open",
    title: "Morning Pilates Flow",
    summary: "Core strength, posture, and slow controlled movement.",
    location: "HappyLife Studio, Mont Kiara",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    capacity: 10,
    status: "open",
    effective_status: "open",
    confirmed_count: 6,
    pending_count: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-upcoming",
    title: "Weekend Mobility Class",
    summary: "A compact session for hips, shoulders, and recovery.",
    location: "HappyLife Studio, Bangsar",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    capacity: 12,
    status: "upcoming",
    effective_status: "upcoming",
    confirmed_count: 0,
    pending_count: 0,
    created_at: new Date().toISOString(),
  },
];

export async function getSessionContext() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { supabase, user: null, isAdmin: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    isAdmin: user?.email?.toLowerCase() === ADMIN_EMAIL,
  };
}

export async function getClasses() {
  const { supabase } = await getSessionContext();

  if (!supabase) {
    return sampleClasses;
  }

  const { data: classes, error } = await supabase
    .from("classes")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("class_id,status");

  return (classes ?? []).map((classRow) => {
    const matching = (bookings ?? []).filter(
      (booking) => booking.class_id === classRow.id,
    );

    return {
      ...classRow,
      effective_status: getEffectiveClassStatus(
        classRow.status,
        classRow.starts_at,
      ),
      confirmed_count: matching.filter((booking) => booking.status === "confirmed")
        .length,
      pending_count: matching.filter((booking) => booking.status === "pending")
        .length,
    };
  });
}

export async function getCurrentUserBookings(userId: string) {
  const { supabase } = await getSessionContext();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, classes(title, starts_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as BookingRow[];
}

export async function getCurrentUserVouchers(userId: string) {
  const { supabase } = await getSessionContext();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("user_id", userId)
    .gt("remaining_count", 0)
    .gte("expires_at", new Date().toISOString().slice(0, 10))
    .order("expires_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as VoucherRow[];
}

export async function getAdminData() {
  const { supabase, isAdmin } = await getSessionContext();

  if (!supabase || !isAdmin) {
    return {
      classes: [] as ClassWithCounts[],
      bookings: [] as BookingRow[],
      profiles: [] as Profile[],
      vouchers: [] as VoucherRow[],
    };
  }

  const [classes, bookings, profiles, vouchers] = await Promise.all([
    getClasses(),
    supabase
      .from("bookings")
      .select("*, profiles(email, full_name), classes(title, starts_at)")
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("vouchers")
      .select("*, profiles(email, full_name)")
      .order("created_at", { ascending: false }),
  ]);

  if (bookings.error) {
    console.error(bookings.error);
  }
  if (profiles.error) {
    console.error(profiles.error);
  }
  if (vouchers.error) {
    console.error(vouchers.error);
  }

  return {
    classes,
    bookings: ((bookings.data ?? []) as BookingRow[]).filter(Boolean),
    profiles: (profiles.data ?? []) as Profile[],
    vouchers: (vouchers.data ?? []) as VoucherRow[],
  };
}
