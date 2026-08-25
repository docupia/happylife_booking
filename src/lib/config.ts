export const ADMIN_EMAIL = "shswjs7682@gmail.com";
export const MALAYSIA_TIME_ZONE = "Asia/Kuala_Lumpur";

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
