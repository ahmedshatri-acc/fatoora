import { sql } from "@/lib/db";
import { computeAccess, type PlanId, type AccessState } from "@/lib/plans";

export interface AccountSnapshot {
  userId: string;
  email: string;
  name: string;
  trialStartedAt: Date;
  plan: PlanId | null;
  defaultSellerName: string | null;
  defaultSellerVat: string | null;
  defaultNotes: string | null;
  logoData: string | null;
  invoicePrefix: string | null;
  access: AccessState;
}

export async function getAccountSnapshot(userId: string): Promise<AccountSnapshot | null> {
  const db = sql();
  const rows = await db`
    SELECT
      u.id AS user_id, u.email, u.name, u.trial_started_at,
      p.plan, p.default_seller_name, p.default_seller_vat, p.default_notes,
      p.logo_data, p.invoice_prefix
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.id = ${userId}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const r = rows[0];
  const plan = (r.plan as PlanId | null) ?? null;
  const trialStartedAt = r.trial_started_at ?? new Date();
  return {
    userId: r.user_id,
    email: r.email,
    name: r.name,
    trialStartedAt: new Date(trialStartedAt),
    plan,
    defaultSellerName: r.default_seller_name ?? null,
    defaultSellerVat: r.default_seller_vat ?? null,
    defaultNotes: r.default_notes ?? null,
    logoData: r.logo_data ?? null,
    invoicePrefix: r.invoice_prefix ?? null,
    access: computeAccess({ plan, trialStartedAt }),
  };
}

export async function countInvoicesThisMonth(userId: string): Promise<number> {
  const db = sql();
  const rows = await db`
    SELECT COUNT(*)::int AS count
    FROM invoices
    WHERE user_id = ${userId}
      AND created_at >= date_trunc('month', NOW())
  `;
  return rows[0]?.count ?? 0;
}
