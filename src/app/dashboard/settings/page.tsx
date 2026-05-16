import { requireSession } from "@/lib/session";
import { getMessages } from "@/lib/locale";
import { getAccountSnapshot } from "@/lib/account";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await requireSession();
  const { messages: t } = await getMessages();
  const account = await getAccountSnapshot(session.userId);

  return (
    <SettingsForm
      initial={{
        name: account?.name ?? session.name,
        email: account?.email ?? session.email,
        plan: account?.plan ?? null,
        trialDaysRemaining: account?.access.daysRemaining ?? 0,
        trialActive: account?.access.trialActive ?? false,
        defaultSellerName: account?.defaultSellerName ?? "",
        defaultSellerVat: account?.defaultSellerVat ?? "",
        defaultNotes: account?.defaultNotes ?? "",
      }}
      t={t.dashboard.settings}
    />
  );
}
