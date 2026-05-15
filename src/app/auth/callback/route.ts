import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Use the canonical app URL from server-only env var (not NEXT_PUBLIC_) so that
// the redirect target cannot be influenced by a spoofed Host header.
function appUrl(): string {
  return (
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const base = appUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${base}/dashboard`);
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
