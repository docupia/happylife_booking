import Link from "next/link";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";

import { signInAction, signUpAction } from "../actions";
import { hasSupabaseEnv } from "@/lib/config";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{
    mode?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const isSignup = params?.mode === "signup";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
      <Link
        href="/"
        className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-white"
        aria-label="Back to classes"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-800">
          HappyLife
        </p>
        <h1 className="mt-1 text-3xl font-black">
          {isSignup ? "Create account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use the same login for class bookings and admin management.
        </p>

        {params?.message ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950">
            {params.message}
          </p>
        ) : null}

        {!hasSupabaseEnv() ? (
          <p className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-slate-600">
            Supabase environment variables are required before authentication
            can run.
          </p>
        ) : null}

        <form
          action={isSignup ? signUpAction : signInAction}
          className="mt-5 grid gap-3"
        >
          {isSignup ? (
            <label className="grid gap-1.5 text-sm font-semibold">
              Full name
              <input
                name="fullName"
                required
                className="h-12 rounded-lg border border-stone-300 bg-white px-3 text-base outline-none focus:border-cyan-700"
                placeholder="Your name"
              />
            </label>
          ) : null}
          <label className="grid gap-1.5 text-sm font-semibold">
            Email
            <input
              name="email"
              type="email"
              required
              className="h-12 rounded-lg border border-stone-300 bg-white px-3 text-base outline-none focus:border-cyan-700"
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="h-12 rounded-lg border border-stone-300 bg-white px-3 text-base outline-none focus:border-cyan-700"
              placeholder="At least 6 characters"
            />
          </label>
          <button
            type="submit"
            className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-bold text-white"
          >
            {isSignup ? (
              <>
                <UserPlus className="h-4 w-4" />
                Sign up
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        <div className="mt-5 rounded-lg bg-stone-50 p-3 text-center text-sm">
          {isSignup ? (
            <Link href="/login" className="font-bold text-cyan-800">
              Already have an account? Sign in
            </Link>
          ) : (
            <Link href="/login?mode=signup" className="font-bold text-cyan-800">
              New member? Create account
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
