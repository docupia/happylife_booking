import Link from "next/link";
import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  LogIn,
  MapPin,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import { requestBookingAction, signOutAction } from "./actions";
import {
  BookingRow,
  ClassWithCounts,
  getClasses,
  getCurrentUserBookings,
  getSessionContext,
} from "@/lib/booking-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
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
import { formatMalaysiaDateTime } from "@/lib/time";

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
  booking,
  isSignedIn,
  locale,
  t,
}: {
  classItem: ClassWithCounts;
  booking?: BookingRow;
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
      </div>

      <div className="mt-4">
        {booking ? (
          <div
            className={`rounded-lg p-3 text-sm ${
              booking.status === "confirmed"
                ? "bg-emerald-50 text-emerald-900"
                : "bg-amber-50 text-amber-950"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-bold">
                {booking.status === "confirmed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Banknote className="h-4 w-4" />
                )}
                {booking.status === "confirmed"
                  ? t.home.seatConfirmed
                  : t.home.bookingPending}
              </span>
              <Badge>{bookingStatusLabel(booking.status, t)}</Badge>
            </div>
            {booking.status === "pending" ? (
              <p className="mt-2 leading-5">{t.home.transferGuide}</p>
            ) : null}
          </div>
        ) : !isSignedIn ? (
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              {t.home.signInToBook}
            </Link>
          </Button>
        ) : (
          <form action={requestBookingAction}>
            <input type="hidden" name="classId" value={classItem.id} />
            <SubmitButton
              disabled={!isBookable}
              pendingText={t.home.applying}
              className="w-full disabled:bg-slate-300 disabled:text-slate-600"
            >
              <Ticket className="h-4 w-4" />
              {isBookable ? t.home.requestBooking : t.home.notAvailable}
            </SubmitButton>
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
  const visibleClasses = classes.filter((classItem) =>
    ["open", "upcoming"].includes(classItem.effective_status),
  );
  const openClasses = visibleClasses.filter(
    (classItem) => classItem.effective_status === "open",
  ).slice(0, 12);
  const upcomingClasses = visibleClasses.filter(
    (classItem) => classItem.effective_status === "upcoming",
  ).slice(0, 3);
  const userBookingsByClassId = new Map(
    userBookings
      .filter(
        (booking) =>
          booking.status === "pending" || booking.status === "confirmed",
      )
      .map((booking) => [booking.class_id, booking]),
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
                <SubmitButton
                  variant="secondary"
                  size="compact"
                  pendingText={t.common.signingOut}
                >
                  {t.common.signOut}
                </SubmitButton>
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
            <CalendarClock className="h-4 w-4 text-cyan-700" />
            {t.common.open}
          </div>
          <p className="mt-2 text-3xl font-black">{openClasses.length}</p>
        </Card>
        <Card className="shadow-none">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Ticket className="h-4 w-4 text-amber-700" />
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
                booking={userBookingsByClassId.get(classItem.id)}
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
              booking={userBookingsByClassId.get(classItem.id)}
              isSignedIn={Boolean(user)}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div
          className={`mx-auto grid max-w-3xl gap-2 ${
            isAdmin ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          <Button asChild>
            <a href="#">{t.common.classes}</a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/guide">{t.common.guide}</Link>
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
