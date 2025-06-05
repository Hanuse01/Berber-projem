"use client";
import React, { useEffect, useState } from "react";
import { addDays, format } from "date-fns";

interface Appointment {
  id: string;
  service: { name: string };
  date: string;
  status: string;
}
interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedTime, setSelectedTime] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);

  // Saat aralıkları (yarım saatlik)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
  ];

  // Bugünden itibaren 7 gün
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          window.location.href = "/auth/login";
        }
      });
  }, []);

  function reload() {
    setLoading(true);
    Promise.all([
      fetch("/api/appointments/all").then((res) => res.json()),
      fetch("/api/services").then((res) => res.json()),
      fetch("/api/appointments").then((res) => res.json()),
    ])
      .then(([allApps, servs, myApps]) => {
        setAppointments(allApps);
        setServices(servs);
        setMyAppointments(myApps);
        setLoading(false);
      })
      .catch(() => {
        setError("Veriler yüklenemedi");
        setLoading(false);
      });
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line
  }, [actionLoading]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setActionLoading("add");
    // Tarih ve saat birleştir
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}T${selectedTime}`;
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, date: dateStr }),
    });
    if (res.ok) {
      setSuccess("Randevu oluşturuldu.");
    } else {
      setError("Randevu oluşturulamadı.");
    }
    setServiceId(""); setSelectedDay(1); setSelectedMonth(1); setSelectedYear(2025); setSelectedTime("");
    setActionLoading("");
  }

  async function handleCancel(id: string) {
    if (!window.confirm("Randevuyu iptal etmek istediğinize emin misiniz?")) return;
    setSuccess("");
    setActionLoading(id);
    const res = await fetch(`/api/appointments/${id}/cancel`, { method: "PUT" });
    if (res.ok) {
      setSuccess("Randevu iptal edildi.");
    } else {
      setError("Randevu iptal edilemedi.");
    }
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
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Randevularım</h2>
      <form className="flex flex-wrap gap-4 items-end justify-center mb-6" onSubmit={handleAdd}>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Hizmet</label>
          <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="border p-2 rounded min-w-[120px]" required>
            <option value="">Hizmet Seçin</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price}₺)</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Gün</label>
          <select value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))} className="border p-2 rounded min-w-[60px]" required>
            {[...Array(31)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Ay</label>
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="border p-2 rounded min-w-[60px]" required>
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Yıl</label>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="border p-2 rounded min-w-[80px]" required>
            {[2025,2026,2027,2028,2029,2030].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Saat</label>
          <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="border p-2 rounded min-w-[70px]" required>
            <option value="" disabled>Saat</option>
            {timeSlots.map((t) => {
              const isDisabled = appointments.some(a => {
                const d = new Date(a.date);
                return (
                  a.status === "CONFIRMED" &&
                  d.getFullYear() === selectedYear &&
                  d.getMonth() + 1 === selectedMonth &&
                  d.getDate() === selectedDay &&
                  format(d, "HH:mm") === t
                );
              });
              return (
                <option key={t} value={t} disabled={isDisabled}>
                  {t}{isDisabled ? " (Dolu)" : ""}
                </option>
              );
            })}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">
          Randevu Al
        </button>
      </form>
      {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
      {success && <div className="text-green-600 mb-2 text-center">{success}</div>}
      {loading && <div>Yükleniyor...</div>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Hizmet</th>
            <th className="p-2 border">Tarih</th>
            <th className="p-2 border">Durum</th>
            <th className="p-2 border">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td className="p-2 border">{a.service.name}</td>
              <td className="p-2 border">{new Date(a.date).toLocaleString()}</td>
              <td className="p-2 border">{getStatusText(a.status)}</td>
              <td className="p-2 border text-center">
                {a.status === "PENDING" || a.status === "CONFIRMED" ? (
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600" onClick={() => handleCancel(a.id)} disabled={actionLoading === a.id}>İptal Et</button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 