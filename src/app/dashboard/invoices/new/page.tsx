import { requireSession } from "@/lib/session";
import { getMessages } from "@/lib/locale";
import { getAccountSnapshot } from "@/lib/account";
import { NewInvoiceForm } from "@/components/NewInvoiceForm";
import { sql } from "@/lib/db";

interface ClientRow {
  id: string;
  name: string;
  email: string | null;
  vat_number: string | null;
}

interface ItemRow {
  id: string;
  name: string;
  unit_price: string;
}

export default async function NewInvoicePage() {
  const session = await requireSession();
  const { messages: t } = await getMessages();
  const account = await getAccountSnapshot(session.userId);
  const db = sql();

  const [clients, items] = await Promise.all([
    db<ClientRow[]>`SELECT id, name, email, vat_number FROM clients WHERE user_id = ${session.userId} ORDER BY name LIMIT 200`,
    db<ItemRow[]>`SELECT id, name, unit_price FROM items WHERE user_id = ${session.userId} ORDER BY name LIMIT 500`,
  ]);

  return (
    <NewInvoiceForm
      defaults={{
        sellerName: account?.defaultSellerName ?? "",
        sellerVat: account?.defaultSellerVat ?? "",
        notes: account?.defaultNotes ?? "",
      }}
      clients={clients}
      savedItems={items.map(i => ({ ...i, unit_price: Number(i.unit_price) }))}
      blocked={account?.access.blocked ?? false}
      t={t.dashboard.new}
      ti={t.dashboard.invoices}
    />
  );
}
