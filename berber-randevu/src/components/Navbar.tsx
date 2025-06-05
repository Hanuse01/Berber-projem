"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(true);
        setIsAdmin(data.role === "ADMIN");
        setUserImage(data.image || null);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserImage(null);
      });
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className={`text-lg font-semibold ${isActive("/") ? "text-indigo-700" : "text-gray-700 hover:text-indigo-900"} transition`}>
              Anasayfa
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/appointments"
                  className={`text-lg font-medium ${isActive("/appointments") ? "text-indigo-600 font-bold" : "text-gray-700 hover:text-indigo-500"} transition`}
                >
                  Randevular
                </Link>
                <Link
                  href="/messages"
                  className={`text-lg font-medium ${isActive("/messages") ? "text-indigo-600 font-bold" : "text-gray-700 hover:text-indigo-500"} transition`}
                >
                  Mesajlar
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`text-lg font-medium ${isActive("/admin") ? "text-indigo-600 font-bold" : "text-gray-700 hover:text-indigo-500"} transition`}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Profil</span>
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Profil"
                    className="h-8 w-8 rounded-full object-cover border"
                  />
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                )}
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 