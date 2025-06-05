"use client";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          window.location.href = "/auth/login";
        } else {
          res.json().then(user => {
            setCurrentUserId(user.id);
          });
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Kullanıcılar yüklenemedi");
        setLoading(false);
      });
  }, [actionLoading]);

  async function handleDelete(id: string) {
    if (!window.confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return;
    setActionLoading(id);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setActionLoading("");
  }

  async function handleRoleChange(id: string, newRole: string) {
    setActionLoading(id + newRole);
    await fetch(`/api/admin/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setActionLoading("");
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Kullanıcı Yönetimi</h2>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Ad Soyad</th>
            <th className="p-2 border">E-posta</th>
            <th className="p-2 border">Telefon</th>
            <th className="p-2 border">Rol</th>
            <th className="p-2 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.phone || '-'}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border flex gap-2 justify-center">
                {user.id !== currentUserId && (
                  <>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      onClick={() => handleDelete(user.id)}
                      disabled={actionLoading === user.id}
                    >
                      Sil
                    </button>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={actionLoading === user.id + user.role}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </>
                )}
                {user.id === currentUserId && <span className="text-gray-400 text-xs">(Kendi hesabın)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 