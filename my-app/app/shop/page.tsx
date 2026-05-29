"use client";

import { useEffect, useState } from "react";

interface Category { id: number; kategoriAdi: string; }
interface Product { id: number; urunAdi: string; category: Category; perakendeFiyat: number; paraBirimi: string; gorselUrl: string; }

export default function C2BShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/products").then(res => res.json()).then(data => { setProducts(data); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">Vitrin Hazırlanıyor...</div>;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center"><h1 className="text-xl font-black">VESTA <span className="text-emerald-600">BOUTIQUE</span></h1><div className="text-sm font-medium text-neutral-500">🛒 Sepetim (0)</div></div>
      </div>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-52 w-full"><img src={product.gorselUrl} alt="" className="w-full h-full object-cover" /></div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div><p className="text-[10px] font-bold text-neutral-400 uppercase">{product.category?.kategoriAdi}</p><h3 className="font-bold text-neutral-800 text-sm mt-0.5">{product.urunAdi}</h3></div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100"><p className="text-base font-black text-neutral-900">{product.perakendeFiyat} {product.paraBirimi}</p><button className="bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl">Ekle</button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}