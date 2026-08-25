import Link from "next/link";
import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  Clock3,
  LogIn,
  MapPin,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";

import { requestBookingAction, signOutAction } from "./actions";
import {
  ClassWithCounts,
  getClasses,
  getCurrentUserBookings,
  getCurrentUserVouchers,
  getSessionContext,
} from "@/lib/booking-data";
import { ADMIN_EMAIL, hasSupabaseEnv } from "@/lib/config";
import { formatMalaysiaDate, formatMalaysiaDateTime } from "@/lib/time";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

function statusLabel(status: ClassWithCounts["effective_status"]) {
  if (status === "open") {
    return "Open";
  }
  if (status === "upcoming") {
    return "Opening Soon";
  }
  return "Closed";
}

function StatusPill({ status }: { status: ClassWithCounts["effective_status"] }) {
  const styles = {
    open: "bg-emerald-100 text-emerald-800",
    upcoming: "bg-amber-100 text-amber-900",
    closed: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-semibold ${styles[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}

function ClassCard({
  classItem,
  isSignedIn,
}: {
  classItem: ClassWithCounts;
  isSignedIn: boolean;
}) {
  const remaining = Math.max(classItem.capacity - classItem.confirmed_count, 0);
  const isBookable = classItem.effective_status === "open" && remaining > 0;

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold leading-6 text-slate-950">
            {classItem.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {classItem.summary}
          </p>
        </div>
        <StatusPill status={classItem.effective_status} />
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-cyan-700" />
          <span>{formatMalaysiaDateTime(classItem.starts_at)} MYT</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-rose-700" />
          <span>{classItem.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-slate-500" />
          <span>
            {classItem.confirmed_count}/{classItem.capacity} confirmed
            {classItem.pending_count > 0
              ? `, ${classItem.pending_count} pending`
              : ""}
          </span>
        </div>
      </div>

      <div className="mt-4">
        {!isSignedIn ? (
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white"
          >
            <LogIn className="h-4 w-4" />
            Sign in to book
          </Link>
        ) : (
          <form action={requestBookingAction}>
            <input type="hidden" name="classId" value={classItem.id} />
            <button
              type="submit"
              disabled={!isBookable}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white disabled:bg-slate-300 disabled:text-slate-600"
            >
              <Ticket className="h-4 w-4" />
              {isBookable ? "Request Booking" : "Not Available"}
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { user, isAdmin } = await getSessionContext();
  const classes = await getClasses();
  const userBookings = user ? await getCurrentUserBookings(user.id) : [];
  const vouchers = user ? await getCurrentUserVouchers(user.id) : [];
  const visibleClasses = classes.filter((classItem) =>
    ["open", "upcoming"].includes(classItem.effective_status),
  );
  const openClasses = visibleClasses.filter(
    (classItem) => classItem.effective_status === "open",
  );
  const upcomingClasses = visibleClasses.filter(
    (classItem) => classItem.effective_status === "upcoming",
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-4 sm:px-6">
      <header className="sticky top-0 z-10 -mx-4 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
              HappyLife
            </p>
            <h1 className="text-2xl font-black tracking-normal">
              Class Booking
            </h1>
          </div>
          {user ? (
            <form action={signOutAction}>
              <button className="h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold">
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </header>

      {params?.message ? (
        <p className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm font-medium text-cyan-900">
          {params.message}
        </p>
      ) : null}

      {!hasSupabaseEnv() ? (
        <section className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-bold">Preview mode</p>
          <p className="mt-1 leading-6">
            Add Supabase environment variables to enable login, booking,
            voucher use, and admin management.
          </p>
        </section>
      ) : null}

      <section className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Ticket className="h-4 w-4 text-cyan-700" />
            Vouchers
          </div>
          <p className="mt-2 text-3xl font-black">
            {vouchers.reduce(
              (total, voucher) => total + voucher.remaining_count,
              0,
            )}
          </p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Clock3 className="h-4 w-4 text-amber-700" />
            Bookings
          </div>
          <p className="mt-2 text-3xl font-black">{userBookings.length}</p>
        </div>
      </section>

      {user ? (
        <section className="mt-4 rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Signed in as
              </p>
              <p className="break-all text-sm font-bold">{user.email}</p>
            </div>
            {isAdmin ? (
              <Link
                href="/admin"
                className="flex h-10 items-center gap-2 rounded-lg bg-cyan-800 px-3 text-sm font-semibold text-white"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Malaysia time
            </p>
            <h2 className="text-xl font-black">Open Classes</h2>
          </div>
          <span className="text-sm font-semibold text-slate-500">
            {openClasses.length}
          </span>
        </div>
        <div className="grid gap-3">
          {openClasses.length > 0 ? (
            openClasses.map((classItem) => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                isSignedIn={Boolean(user)}
              />
            ))
          ) : (
            <p className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-slate-600">
              No open classes right now.
            </p>
          )}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-black">Opening Soon</h2>
          <span className="text-sm font-semibold text-slate-500">
            {upcomingClasses.length}
          </span>
        </div>
        <div className="grid gap-3">
          {upcomingClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              isSignedIn={Boolean(user)}
            />
          ))}
        </div>
      </section>

      {userBookings.length > 0 ? (
        <section className="mt-7">
          <h2 className="mb-3 text-xl font-black">My Bookings</h2>
          <div className="grid gap-3">
            {userBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {booking.classes?.title ?? "Class"}
                    </p>
                    {booking.classes?.starts_at ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {formatMalaysiaDateTime(booking.classes.starts_at)}
                      </p>
                    ) : null}
                  </div>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-700">
                    {booking.status}
                  </span>
                </div>
                {booking.status === "pending" ? (
                  <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
                    <Banknote className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      Please transfer payment and wait for admin approval after
                      deposit confirmation.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>Your seat is confirmed.</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {vouchers.length > 0 ? (
        <section className="mt-7">
          <h2 className="mb-3 text-xl font-black">Active Vouchers</h2>
          <div className="grid gap-3">
            {vouchers.map((voucher) => (
              <article
                key={voucher.id}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">
                    {voucher.remaining_count}/{voucher.total_count} left
                  </p>
                  <p className="text-sm font-semibold text-slate-600">
                    Expires {formatMalaysiaDate(voucher.expires_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-7 rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="flex items-center gap-2 text-lg font-black">
          <Banknote className="h-5 w-5 text-amber-700" />
          Payment Guide
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Members without an active voucher can submit a booking request first.
          The booking remains pending until admin confirms the deposit.
        </p>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2">
          <a
            href="#"
            className="flex h-11 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white"
          >
            Classes
          </a>
          <Link
            href="/login"
            className="flex h-11 items-center justify-center rounded-lg text-sm font-bold text-slate-700"
          >
            Account
          </Link>
          <Link
            href={isAdmin ? "/admin" : `mailto:${ADMIN_EMAIL}`}
            className="flex h-11 items-center justify-center rounded-lg text-sm font-bold text-slate-700"
          >
            Admin
          </Link>
        </div>
      </nav>
    </main>
  );
}
