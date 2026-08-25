import Link from "next/link";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getI18n } from "@/lib/i18n-server";
import { interpolate } from "@/lib/i18n";

type CheckEmailPageProps = {
  searchParams?: Promise<{
    email?: string;
  }>;
};

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const params = await searchParams;
  const { locale, t } = await getI18n();
  const email = params?.email;
  const message = email
    ? interpolate(t.auth.sentVerificationTo, { email })
    : t.auth.sentVerification;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-5">
      <div className="mb-4 flex justify-end">
        <LanguageSwitcher initialLocale={locale} label={t.common.language} />
      </div>
      <Card className="p-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-800 text-white">
          <MailCheck className="h-7 w-7" />
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-800">
          {t.auth.emailVerification}
        </p>
        <h1 className="mt-1 text-3xl font-black">{t.auth.checkEmail}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {message}
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/login">{t.common.okGoToLogin}</Link>
        </Button>
      </Card>
    </main>
  );
}
