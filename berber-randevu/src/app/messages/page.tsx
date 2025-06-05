"use client";
import React, { useEffect, useState, useRef } from "react";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: { id: string; name: string };
  receiver: { id: string; name: string };
}

export default function MessagesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((me) => {
        setCurrentUserId(me.id);
        fetch("/api/users", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            const filtered = data.filter((u: User) => u.id !== me.id);
            setUsers(filtered);
            if (filtered.length > 0) {
              setSelectedUser(filtered[0]);
            }
            setLoading(false);
          })
          .catch(() => {
            setError("Kullanıcılar yüklenemedi");
            setLoading(false);
          });
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetch("/api/messages", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          const filteredMessages = data.filter(
            (m: Message) =>
              (m.senderId === selectedUser.id || m.receiverId === selectedUser.id)
          );
          setMessages(filteredMessages);
        });
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: selectedUser.id,
        content: newMessage,
      }),
      credentials: "include",
    });

    if (res.ok) {
      const message = await res.json();
      setMessages([...messages, message]);
      setNewMessage("");
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-[calc(100vh-4rem)] flex items-start justify-center pt-8 overflow-hidden">
      <div className="max-w-3xl w-full h-[550px] rounded-xl shadow-lg border bg-white flex">
        {/* Kullanıcı Listesi */}
        <div className="w-1/3 min-w-[110px] max-w-[200px] border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900">Mesajlar</h2>
          </div>
          <div className="overflow-y-auto max-h-full">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                  selectedUser?.id === user.id ? "bg-indigo-50" : ""
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-8 w-8 object-cover rounded-full" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-indigo-600 text-base">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mesajlaşma Alanı */}
        <div className="flex w-2/3 flex-col min-w-0 overflow-x-hidden">
          {selectedUser ? (
            <>
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 overflow-hidden">
                    {selectedUser.image ? (
                      <img src={selectedUser.image} alt={selectedUser.name} className="h-8 w-8 object-cover rounded-full" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-indigo-600 text-base">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {selectedUser.name}
                  </h3>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 min-h-0 max-h-full">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === selectedUser.id
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] break-words rounded-2xl px-4 py-2 ${
                          message.senderId === selectedUser.id
                            ? "bg-white text-gray-900"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        <p className="text-sm break-words m-0">{message.content}</p>
                        <p
                          className={`mt-1 text-xs ${
                            message.senderId === selectedUser.id
                              ? "text-gray-500"
                              : "text-indigo-100"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <form
                onSubmit={handleSend}
                className="border-t border-gray-200 bg-white p-4"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-50">
              <div className="text-center">
                <svg
                  className="mx-auto h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Mesajlaşmak için bir kullanıcı seçin
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 