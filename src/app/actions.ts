"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_EMAIL } from "@/lib/config";
import { getI18n } from "@/lib/i18n-server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { toMalaysiaIsoFromLocalInput } from "@/lib/time";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function requireSupabase() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return supabase;
}

async function requireAdmin() {
  const supabase = await requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("Admin access is restricted.");
  }

  return supabase;
}

export async function signInAction(formData: FormData) {
  const supabase = await requireSupabase();
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect(email === ADMIN_EMAIL ? "/admin" : "/");
}

export async function signUpAction(formData: FormData) {
  const supabase = await requireSupabase();
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const fullName = getString(formData, "fullName");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/login?mode=signup&message=${encodeURIComponent(error.message)}`);
  }

  redirect(`/login/check-email?email=${encodeURIComponent(email)}`);
}

export async function signOutAction() {
  const supabase = await requireSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestBookingAction(formData: FormData) {
  const supabase = await requireSupabase();
  const { t } = await getI18n();
  const classId = getString(formData, "classId");

  const { error } = await supabase.rpc("request_booking", {
    input_class_id: classId,
  });

  if (error) {
    redirect(`/?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect(`/?message=${encodeURIComponent(t.home.bookingReceived)}`);
}

export async function createClassAction(formData: FormData) {
  const supabase = await requireAdmin();
  const { t } = await getI18n();
  const title = getString(formData, "title");
  const startsAt = toMalaysiaIsoFromLocalInput(formData.get("startsAt"));
  const capacity = Number(getString(formData, "capacity"));

  const { error } = await supabase.from("classes").insert({
    title,
    summary: getString(formData, "summary"),
    location: getString(formData, "location"),
    starts_at: startsAt,
    capacity,
    status: getString(formData, "status"),
  });

  if (error) {
    redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  redirect(`/admin?message=${encodeURIComponent(t.admin.classCreated)}`);
}

export async function updateClassAction(formData: FormData) {
  const supabase = await requireAdmin();
  const { t } = await getI18n();
  const classId = getString(formData, "classId");
  const startsAt = toMalaysiaIsoFromLocalInput(formData.get("startsAt"));

  const { error } = await supabase
    .from("classes")
    .update({
      title: getString(formData, "title"),
      summary: getString(formData, "summary"),
      location: getString(formData, "location"),
      starts_at: startsAt,
      capacity: Number(getString(formData, "capacity")),
      status: getString(formData, "status"),
    })
    .eq("id", classId);

  if (error) {
    redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  redirect(`/admin?message=${encodeURIComponent(t.admin.classUpdated)}`);
}

export async function approveBookingAction(formData: FormData) {
  const supabase = await requireAdmin();
  const { t } = await getI18n();
  const bookingId = getString(formData, "bookingId");

  const { error } = await supabase.rpc("approve_booking", {
    input_booking_id: bookingId,
  });

  if (error) {
    redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  redirect(`/admin?message=${encodeURIComponent(t.common.approve)}`);
}

export async function grantVoucherAction(formData: FormData) {
  const supabase = await requireAdmin();
  const { t } = await getI18n();
  const userId = getString(formData, "userId");
  const count = Number(getString(formData, "count") || "1");
  const expiresAt = getString(formData, "expiresAt");

  const { error } = await supabase.from("vouchers").insert({
    user_id: userId,
    total_count: count,
    remaining_count: count,
    expires_at: expiresAt,
    note: getString(formData, "note") || null,
  });

  if (error) {
    redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  redirect(`/admin?message=${encodeURIComponent(t.admin.voucherAdded)}`);
}
