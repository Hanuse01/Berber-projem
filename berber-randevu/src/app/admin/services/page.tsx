"use client";
import React, { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  price: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  function reload() {
    setLoading(true);
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setServices([]);
        setError("Hizmetler yüklenemedi");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          window.location.href = "/auth/login";
        }
      });
    reload();
    // eslint-disable-next-line
  }, [actionLoading]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading("add");
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price) }),
    });
    setName(""); setPrice("");
    setActionLoading("");
    reload();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Hizmeti silmek istediğinize emin misiniz?")) return;
    setActionLoading(id);
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setActionLoading("");
    reload();
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Hizmet Yönetimi</h2>
      <form className="flex gap-2 mb-6" onSubmit={handleAdd}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Hizmet Adı" className="border p-2 rounded flex-1" required />
        <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="Fiyat" className="border p-2 rounded w-24" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={actionLoading === "add"}>Ekle</button>
      </form>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Ad</th>
            <th className="p-2 border">Fiyat</th>
            <th className="p-2 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.price} ₺</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600" onClick={() => handleDelete(s.id)} disabled={actionLoading === s.id}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 