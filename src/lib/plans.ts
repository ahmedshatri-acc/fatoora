export type PlanId = "individual" | "business";

export const PLANS = {
  individual: {
    id: "individual" as const,
    priceMonthly: 49,
    monthlyInvoiceLimit: 50,
  },
  business: {
    id: "business" as const,
    priceMonthly: 149,
    monthlyInvoiceLimit: Infinity,
  },
} as const;

export const TRIAL_DAYS = 14;
export const TRIAL_INVOICE_LIMIT = 50;

export interface AccessState {
  plan: PlanId | null;
  trialStartedAt: Date;
  trialEndsAt: Date;
  trialActive: boolean;
  daysRemaining: number;
  monthlyLimit: number;
  blocked: boolean;
}

export function computeAccess(params: {
  plan: PlanId | null;
  trialStartedAt: Date | string;
}): AccessState {
  const trialStartedAt = new Date(params.trialStartedAt);
  const trialEndsAt = new Date(trialStartedAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const now = new Date();
  const trialActive = now < trialEndsAt;
  const daysRemaining = Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

  const monthlyLimit = params.plan
    ? PLANS[params.plan].monthlyInvoiceLimit
    : trialActive
      ? TRIAL_INVOICE_LIMIT
      : 0;

  return {
    plan: params.plan,
    trialStartedAt,
    trialEndsAt,
    trialActive,
    daysRemaining,
    monthlyLimit,
    blocked: !params.plan && !trialActive,
  };
}
