import { requireSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { getMessages } from "@/lib/locale";
import { ClientsManager } from "@/components/ClientsManager";

interface ClientRow {
  id: string;
  name: string;
  email: string | null;
  vat_number: string | null;
}

export default async function ClientsPage() {
  const session = await requireSession();
  const { messages: t } = await getMessages();
  const db = sql();
  const rows = await db<ClientRow[]>`
    SELECT id, name, email, vat_number
    FROM clients
    WHERE user_id = ${session.userId}
    ORDER BY name
  `;

  return (
    <div>
      <ClientsManager initialClients={rows} t={t.dashboard.clients} />
    </div>
  );
}
