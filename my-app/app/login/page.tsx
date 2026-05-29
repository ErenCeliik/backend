"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Müşteriye WhatsApp'tan vereceğimiz demo şifresi: vesta123
    if (password === "vesta123") {
      // Şifre doğruysa müşteriyi Admin Paneline yönlendiriyoruz
      window.location.href = "/admin";
    } else {
      setError("Hatalı şifre girdiniz. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Vesta Teknoloji
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            E-Ticaret Yönetim Paneli Demosu
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm">
            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono">DEMO GİRİŞ ŞİFRESİ</label>
              <input
                type="password"
                required
                className="relative block w-full mt-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 font-mono text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              ❌ {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 py-3 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Sisteme Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}