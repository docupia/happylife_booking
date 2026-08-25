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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Input,
  Select,
  Textarea,
  inputClassName,
  textareaClassName,
} from "@/components/ui/form";
import { getI18n } from "@/lib/i18n-server";
import { interpolate, type Dictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

function statusLabel(status: string, t: Dictionary) {
  if (status === "open") {
    return t.common.open;
  }
  if (status === "upcoming") {
    return t.common.openingSoon;
  }
  if (status === "closed") {
    return t.common.closed;
  }

  return status;
}

function bookingStatusLabel(status: string, t: Dictionary) {
  if (status === "pending") {
    return t.common.pending;
  }
  if (status === "confirmed") {
    return t.common.confirmed;
  }

  return status;
}

function classBadge(status: string, t: Dictionary) {
  if (status === "open" || status === "upcoming" || status === "closed") {
    return <Badge variant={status}>{statusLabel(status, t)}</Badge>;
  }

  return <Badge>{status}</Badge>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const { locale, t } = await getI18n();
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
          aria-label={t.common.backToClasses}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <ShieldAlert className="h-6 w-6" />
          <h1 className="mt-3 text-2xl font-black">
            {t.admin.supabaseRequired}
          </h1>
          <p className="mt-2 text-sm leading-6">
            {t.admin.connectSupabase}
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
          aria-label={t.common.backToClasses}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <section className="rounded-lg border border-stone-200 bg-white p-5">
          <h1 className="text-2xl font-black">{t.admin.adminLogin}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {interpolate(t.admin.manageIntro, { email: ADMIN_EMAIL })}
          </p>
          <Link
            href="/login"
            className="mt-5 flex h-12 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white"
          >
            {t.common.signIn}
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
          aria-label={t.common.backToClasses}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
          <ShieldAlert className="h-6 w-6" />
          <h1 className="mt-3 text-2xl font-black">{t.admin.accessDenied}</h1>
          <p className="mt-2 text-sm leading-6">
            {interpolate(t.admin.accessLimited, { email: ADMIN_EMAIL })}
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
              aria-label={t.common.backToClasses}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
                {t.common.admin}
              </p>
              <h1 className="text-2xl font-black">{t.admin.management}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher initialLocale={locale} label={t.common.language} />
            <form action={signOutAction}>
              <Button variant="secondary" size="compact">
                {t.common.signOut}
              </Button>
            </form>
          </div>
        </div>
      </header>

      {params?.message ? (
        <p className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm font-medium text-cyan-900">
          {params.message}
        </p>
      ) : null}

      <section className="mt-5 grid grid-cols-3 gap-3">
        <Card className="shadow-none">
          <p className="text-sm font-semibold text-slate-500">
            {t.common.open}
          </p>
          <p className="mt-1 text-3xl font-black">{groupedClasses.open.length}</p>
        </Card>
        <Card className="shadow-none">
          <p className="text-sm font-semibold text-slate-500">
            {t.common.pending}
          </p>
          <p className="mt-1 text-3xl font-black">
            {bookings.filter((booking) => booking.status === "pending").length}
          </p>
        </Card>
        <Card className="shadow-none">
          <p className="text-sm font-semibold text-slate-500">
            {t.admin.students}
          </p>
          <p className="mt-1 text-3xl font-black">{profiles.length}</p>
        </Card>
      </section>

      <Card className="mt-6">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <CalendarPlus className="h-5 w-5 text-cyan-800" />
          {t.admin.createClass}
        </h2>
        <form action={createClassAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.title}
            <Input name="title" required />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.admin.startsAt}
            <input
              name="startsAt"
              type="datetime-local"
              required
              className={inputClassName}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.location}
            <Input name="location" required />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.capacity}
            <input
              name="capacity"
              type="number"
              min="1"
              required
              className={inputClassName}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.status}
            <Select name="status" defaultValue="upcoming">
              <option value="upcoming">{t.common.openingSoon}</option>
              <option value="open">{t.common.open}</option>
              <option value="closed">{t.common.closed}</option>
            </Select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
            {t.common.summary}
            <Textarea name="summary" required />
          </label>
          <Button className="md:col-span-2">
            {t.common.create}
          </Button>
        </form>
      </Card>

      {(["open", "upcoming", "closed"] as const).map((status) => (
        <section key={status} className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black">
              {statusLabel(status, t)} {t.common.classes}
            </h2>
            <span className="text-sm font-bold text-slate-500">
              {groupedClasses[status].length}
            </span>
          </div>
          <div className="grid gap-4">
            {groupedClasses[status].length === 0 ? (
              <p className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-slate-600">
                {interpolate(t.admin.noClasses, {
                  status: statusLabel(status, t),
                })}
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
                    {classBadge(classItem.effective_status, t)}
                  </div>

                  <div className="mt-3 grid gap-1 text-sm text-slate-700">
                    <p>
                      {formatMalaysiaDateTime(classItem.starts_at, locale)} MYT
                    </p>
                    <p>
                      {classItem.confirmed_count}/{classItem.capacity}{" "}
                      {t.common.confirmed}
                      {classItem.pending_count > 0
                        ? `, ${classItem.pending_count} ${t.common.pending}`
                        : ""}
                    </p>
                    <p>{classItem.summary}</p>
                  </div>

                  <details className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3">
                    <summary className="cursor-pointer text-sm font-bold">
                      {t.admin.editClass}
                    </summary>
                    <form
                      action={updateClassAction}
                      className="mt-3 grid gap-3 md:grid-cols-2"
                    >
                      <input type="hidden" name="classId" value={classItem.id} />
                      <label className="grid gap-1.5 text-sm font-semibold">
                        {t.common.title}
                        <input
                          name="title"
                          required
                          defaultValue={classItem.title}
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        {t.admin.startsAt}
                        <input
                          name="startsAt"
                          type="datetime-local"
                          required
                          defaultValue={toMalaysiaLocalInputValue(
                            classItem.starts_at,
                          )}
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        {t.common.location}
                        <input
                          name="location"
                          required
                          defaultValue={classItem.location}
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        {t.common.capacity}
                        <input
                          name="capacity"
                          type="number"
                          min="1"
                          required
                          defaultValue={classItem.capacity}
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold">
                        {t.common.status}
                        <select
                          name="status"
                          defaultValue={classItem.status}
                          className={inputClassName}
                        >
                          <option value="upcoming">{t.common.openingSoon}</option>
                          <option value="open">{t.common.open}</option>
                          <option value="closed">{t.common.closed}</option>
                        </select>
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                        {t.common.summary}
                        <textarea
                          name="summary"
                          required
                          defaultValue={classItem.summary}
                          className={textareaClassName}
                        />
                      </label>
                      <Button className="md:col-span-2">
                        {t.common.saveChanges}
                      </Button>
                    </form>
                  </details>

                  <div className="mt-4">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase text-slate-500">
                      <UsersRound className="h-4 w-4" />
                      {t.admin.studentList}
                    </h4>
                    <div className="mt-2 grid gap-2">
                      {classBookings.length === 0 ? (
                        <p className="rounded-lg bg-stone-50 p-3 text-sm text-slate-600">
                          {t.admin.noBookings}
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
                                  t.common.student}
                              </p>
                              <p className="break-all text-xs text-slate-500">
                                {booking.profiles?.email}
                              </p>
                            </div>
                            <Badge>{bookingStatusLabel(booking.status, t)}</Badge>
                          </div>
                          {booking.status === "pending" ? (
                            <form action={approveBookingAction} className="mt-3">
                              <input
                                type="hidden"
                                name="bookingId"
                                value={booking.id}
                              />
                              <Button variant="success" size="compact" className="w-full">
                                <Check className="h-4 w-4" />
                                {t.common.approve}
                              </Button>
                            </form>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    {pendingBookings.length > 0 ? (
                      <p className="mt-2 text-xs font-semibold text-amber-800">
                        {interpolate(t.admin.pendingDeposit, {
                          count: pendingBookings.length,
                        })}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <Card className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <TicketPlus className="h-5 w-5 text-cyan-800" />
          {t.admin.studentVouchers}
        </h2>
        <form action={grantVoucherAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.student}
            <Select name="userId" required>
              <option value="">{t.admin.selectStudent}</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.full_name || profile.email}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.admin.voucherCount}
            <input
              name="count"
              type="number"
              min="1"
              defaultValue="1"
              required
              className={inputClassName}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.expireDate}
            <input
              name="expiresAt"
              type="date"
              defaultValue={defaultVoucherExpiryDate()}
              required
              className={inputClassName}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.note}
            <Input name="note" />
          </label>
          <Button className="md:col-span-2">
            {t.admin.addVoucher}
          </Button>
        </form>

        <div className="mt-5 grid gap-2">
          {vouchers.length === 0 ? (
            <p className="rounded-lg bg-stone-50 p-3 text-sm text-slate-600">
              {t.admin.noVouchers}
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
                      t.common.student}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.common.expires}{" "}
                    {formatMalaysiaDate(voucher.expires_at, locale)}
                  </p>
                </div>
                <span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-sm font-black text-cyan-900">
                  {voucher.remaining_count}/{voucher.total_count}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </main>
  );
}
