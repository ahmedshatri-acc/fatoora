import { requireSession } from "@/lib/session";
import { getStripe, PLANS } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const CheckoutSchema = z.object({
  plan: z.enum(["individual", "business"]),
});

export async function POST(request: Request) {
  // Use iron-session auth (consistent with the rest of the app)
  const session = await requireSession().catch(() => null);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { plan } = parsed.data;
  const priceId = PLANS[plan]?.priceId;

  if (!priceId) {
    return NextResponse.json({ error: "Plan not configured" }, { status: 500 });
  }

  const stripe = getStripe();

  // Use APP_URL (server-only) to avoid NEXT_PUBLIC_ exposure; fall back to NEXT_PUBLIC_APP_URL
  const appUrl =
    process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: session.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { user_id: session.userId, plan },
    success_url: `${appUrl}/dashboard/settings?success=1`,
    cancel_url: `${appUrl}/dashboard/settings`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
