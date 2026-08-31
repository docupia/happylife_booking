import Link from "next/link";
import {
  CalendarClock,
  LogIn,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import { signOutAction } from "./actions";
import {
  getClasses,
  getCurrentUserBookings,
  getSessionContext,
} from "@/lib/booking-data";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ClassCalendar } from "@/components/class-calendar";
import { Card } from "@/components/ui/card";
import { hasSupabaseEnv } from "@/lib/config";
import { getI18n } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { locale, t } = await getI18n();
  const { user, isAdmin } = await getSessionContext();
  const classes = await getClasses();
  const userBookings = user ? await getCurrentUserBookings(user.id) : [];
  const activeUserBookings = userBookings.filter(
    (booking) =>
      booking.status === "pending" || booking.status === "confirmed",
  );
  const openClasses = classes.filter(
    (classItem) => classItem.effective_status === "open",
  ).slice(0, 12);

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
          <p className="mt-2 text-3xl font-black">{activeUserBookings.length}</p>
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
        {user ? (
          <ClassCalendar
            classes={openClasses}
            userBookings={activeUserBookings}
            isSignedIn={Boolean(user)}
            locale={locale}
            t={t}
          />
        ) : null}
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
