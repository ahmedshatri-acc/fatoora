import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { getMessages } from "@/lib/locale";
import { ItemsManager } from "@/components/ItemsManager";

interface ItemRow {
  id: string;
  name: string;
  unit_price: string | number;
}

export default async function ItemsPage() {
  const session = await requireSession();
  const { messages: t } = await getMessages();
  const db = sql();
  const rows = await db<ItemRow[]>`
    SELECT id, name, unit_price FROM items
    WHERE user_id = ${session.userId}
    ORDER BY name
  `;

  return <ItemsManager initialItems={rows} t={t.dashboard.items} />;
}
