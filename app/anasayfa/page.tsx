'use client';
import React from 'react';

export default function Anasayfa() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Berber Randevu Sistemi
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Berber Kartları */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Berberlerimiz</h2>
          <p className="text-gray-600">
            Profesyonel ekibimizle hizmetinizdeyiz.
          </p>
          <a
            href="/berberler"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Berberleri Gör
          </a>
        </div>

        {/* Hizmetler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Hizmetlerimiz</h2>
          <p className="text-gray-600">
            Kaliteli ve uygun fiyatlı hizmetlerimiz.
          </p>
          <a
            href="/hizmetler"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Hizmetleri Gör
          </a>
        </div>

        {/* Randevu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Randevu Al</h2>
          <p className="text-gray-600">
            Hızlı ve kolay randevu sistemi.
          </p>
          <a
            href="/randevular"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Randevu Al
          </a>
        </div>
      </div>
    </div>
  );
} 