import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
}

const sessionOptions = {
  cookieName: "fatoora_session",
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    // Only send cookie over HTTPS in production
    secure: process.env.NODE_ENV === "production",
    // Prevent JavaScript access to the cookie
    httpOnly: true,
    // 'strict' prevents the cookie from being sent with cross-site requests,
    // providing strong CSRF protection for this SPA-style Next.js app.
    sameSite: "strict" as const,
    // 7 days — appropriate for a financial SaaS; shorter than the previous 30 days
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) throw new Error("Not authenticated");
  return { userId: session.userId, email: session.email, name: session.name };
}
