"use client";
import React, { useEffect, useState } from "react";

interface Appointment {
  id: string;
  user: { name: string; email: string };
  service: { name: string };
  date: string;
  status: string;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  function reload() {
    setLoading(true);
    fetch("/api/admin/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setAppointments([]);
        setError("Randevular yüklenemedi");
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

  async function handleStatus(id: string, status: string) {
    setActionLoading(id + status);
    await fetch(`/api/admin/appointments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActionLoading("");
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Randevuyu silmek istediğinize emin misiniz?")) return;
    setActionLoading(id + "delete");
    await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
    setActionLoading("");
  }

  function getStatusText(status: string) {
    switch (status) {
      case "PENDING": return "Beklemede";
      case "CONFIRMED": return "Onaylandı";
      case "CANCELLED": return "İptal Edildi";
      case "COMPLETED": return "Tamamlandı";
      default: return status;
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Randevu Yönetimi</h2>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Kullanıcı</th>
            <th className="p-2 border">Hizmet</th>
            <th className="p-2 border">Tarih</th>
            <th className="p-2 border">Durum</th>
            <th className="p-2 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td className="p-2 border">{a.user.name} ({a.user.email})</td>
              <td className="p-2 border">{a.service.name}</td>
              <td className="p-2 border">{new Date(a.date).toLocaleString()}</td>
              <td className="p-2 border">{getStatusText(a.status)}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                  onClick={() => handleStatus(a.id, "CONFIRMED")}
                  disabled={actionLoading === a.id + "CONFIRMED"}
                >Onayla</button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                  onClick={() => handleStatus(a.id, "CANCELLED")}
                  disabled={actionLoading === a.id + "CANCELLED"}
                >İptal Et</button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  onClick={() => handleDelete(a.id)}
                  disabled={actionLoading === a.id + "delete"}
                >Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 