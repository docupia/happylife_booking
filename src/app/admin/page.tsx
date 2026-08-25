import Link from "next/link";
import {
  ArrowLeft,
  CalendarPlus,
  Check,
  MapPin,
  ShieldAlert,
  TicketPlus,
  UsersRound,
} from "lucide-react";

import {
  approveBookingAction,
  createClassAction,
  grantVoucherAction,
  signOutAction,
  updateClassAction,
} from "../actions";
import { getAdminData, getSessionContext } from "@/lib/booking-data";
import { ADMIN_EMAIL, hasSupabaseEnv } from "@/lib/config";
import {
  defaultVoucherExpiryDate,
  formatMalaysiaDate,
  formatMalaysiaDateTime,
  toMalaysiaLocalInputValue,
} from "@/lib/time";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

const inputClass =
  "h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-cyan-700";
const textAreaClass =
  "min-h-24 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-700";

function classBadge(status: string) {
  const styles: Record<string, string> = {
    open: "bg-emerald-100 text-emerald-800",
    upcoming: "bg-amber-100 text-amber-900",
    closed: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-bold uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const { user, isAdmin } = await getSessionContext();
  const { classes, bookings, profiles, vouchers } = await getAdminData();
  const groupedClasses = {
    open: classes.filter((classItem) => classItem.effective_status === "open"),
    upcoming: classes.filter(
      (classItem) => classItem.effective_status === "upcoming",
    ),
    closed: classes.filter(
      (classItem) => classItem.effective_status === "closed",
    ),
  };

  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
        <Link
          href="/"
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-white"
          aria-label="Back to classes"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <ShieldAlert className="h-6 w-6" />
          <h1 className="mt-3 text-2xl font-black">Supabase required</h1>
          <p className="mt-2 text-sm leading-6">
            Connect Supabase environment variables and apply the migration
            before using admin management.
          </p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
        <Link
          href="/"
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-white"
          aria-label="Back to classes"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <section className="rounded-lg border border-stone-200 bg-white p-5">
          <h1 className="text-2xl font-black">Admin Login</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in with {ADMIN_EMAIL} to manage classes, bookings, students,
            and vouchers.
          </p>
          <Link
            href="/login"
            className="mt-5 flex h-12 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
        <Link
          href="/"
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-white"
          aria-label="Back to classes"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
          <ShieldAlert className="h-6 w-6" />
          <h1 className="mt-3 text-2xl font-black">Access denied</h1>
          <p className="mt-2 text-sm leading-6">
            Admin access is limited to {ADMIN_EMAIL}.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-12 pt-4 sm:px-6">
      <header className="sticky top-0 z-10 -mx-4 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-white"
              aria-label="Back to classes"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
                Admin
              </p>
              <h1 className="text-2xl font-black">Management</h1>
            </div>
          </div>
          <form action={signOutAction}>
            <button className="h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {params?.message ? (
        <p className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm font-medium text-cyan-900">
          {params.message}
        </p>
      ) : null}

      <section className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-500">Open</p>
          <p className="mt-1 text-3xl font-black">{groupedClasses.open.length}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-500">Pending</p>
          <p className="mt-1 text-3xl font-black">
            {bookings.filter((booking) => booking.status === "pending").length}
          </p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-500">Students</p>
          <p className="mt-1 text-3xl font-black">{profiles.length}</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <CalendarPlus className="h-5 w-5 text-cyan-800" />
          Create Class
        </h2>
        <form action={createClassAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            Title
            <input name="title" required className={inputClass} />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Starts at
            <input
              name="startsAt"
              type="datetime-local"
              required
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Location
            <input name="location" required className={inputClass} />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Capacity
            <input
              name="capacity"
              type="number"
              min="1"
              required
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Status
            <select name="status" defaultValue="upcoming" className={inputClass}>
              <option value="upcoming">Opening Soon</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
            Summary
            <textarea name="summary" required className={textAreaClass} />
          </label>
          <button className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white md:col-span-2">
            Create
          </button>
        </form>
      </section>

      {(["open", "upcoming", "closed"] as const).map((status) => (
        <section key={status} className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black capitalize">{status} Classes</h2>
            <span className="text-sm font-bold text-slate-500">
              {groupedClasses[status].length}
            </span>
          </div>
          <div className="grid gap-4">
            {groupedClasses[status].length === 0 ? (
              <p className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-slate-600">
                No {status} classes.
              </p>
            ) : null}
            {groupedClasses[status].map((classItem) => {
              const classBookings = bookings.filter(
                (booking) => booking.class_id === classItem.id,
              );
              const pendingBookings = classBookings.filter(
                (booking) => booking.status === "pending",
              );

              return (
                <article
                  key={classItem.id}
                  className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{classItem.title}</h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-rose-700" />
                        {classItem.location}
                      </p>
                    </div>
                    {classBadge(classItem.effective_status)}
                  </div>

                  <div className="mt-3 grid gap-1 text-sm text-slate-700">
                    <p>{formatMalaysiaDateTime(classItem.starts_at)} MYT</p>
                    <p>
                      {classItem.confirmed_count}/{classItem.capacity} confirmed
                      {classItem.pending_count > 0
                        ? `, ${classItem.pending_count} pending`
                        : ""}
                    </p>
                    <p>{classItem.summary}</p>
                  </div>

                  <details className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3">
                    <summary className="cursor-pointer text-sm font-bold">
                      Edit class
                    </summary>
                    <form
                      action={updateClassAction}
                      className="mt-3 grid gap-3 md:grid-cols-2"
                    >
                      <input type="hidden" name="classId" value={classItem.id} />
                      <label className="grid gap-1.5 text-sm font-semibold">
                        Title
                        <input
                          name="title"
                          required
                          defaultValue={classItem.title}
                          className={inputClass}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        Starts at
                        <input
                          name="startsAt"
                          type="datetime-local"
                          required
                          defaultValue={toMalaysiaLocalInputValue(
                            classItem.starts_at,
                          )}
                          className={inputClass}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        Location
                        <input
                          name="location"
                          required
                          defaultValue={classItem.location}
                          className={inputClass}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        Capacity
                        <input
                          name="capacity"
                          type="number"
                          min="1"
                          required
                          defaultValue={classItem.capacity}
                          className={inputClass}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        Status
                        <select
                          name="status"
                          defaultValue={classItem.status}
                          className={inputClass}
                        >
                          <option value="upcoming">Opening Soon</option>
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                        Summary
                        <textarea
                          name="summary"
                          required
                          defaultValue={classItem.summary}
                          className={textAreaClass}
                        />
                      </label>
                      <button className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white md:col-span-2">
                        Save changes
                      </button>
                    </form>
                  </details>

                  <div className="mt-4">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase text-slate-500">
                      <UsersRound className="h-4 w-4" />
                      Student List
                    </h4>
                    <div className="mt-2 grid gap-2">
                      {classBookings.length === 0 ? (
                        <p className="rounded-lg bg-stone-50 p-3 text-sm text-slate-600">
                          No bookings yet.
                        </p>
                      ) : null}
                      {classBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="rounded-lg border border-stone-200 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="break-all text-sm font-bold">
                                {booking.profiles?.full_name ||
                                  booking.profiles?.email ||
                                  "Student"}
                              </p>
                              <p className="break-all text-xs text-slate-500">
                                {booking.profiles?.email}
                              </p>
                            </div>
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold uppercase">
                              {booking.status}
                            </span>
                          </div>
                          {booking.status === "pending" ? (
                            <form action={approveBookingAction} className="mt-3">
                              <input
                                type="hidden"
                                name="bookingId"
                                value={booking.id}
                              />
                              <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 text-sm font-bold text-white">
                                <Check className="h-4 w-4" />
                                Approve after deposit
                              </button>
                            </form>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    {pendingBookings.length > 0 ? (
                      <p className="mt-2 text-xs font-semibold text-amber-800">
                        {pendingBookings.length} booking request needs deposit
                        confirmation.
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mt-8 rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <TicketPlus className="h-5 w-5 text-cyan-800" />
          Student Vouchers
        </h2>
        <form action={grantVoucherAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            Student
            <select name="userId" required className={inputClass}>
              <option value="">Select student</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.full_name || profile.email}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Voucher count
            <input
              name="count"
              type="number"
              min="1"
              defaultValue="1"
              required
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Expire date
            <input
              name="expiresAt"
              type="date"
              defaultValue={defaultVoucherExpiryDate()}
              required
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Note
            <input name="note" className={inputClass} />
          </label>
          <button className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white md:col-span-2">
            Add voucher
          </button>
        </form>

        <div className="mt-5 grid gap-2">
          {vouchers.length === 0 ? (
            <p className="rounded-lg bg-stone-50 p-3 text-sm text-slate-600">
              No vouchers registered yet.
            </p>
          ) : null}
          {vouchers.map((voucher) => (
            <article
              key={voucher.id}
              className="rounded-lg border border-stone-200 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="break-all text-sm font-bold">
                    {voucher.profiles?.full_name ||
                      voucher.profiles?.email ||
                      "Student"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Expires {formatMalaysiaDate(voucher.expires_at)}
                  </p>
                </div>
                <span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-sm font-black text-cyan-900">
                  {voucher.remaining_count}/{voucher.total_count}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
