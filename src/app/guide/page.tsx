import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  ClipboardCheck,
  LogIn,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { signOutAction } from "../actions";
import { getSessionContext } from "@/lib/booking-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SubmitButton } from "@/components/ui/submit-button";
import { getI18n } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function GuidePage() {
  const { locale, t } = await getI18n();
  const { user, isAdmin } = await getSessionContext();
  const approvalCriteria = [
    t.guide.approvalCriteria.one,
    t.guide.approvalCriteria.two,
    t.guide.approvalCriteria.three,
    t.guide.approvalCriteria.four,
    t.guide.approvalCriteria.five,
  ];
  const manners = [t.guide.manners.one, t.guide.manners.two];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-4 sm:px-6">
      <header className="sticky top-0 z-10 -mx-4 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="secondary" size="icon">
            <Link href="/" aria-label={t.common.backToClasses}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
              HappyLife
            </p>
            <h1 className="truncate text-2xl font-black tracking-normal">
              {t.common.guide}
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

      <section className="mt-5">
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-800 text-white">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">{t.guide.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t.guide.intro}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-black">
            <ClipboardCheck className="h-5 w-5 text-cyan-800" />
            {t.guide.approvalTitle}
          </h2>
          <ol className="mt-4 grid gap-3">
            {approvalCriteria.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-6">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-black text-slate-700">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-slate-700">{item}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-black">
            <Sparkles className="h-5 w-5 text-amber-700" />
            {t.guide.mannersTitle}
          </h2>
          <ol className="mt-4 grid gap-3">
            {manners.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-6">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xs font-black text-amber-900">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-slate-700">{item}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div
          className={`mx-auto grid max-w-3xl gap-2 ${
            isAdmin ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          <Button asChild variant="ghost">
            <Link href="/">{t.common.classes}</Link>
          </Button>
          <Button asChild>
            <a href="#">{t.common.guide}</a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/login">{t.common.account}</Link>
          </Button>
          {isAdmin ? (
            <Button asChild variant="ghost">
              <Link href="/admin">
                <ShieldCheck className="h-4 w-4" />
                {t.common.admin}
              </Link>
            </Button>
          ) : null}
        </div>
      </nav>
    </main>
  );
}
