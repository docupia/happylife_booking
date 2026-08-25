# HappyLife Booking

Mobile-first class booking management built with Next.js, Supabase Auth/DB, and Vercel-ready deployment.

## Features

- Member sign up and login with Supabase Auth
- Class list split into Open and Opening Soon for users
- Admin-only area for `shswjs7682@gmail.com`
- Class create/edit with Open, Opening Soon, and Closed status
- Automatic effective Closed status after the class start time
- Booking requests with capacity checks
- Voucher bookings confirmed immediately with one voucher deducted
- Non-voucher bookings stay Pending until admin deposit approval
- Student list and voucher registration with a default one-month expiry
- Malaysia time display and date handling

## Local Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor, or use the Supabase CLI to push it.
3. Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cfpsvjetsfokdorxkjwn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_nrHcfkBpG7PG7UNDHyt0yg_--fGABoS
```

4. Install and run:

```bash
npm install
npm run dev
```

## GitHub and Vercel Deployment

1. Push this repository to GitHub.
2. Import the GitHub repository in Vercel as a Next.js project.
3. Set Vercel Root Directory to the repository root. Leave it blank or use `./`.
3. Supabase deployment environment variables are included in `vercel.json`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cfpsvjetsfokdorxkjwn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_nrHcfkBpG7PG7UNDHyt0yg_--fGABoS
```

4. In Supabase Auth settings, add the Vercel production URL to allowed redirect URLs.
5. Deploy.

If Vercel says it cannot detect the Next.js version, the Root Directory is pointing at the wrong folder. The `package.json` file must be visible at the selected root.

Do not add the direct database connection string to Vercel. It is only for database administration and migrations.
