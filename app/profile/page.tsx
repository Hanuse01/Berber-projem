'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (!res.ok) {
          router.push('/auth/login');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setUser(data);
          setPhone(data.phone || '');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Kullanıcı bilgileri yüklenemedi');
        setLoading(false);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        setSuccess('Telefon numaranız güncellendi');
        setUser(prev => prev ? { ...prev, phone } : null);
      } else {
        const data = await res.json();
        setError(data.error || 'Güncelleme başarısız');
      }
    } catch {
      setError('Güncelleme başarısız');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Profil Bilgileri</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">Ad Soyad: {user?.name}</p>
        <p className="text-gray-600">E-posta: {user?.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon Numarası
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="5XX XXX XX XX"
            required
          />
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
} 