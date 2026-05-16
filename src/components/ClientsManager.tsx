"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Pencil, Trash2, Users } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  vat_number: string | null;
}

interface ClientsT {
  title: string;
  addNew: string;
  newClientTitle: string;
  editClientTitle: string;
  name: string;
  email: string;
  vat: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  empty: string;
  addFirst: string;
  deleteConfirm: string;
  noEmail: string;
  noVat: string;
}

export function ClientsManager({ initialClients, t }: { initialClients: Client[]; t: ClientsT }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [editing, setEditing] = useState<Client | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vat, setVat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openAdd() {
    setEditing(null);
    setName("");
    setEmail("");
    setVat("");
    setError("");
    setAdding(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setName(c.name);
    setEmail(c.email ?? "");
    setVat(c.vat_number ?? "");
    setError("");
    setAdding(true);
  }

  function close() {
    setAdding(false);
    setEditing(null);
    setError("");
  }

  async function save() {
    if (!name.trim()) {
      setError("Required");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (editing) {
        const res = await fetch(`/api/clients/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined, vat_number: vat.trim() || undefined }),
        });
        if (!res.ok) throw new Error("Save failed");
        setClients(clients.map(c => c.id === editing.id
          ? { ...c, name: name.trim(), email: email.trim() || null, vat_number: vat.trim() || null }
          : c));
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined, vat_number: vat.trim() || undefined }),
        });
        if (!res.ok) throw new Error("Save failed");
        const { client } = await res.json();
        setClients([...clients.filter(c => c.id !== client.id), client].sort((a, b) => a.name.localeCompare(b.name)));
      }
      close();
    } catch {
      setError("Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(t.deleteConfirm)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) setClients(clients.filter(c => c.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <Button onClick={openAdd}>{t.addNew}</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {clients.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {clients.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate" dir="ltr">
                    {c.email ?? t.noEmail}
                    {c.vat_number && <span className="ms-2">· {c.vat_number}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={t.edit}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    disabled={busy}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-colors"
                    aria-label={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.empty}</p>
            <Button onClick={openAdd}>{t.addFirst}</Button>
          </div>
        )}
      </Card>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={close}>
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {editing ? t.editClientTitle : t.newClientTitle}
            </h2>
            <div className="space-y-4">
              <Input id="cname" label={t.name} value={name} onChange={(e) => setName(e.target.value)} required />
              <Input id="cemail" type="email" label={t.email} value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
              <Input id="cvat" label={t.vat} value={vat} onChange={(e) => setVat(e.target.value)} maxLength={15} dir="ltr" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={close}>{t.cancel}</Button>
                <Button onClick={save} loading={busy}>{t.save}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
