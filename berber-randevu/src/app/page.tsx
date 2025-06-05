"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const mouseEndX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Otomatik geçiş efekti
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev < 3 ? prev + 1 : 0));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // currentSlide değişince ilgili resmi scrollIntoView ile ortaya getir
  useEffect(() => {
    if (sliderRef.current) {
      const child = sliderRef.current.children[currentSlide] as HTMLElement;
      if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [currentSlide]);

  useEffect(() => {
    document.body.style.overflowY = 'scroll';
  }, []);

  return (
    <>
      <style jsx global>{`
        html {
          scrollbar-width: thin;
          scrollbar-color: #b0b0b0 #f1f1f1;
        }
        ::-webkit-scrollbar {
          width: 8px;
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #b0b0b0;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
        ::-webkit-scrollbar:horizontal { display: none !important; height: 0 !important; }
        .hide-horizontal-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-horizontal-scrollbar::-webkit-scrollbar { display: none !important; height: 0 !important; }
      `}</style>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center border border-indigo-100 mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">Kuaför By Kerim</h1>
          <p className="text-lg text-gray-700 mb-2">
            Modern ve profesyonel saç kesimi, sakal tıraşı ve kişisel bakım hizmetleriyle sizlerleyiz. Randevu sistemimiz sayesinde beklemeden, hızlı ve kolayca hizmet alabilirsiniz. 
          </p>
          <p className="text-md text-gray-500">
            Hijyen, kalite ve müşteri memnuniyeti önceliğimizdir. Kendinize zaman ayırın, stilinizi bize bırakın!
          </p>
        </div>
        {/* Galeri Bölümü */}
        <div className="relative w-full max-w-5xl overflow-hidden mb-12">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={(e: React.TouchEvent) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchMove={(e: React.TouchEvent) => {
              touchEndX.current = e.touches[0].clientX;
            }}
            onTouchEnd={() => {
              if (touchStartX.current !== null && touchEndX.current !== null) {
                const diff = touchStartX.current - touchEndX.current;
                if (Math.abs(diff) > 50) {
                  if (diff > 0) {
                    setCurrentSlide((prev) => (prev < 3 ? prev + 1 : 0));
                  } else {
                    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 3));
                  }
                }
              }
              touchStartX.current = null;
              touchEndX.current = null;
            }}
            onMouseDown={(e) => {
              isDragging.current = true;
              mouseStartX.current = e.clientX;
            }}
            onMouseMove={(e) => {
              if (isDragging.current) {
                mouseEndX.current = e.clientX;
              }
            }}
            onMouseUp={() => {
              if (isDragging.current && mouseStartX.current !== null && mouseEndX.current !== null) {
                const diff = mouseStartX.current - mouseEndX.current;
                if (Math.abs(diff) > 50) {
                  if (diff > 0) {
                    setCurrentSlide((prev) => (prev < 3 ? prev + 1 : 0));
                  } else {
                    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 3));
                  }
                }
              }
              isDragging.current = false;
              mouseStartX.current = null;
              mouseEndX.current = null;
            }}
            onMouseLeave={() => {
              isDragging.current = false;
              mouseStartX.current = null;
              mouseEndX.current = null;
            }}
          >
            {[1,2,3,4].map(i => (
              <div key={i} className="min-w-full flex justify-center items-center bg-white">
                <Image
                  src={`/resim${i}.jpg`}
                  alt={`Kuaför By Kerim Galeri ${i}`}
                  width={900}
                  height={700}
                  className="object-contain w-full h-[32rem]"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Harita Bölümü */}
        <div className="w-full flex flex-col items-center mb-10">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Bizi Burada Bulabilirsiniz</h2>
          <p className="text-gray-600 mb-4 text-center">Anadolu mahallesi Tunçalp Sokak no:2/C Arnavutköy/İstanbul</p>
          <button
            onClick={() => setShowDirectionsModal(true)}
            className="flex flex-col items-center mb-4 focus:outline-none group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#3b82f6" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.78-.3-7.93-2.44C3.3 17.78 2.52 14.83 3 12c.48-2.83 2.44-5.78 4.57-7.93C8.22 3.3 11.17 2.52 14 3c2.83.48 5.78 2.44 7.93 4.57C20.7 8.22 21.48 11.17 21 14c-.48 2.83-2.44 5.78-4.57 7.93C15.78 20.7 12.83 21.48 10 21z"/>
              <path d="M12 8v4l3 3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="text-blue-600 text-lg font-semibold group-hover:underline">Yol Tarifi</span>
          </button>
          {/* Modal */}
          {showDirectionsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center min-w-[300px] relative">
                <button
                  onClick={() => setShowDirectionsModal(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  aria-label="Kapat"
                >
                  ×
                </button>
                <h3 className="text-xl font-bold mb-4 text-indigo-700">Yol Tarifi Al</h3>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Anadolu+mahallesi+Tunçalp+Sokak+no+2+C+Arnavutköy+İstanbul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 mb-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition w-full text-center"
                >
                  Google Haritalar ile Yol Tarifi
                </a>
                <a
                  href="https://maps.apple.com/?daddr=Anadolu+mahallesi+Tunçalp+Sokak+no+2+C+Arnavutköy+İstanbul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition w-full text-center"
                >
                  Apple Haritalar ile Yol Tarifi
                </a>
              </div>
            </div>
          )}
          <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg border border-indigo-100">
            <iframe
              title="Kuaför By Kerim Konum"
              src="https://www.google.com/maps?q=Anadolu+mahallesi+Tunçalp+Sokak+no+2+C+Arnavutköy+İstanbul&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        {/* Sosyal Medya Linkleri */}
        <footer className="w-full flex flex-col items-center py-6 mt-8 border-t border-indigo-100 bg-white/70">
          <div className="flex gap-6 mb-2">
            <a href="https://www.instagram.com/kerim.celikkiran?igsh=MW51cmJib3VpdzFiMQ==" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <linearGradient id="IGpaint0_linear" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f58529"/>
                  <stop offset="0.5" stopColor="#dd2a7b"/>
                  <stop offset="1" stopColor="#515bd4"/>
                </linearGradient>
                <rect width="24" height="24" rx="6" fill="url(#IGpaint0_linear)"/>
                <path d="M16.75 7.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 9.25A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25ZM12 13.5A1.5 1.5 0 1 1 12 10.5a1.5 1.5 0 0 1 0 3ZM17.5 8.75c0-1.24-1.01-2.25-2.25-2.25h-6.5A2.25 2.25 0 0 0 6.5 8.75v6.5A2.25 2.25 0 0 0 8.75 17.5h6.5a2.25 2.25 0 0 0 2.25-2.25v-6.5ZM8.75 8h6.5c.41 0 .75.34.75.75v6.5c0 .41-.34.75-.75.75h-6.5a.75.75 0 0 1-.75-.75v-6.5c0-.41.34-.75.75-.75Z" fill="#fff"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/19RVrecjgi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <svg role="img" width="32" height="32" viewBox="0 0 24 24" fill="#1877F3" xmlns="http://www.w3.org/2000/svg">
                <title>Facebook</title>
                <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 6.084 4.563 11.092 10.438 11.854v-8.385H7.078v-3.47h3.36V9.797c0-3.324 1.986-5.165 5.032-5.165 1.455 0 2.973.262 2.973.262v3.28h-1.676c-1.653 0-2.168 1.025-2.168 2.074v2.489h3.684l-.589 3.47h-3.095v8.385C19.437 23.092 24 18.084 24 12"/>
              </svg>
            </a>
          </div>
          <span className="text-gray-400 text-sm">© {new Date().getFullYear()} Kuaför By Kerim</span>
        </footer>
      </div>
    </>
  );
}
