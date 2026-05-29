"use client";

import { useEffect, useState } from "react";

interface Category { id: number; kategoriAdi: string; }
interface Product { id: number; urunAdi: string; category: Category; toptanFiyat: number; paraBirimi: string; stokAdedi: number; gorselUrl: string; }

export default function B2BDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/products").then(res => res.json()).then(data => { setProducts(data); setLoading(false); });
  }, []);

  const handleQuantityChange = (id: number, val: number) => {
    if (val < 0) return;
    setCart({ ...cart, [id]: val });
  };

  const calculateTotal = () => {
    return products.reduce((acc, p) => acc + (cart[p.id] || 0) * p.toptanFiyat, 0);
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono">B2B Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div><span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">B2B BAYİ PORTALI</span><h1 className="text-3xl font-extrabold text-white mt-2">Vesta Toptan Sipariş</h1></div>
        <div className="text-right bg-slate-950 p-4 rounded-xl border border-slate-800"><p className="text-xs text-slate-400 font-mono">TOPLAM BAYİ SİPARİŞİ</p><p className="text-2xl font-black text-blue-400">{calculateTotal().toLocaleString("tr-TR")} Müşteri Birimi</p></div>
      </div>
      <div className="max-w-6xl mx-auto space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <img src={product.gorselUrl} alt="" className="w-14 h-14 object-cover rounded-lg" />
              <div><h3 className="font-bold text-white">{product.urunAdi}</h3><p className="text-xs text-slate-500 font-mono">{product.category?.kategoriAdi}</p></div>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-mono">BAYİ TOPTAN FİYATI</p>
              <p className="text-base font-black text-emerald-400">{product.toptanFiyat} {product.paraBirimi}</p>
            </div>
            <div className="flex items-center gap-3"><span className="text-xs text-slate-400">Adet:</span><input type="number" min="0" className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-sm font-bold" value={cart[product.id] || ""} onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}