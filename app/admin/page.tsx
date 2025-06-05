'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  role: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı bilgilerini ve rolünü kontrol et
    fetch('/api/me')
      .then(res => {
        if (!res.ok) {
          router.push('/auth/login');
          return;
        }
        return res.json();
      })
      .then((user: User) => {
        if (user && user.role !== 'ADMIN') {
          router.push('/'); // Admin değilse ana sayfaya yönlendir
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/auth/login');
      });
  }, [router]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Paneli</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/admin/users"
          className="bg-blue-100 p-6 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Kullanıcı Yönetimi</h3>
          <p className="text-gray-600">Kullanıcıları görüntüle, düzenle ve yönet</p>
        </a>
        <a
          href="/admin/appointments"
          className="bg-green-100 p-6 rounded-lg hover:bg-green-200 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Randevu Yönetimi</h3>
          <p className="text-gray-600">Randevuları görüntüle ve yönet</p>
        </a>
        <a
          href="/admin/services"
          className="bg-purple-100 p-6 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Hizmet Yönetimi</h3>
          <p className="text-gray-600">Hizmetleri düzenle ve yönet</p>
        </a>
        <a
          href="/admin/barbers"
          className="bg-yellow-100 p-6 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Berber Yönetimi</h3>
          <p className="text-gray-600">Berberleri düzenle ve yönet</p>
        </a>
      </div>
    </div>
  );
} 