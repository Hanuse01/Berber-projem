"use client";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  phone?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          window.location.href = "/auth/login";
        } else {
          res.json().then(user => {
            setUser(user);
            setName(user.name || "");
            setImage(user.image || "");
            setPhone(user.phone || "");
          });
        }
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!phone.trim()) {
      setError("Telefon numarası zorunludur");
      return;
    }
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, image, phone }),
    });
    if (res.ok) {
      setSuccess("Profil güncellendi.");
      setPassword("");
    } else {
      setError("Profil güncellenemedi.");
    }
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setImage(data.url);
    } else {
      setError("Resim yüklenemedi.");
    }
    setUploading(false);
  }

  function handleFileButtonClick() {
    fileInputRef.current?.click();
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 h-[calc(100vh-4rem)] flex items-start justify-center pt-12 overflow-hidden">
      <div className="max-w-md w-full rounded-2xl shadow-xl border border-gray-200 bg-white px-6 py-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-1 text-center">Profilim</h2>
        <div className="text-xs text-gray-500 text-center mb-6">{user.email}</div>
        <form className="flex flex-col gap-5 flex-1" onSubmit={handleUpdate}>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
            placeholder="Ad Soyad" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
            placeholder="Yeni Şifre (isteğe bağlı)" 
          />
          <div className="flex flex-col items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profil Resmi</label>
            {image && (
              <img src={image} alt="Profil" className="w-20 h-20 object-cover rounded-full border mb-1" />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleFileButtonClick}
              className="px-4 py-1 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              disabled={uploading}
            >
              {uploading ? "Yükleniyor..." : "Resim Seç"}
            </button>
          </div>
          <input 
            type="text" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
            placeholder="Telefon" 
            required
          />
          <button 
            type="submit" 
            className="w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Bilgileri Güncelle
          </button>
        </form>
        {success && <div className="mt-4 text-sm text-green-600 text-center">{success}</div>}
        {error && <div className="mt-4 text-sm text-red-600 text-center">{error}</div>}
        <button 
          className="w-full mt-8 rounded-lg bg-gray-100 text-gray-700 py-2 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition" 
          onClick={handleLogout}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
} 