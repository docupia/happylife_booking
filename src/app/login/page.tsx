import Link from "next/link";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";

import { signInAction, signUpAction } from "../actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card } from "@/components/ui/card";
import { IdleActivityReset } from "@/components/idle-activity-reset";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Input } from "@/components/ui/form";
import { hasSupabaseEnv } from "@/lib/config";
import { getI18n } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{
    mode?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const { locale, t } = await getI18n();
  const isSignup = params?.mode === "signup";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
      <IdleActivityReset />
      <div className="mb-5 flex items-center justify-between gap-3">
        <Button asChild variant="secondary" size="icon">
          <Link href="/" aria-label={t.common.backToClasses}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <LanguageSwitcher initialLocale={locale} label={t.common.language} />
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-800">
          HappyLife
        </p>
        <h1 className="mt-1 text-3xl font-black">
          {isSignup ? t.auth.createAccount : t.auth.welcomeBack}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t.auth.useSameLogin}
        </p>

        {params?.message ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950">
            {params.message}
          </p>
        ) : null}

        {!hasSupabaseEnv() ? (
          <p className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-slate-600">
            {t.auth.supabaseRequired}
          </p>
        ) : null}

        <form
          action={isSignup ? signUpAction : signInAction}
          className="mt-5 grid gap-3"
        >
          {isSignup ? (
            <label className="grid gap-1.5 text-sm font-semibold">
              {t.common.fullName}
              <Input
                name="fullName"
                required
                className="h-12 text-base"
                placeholder={t.auth.yourName}
              />
            </label>
          ) : null}
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.email}
            <Input
              name="email"
              type="email"
              required
              className="h-12 text-base"
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.common.password}
            <Input
              name="password"
              type="password"
              required
              minLength={6}
              className="h-12 text-base"
              placeholder={t.auth.atLeastCharacters}
            />
          </label>
          <SubmitButton
            className="mt-2 h-12"
            pendingText={isSignup ? t.common.signingUp : t.common.signingIn}
          >
            {isSignup ? (
              <>
                <UserPlus className="h-4 w-4" />
                {t.common.signUp}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {t.common.signIn}
              </>
            )}
          </SubmitButton>
        </form>

        <div className="mt-5 rounded-lg bg-stone-50 p-3 text-center text-sm">
          {isSignup ? (
            <Link href="/login" className="font-bold text-cyan-800">
              {t.auth.alreadyHaveAccount}
            </Link>
          ) : (
            <Link href="/login?mode=signup" className="font-bold text-cyan-800">
              {t.auth.newMember}
            </Link>
          )}
        </div>
      </Card>
    </main>
  );
}
