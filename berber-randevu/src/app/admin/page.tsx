import React from "react";

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Paneli</h2>
      <div className="flex flex-col gap-4">
        <a href="/admin/users" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Kullanıcı Yönetimi</a>
        <a href="/admin/appointments" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Randevu Yönetimi</a>
        <a href="/admin/services" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Hizmet Yönetimi</a>
      </div>
    </div>
  );
} 