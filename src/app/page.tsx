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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasSupabaseEnv } from "@/lib/config";
import { getI18n } from "@/lib/i18n-server";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatMalaysiaDate, formatMalaysiaDateTime } from "@/lib/time";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

function statusLabel(
  status: ClassWithCounts["effective_status"],
  t: Dictionary,
) {
  if (status === "open") {
    return t.common.open;
  }
  if (status === "upcoming") {
    return t.common.openingSoon;
  }
  return t.common.closed;
}

function bookingStatusLabel(status: "pending" | "confirmed" | "cancelled", t: Dictionary) {
  if (status === "pending") {
    return t.common.pending;
  }
  if (status === "confirmed") {
    return t.common.confirmed;
  }

  return t.common.closed;
}

function StatusPill({
  status,
  t,
}: {
  status: ClassWithCounts["effective_status"];
  t: Dictionary;
}) {
  return <Badge variant={status}>{statusLabel(status, t)}</Badge>;
}

function ClassCard({
  classItem,
  isSignedIn,
  locale,
  t,
}: {
  classItem: ClassWithCounts;
  isSignedIn: boolean;
  locale: Locale;
  t: Dictionary;
}) {
  const remaining = Math.max(classItem.capacity - classItem.confirmed_count, 0);
  const isBookable = classItem.effective_status === "open" && remaining > 0;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{classItem.title}</CardTitle>
          <CardDescription>{classItem.summary}</CardDescription>
        </div>
        <StatusPill status={classItem.effective_status} t={t} />
      </CardHeader>

      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-cyan-700" />
          <span>{formatMalaysiaDateTime(classItem.starts_at, locale)} MYT</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-rose-700" />
          <span>{classItem.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-slate-500" />
          <span>
            {classItem.confirmed_count}/{classItem.capacity}{" "}
            {t.common.confirmed}
            {classItem.pending_count > 0
              ? `, ${classItem.pending_count} ${t.common.pending}`
              : ""}
          </span>
        </div>
      </div>

      <div className="mt-4">
        {!isSignedIn ? (
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              {t.home.signInToBook}
            </Link>
          </Button>
        ) : (
          <form action={requestBookingAction}>
            <input type="hidden" name="classId" value={classItem.id} />
            <Button
              type="submit"
              disabled={!isBookable}
              className="w-full disabled:bg-slate-300 disabled:text-slate-600"
            >
              <Ticket className="h-4 w-4" />
              {isBookable ? t.home.requestBooking : t.home.notAvailable}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { locale, t } = await getI18n();
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
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
              HappyLife
            </p>
            <h1 className="text-2xl font-black tracking-normal">
              {t.common.class} {t.common.booking}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher initialLocale={locale} label={t.common.language} />
            {user ? (
              <form action={signOutAction}>
                <Button variant="secondary" size="compact">
                  {t.common.signOut}
                </Button>
              </form>
            ) : (
              <Button asChild size="compact">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  {t.common.login}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {params?.message ? (
        <p className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm font-medium text-cyan-900">
          {params.message}
        </p>
      ) : null}

      {!hasSupabaseEnv() ? (
        <section className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-bold">{t.home.previewMode}</p>
          <p className="mt-1 leading-6">
            {t.home.addSupabase}
          </p>
        </section>
      ) : null}

      <section className="mt-5 grid grid-cols-2 gap-3">
        <Card className="shadow-none">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Ticket className="h-4 w-4 text-cyan-700" />
            {t.common.vouchers}
          </div>
          <p className="mt-2 text-3xl font-black">
            {vouchers.reduce(
              (total, voucher) => total + voucher.remaining_count,
              0,
            )}
          </p>
        </Card>
        <Card className="shadow-none">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Clock3 className="h-4 w-4 text-amber-700" />
            {t.common.bookings}
          </div>
          <p className="mt-2 text-3xl font-black">{userBookings.length}</p>
        </Card>
      </section>

      {user ? (
        <Card className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                {t.home.signedInAs}
              </p>
              <p className="break-all text-sm font-bold">{user.email}</p>
            </div>
            {isAdmin ? (
              <Button asChild variant="accent" size="compact">
                <Link href="/admin">
                  <ShieldCheck className="h-4 w-4" />
                  {t.common.admin}
                </Link>
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              {t.home.malaysiaTime}
            </p>
            <h2 className="text-xl font-black">
              {t.common.open} {t.common.classes}
            </h2>
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
                locale={locale}
                t={t}
              />
            ))
          ) : (
            <p className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-slate-600">
              {t.home.noOpenClasses}
            </p>
          )}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-black">{t.common.openingSoon}</h2>
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
              locale={locale}
              t={t}
            />
          ))}
        </div>
      </section>

      {userBookings.length > 0 ? (
        <section className="mt-7">
          <h2 className="mb-3 text-xl font-black">{t.home.myBookings}</h2>
          <div className="grid gap-3">
            {userBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {booking.classes?.title ?? t.common.class}
                    </p>
                    {booking.classes?.starts_at ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {formatMalaysiaDateTime(
                          booking.classes.starts_at,
                          locale,
                        )}
                      </p>
                    ) : null}
                  </div>
                  <Badge>{bookingStatusLabel(booking.status, t)}</Badge>
                </div>
                {booking.status === "pending" ? (
                  <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
                    <Banknote className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      {t.home.transferGuide}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{t.home.seatConfirmed}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {vouchers.length > 0 ? (
        <section className="mt-7">
          <h2 className="mb-3 text-xl font-black">{t.home.activeVouchers}</h2>
          <div className="grid gap-3">
            {vouchers.map((voucher) => (
              <article
                key={voucher.id}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">
                    {voucher.remaining_count}/{voucher.total_count}{" "}
                    {t.common.left}
                  </p>
                  <p className="text-sm font-semibold text-slate-600">
                    {t.common.expires}{" "}
                    {formatMalaysiaDate(voucher.expires_at, locale)}
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
          {t.home.paymentGuide}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t.home.membersWithoutVoucher}
        </p>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div
          className={`mx-auto grid max-w-3xl gap-2 ${
            isAdmin ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          <Button asChild>
            <a href="#">{t.common.classes}</a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/login">{t.common.account}</Link>
          </Button>
          {isAdmin ? (
            <Button asChild variant="ghost">
              <Link href="/admin">{t.common.admin}</Link>
            </Button>
          ) : null}
        </div>
      </nav>
    </main>
  );
}
