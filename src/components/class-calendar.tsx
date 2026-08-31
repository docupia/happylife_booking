"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

import type { BookingRow, ClassWithCounts } from "@/lib/booking-data";
import { MALAYSIA_TIME_ZONE } from "@/lib/config";
import type { Dictionary, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ClassCard } from "@/components/class-card";
import { Button } from "@/components/ui/button";

type MonthCursor = {
  year: number;
  month: number;
};

function intlLocale(locale: Locale) {
  return locale === "ko" ? "ko-KR" : "en-MY";
}

function malaysiaParts(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MALAYSIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    key: `${map.year}-${map.month}-${map.day}`,
  };
}

function monthKey(month: MonthCursor) {
  return `${month.year}-${String(month.month).padStart(2, "0")}`;
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addMonths(month: MonthCursor, amount: number) {
  const next = new Date(Date.UTC(month.year, month.month - 1 + amount, 1));

  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
  };
}

function formatMonth(month: MonthCursor, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(month.year, month.month - 1, 1)));
}

function formatDateLabel(key: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${key}T00:00:00Z`));
}

function weekdayLabels(locale: Locale) {
  const formatter = new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: "UTC",
    weekday: "short",
  });

  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2026, 1, 1 + index))),
  );
}

function initialMonth(classes: ClassWithCounts[]) {
  const today = malaysiaParts(new Date());
  const currentMonthKey = monthKey(today);
  const hasCurrentMonthClass = classes.some((classItem) =>
    malaysiaParts(classItem.starts_at).key.startsWith(currentMonthKey),
  );

  if (hasCurrentMonthClass || classes.length === 0) {
    return { year: today.year, month: today.month };
  }

  const firstClass = malaysiaParts(classes[0].starts_at);
  return { year: firstClass.year, month: firstClass.month };
}

export function ClassCalendar({
  classes,
  userBookings,
  isSignedIn,
  locale,
  t,
}: {
  classes: ClassWithCounts[];
  userBookings: BookingRow[];
  isSignedIn: boolean;
  locale: Locale;
  t: Dictionary;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => initialMonth(classes));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const todayKey = malaysiaParts(new Date()).key;

  const activeBookings = useMemo(
    () =>
      userBookings.filter(
        (booking) =>
          booking.status === "pending" || booking.status === "confirmed",
      ),
    [userBookings],
  );
  const bookingsByClassId = useMemo(
    () => new Map(activeBookings.map((booking) => [booking.class_id, booking])),
    [activeBookings],
  );
  const classesByDate = useMemo(() => {
    const grouped = new Map<string, ClassWithCounts[]>();

    for (const classItem of classes) {
      const key = malaysiaParts(classItem.starts_at).key;
      grouped.set(key, [...(grouped.get(key) ?? []), classItem]);
    }

    return grouped;
  }, [classes]);
  const bookedDateKeys = useMemo(() => {
    const keys = new Set<string>();

    for (const booking of activeBookings) {
      const classItem = classes.find((item) => item.id === booking.class_id);

      if (classItem) {
        keys.add(malaysiaParts(classItem.starts_at).key);
      }
    }

    return keys;
  }, [activeBookings, classes]);

  const selectedClasses = selectedDateKey
    ? (classesByDate.get(selectedDateKey) ?? [])
    : [];
  const daysInMonth = new Date(
    Date.UTC(visibleMonth.year, visibleMonth.month, 0),
  ).getUTCDate();
  const firstWeekday = new Date(
    Date.UTC(visibleMonth.year, visibleMonth.month - 1, 1),
  ).getUTCDay();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <section className="mb-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-5 w-5 shrink-0 text-cyan-800" />
          <h3 className="truncate text-lg font-black">
            {t.home.classCalendar}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t.home.previousMonth}
            onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t.home.nextMonth}
            onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-base font-bold text-slate-900">
          {formatMonth(visibleMonth, locale)}
        </p>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
            {t.home.classDate}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            {t.home.bookedDate}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500">
        {weekdayLabels(locale).map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const key = dateKey(visibleMonth.year, visibleMonth.month, day);
          const dateClasses = classesByDate.get(key) ?? [];
          const hasClasses = dateClasses.length > 0;
          const isBooked = bookedDateKeys.has(key);
          const isToday = key === todayKey;

          if (!hasClasses) {
            return (
              <div
                key={key}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-sm font-semibold text-slate-400",
                  isToday && "ring-2 ring-cyan-200",
                )}
              >
                {day}
              </div>
            );
          }

          return (
            <button
              key={key}
              type="button"
              aria-label={`${formatDateLabel(key, locale)} ${t.common.classes}`}
              onClick={() => setSelectedDateKey(key)}
              className={cn(
                "flex aspect-square min-h-10 flex-col items-center justify-center rounded-lg border text-sm font-black shadow-sm transition duration-150 ease-out active:scale-[0.96]",
                isBooked
                  ? "border-emerald-700 bg-emerald-600 text-white"
                  : "border-cyan-700 bg-cyan-50 text-cyan-950",
                isToday && "ring-2 ring-cyan-300 ring-offset-1",
              )}
            >
              <span>{day}</span>
              {dateClasses.length > 1 ? (
                <span className="text-[10px] leading-none">
                  {dateClasses.length}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedDateKey ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label={t.common.close}
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setSelectedDateKey(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="class-calendar-dialog-title"
            className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-stone-50 p-4 shadow-2xl sm:rounded-lg"
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-cyan-800">
                  {t.common.open} {t.common.classes}
                </p>
                <h3
                  id="class-calendar-dialog-title"
                  className="truncate text-lg font-black text-slate-950"
                >
                  {formatDateLabel(selectedDateKey, locale)}
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t.common.close}
                onClick={() => setSelectedDateKey(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid gap-3">
              {selectedClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  booking={bookingsByClassId.get(classItem.id)}
                  isSignedIn={isSignedIn}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
