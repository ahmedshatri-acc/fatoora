import Stripe from "stripe";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = sql();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await db`
        INSERT INTO profiles (user_id, plan, stripe_customer_id, stripe_subscription_id, subscribed_at)
        VALUES (${userId}, ${plan}, ${session.customer as string}, ${session.subscription as string}, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          plan = EXCLUDED.plan,
          stripe_customer_id = EXCLUDED.stripe_customer_id,
          stripe_subscription_id = EXCLUDED.stripe_subscription_id,
          subscribed_at = NOW()
      `;
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await db`
      UPDATE profiles SET plan = NULL, stripe_subscription_id = NULL
      WHERE stripe_subscription_id = ${sub.id}
    `;
  }

  return NextResponse.json({ received: true });
}
