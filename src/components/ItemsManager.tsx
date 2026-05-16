"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Pencil, Trash2, Package } from "lucide-react";
import { formatSAR } from "@/lib/zatca";

interface Item {
  id: string;
  name: string;
  unit_price: string | number;
}

interface ItemsT {
  title: string;
  subtitle: string;
  addNew: string;
  newItemTitle: string;
  editItemTitle: string;
  name: string;
  unitPrice: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  empty: string;
  addFirst: string;
  deleteConfirm: string;
}

export function ItemsManager({ initialItems, t }: { initialItems: Item[]; t: ItemsT }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editing, setEditing] = useState<Item | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openAdd() {
    setEditing(null);
    setName("");
    setPrice("0");
    setError("");
    setAdding(true);
  }
  function openEdit(it: Item) {
    setEditing(it);
    setName(it.name);
    setPrice(String(it.unit_price));
    setError("");
    setAdding(true);
  }
  function close() {
    setAdding(false);
    setEditing(null);
    setError("");
  }

  async function save() {
    const priceNum = Number(price);
    if (!name.trim() || Number.isNaN(priceNum) || priceNum < 0) {
      setError("Invalid input");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (editing) {
        const res = await fetch(`/api/items/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), unit_price: priceNum }),
        });
        if (!res.ok) throw new Error();
        setItems(items.map(i => i.id === editing.id ? { ...i, name: name.trim(), unit_price: priceNum } : i));
      } else {
        const res = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), unit_price: priceNum }),
        });
        if (!res.ok) throw new Error();
        const { item } = await res.json();
        setItems([...items.filter(i => i.id !== item.id), item].sort((a, b) => a.name.localeCompare(b.name)));
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
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (res.ok) setItems(items.filter(i => i.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <Button onClick={openAdd}>{t.addNew}</Button>
      </div>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>

      <Card className="p-0 overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{it.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatSAR(Number(it.unit_price))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(it)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label={t.edit}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(it.id)} disabled={busy} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950" aria-label={t.delete}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.empty}</p>
            <Button onClick={openAdd}>{t.addFirst}</Button>
          </div>
        )}
      </Card>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={close}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {editing ? t.editItemTitle : t.newItemTitle}
            </h2>
            <div className="space-y-4">
              <Input id="iname" label={t.name} value={name} onChange={(e) => setName(e.target.value)} required />
              <Input id="iprice" type="number" min="0" step="0.01" label={t.unitPrice} value={price} onChange={(e) => setPrice(e.target.value)} dir="ltr" />
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
