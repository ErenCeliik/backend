"use client";

import { useEffect, useState } from "react";

interface Category {
  id: number;
  kategoriAdi: string;
}

interface Customer {
  id: number;
  musteriAdi: string;
  telefon: string;
  salonAdi: string;
}

interface Product {
  id: number;
  urunAdi: string;
  category: Category;
  toptanFiyat: number;
  perakendeFiyat: number;
  paraBirimi: string;
  stokAdedi: number;
  gorselUrl: string;
  sonKullanmaTarihi: string | null;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("varsayilan"); // Sıralama durumu
  const [loading, setLoading] = useState(true);

  // Modal ve Form State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCustomer, setNewCustomer] = useState({ musteriAdi: "", telefon: "", salonAdi: "" });
  
  const [newProduct, setNewProduct] = useState({
    urunAdi: "", categoryId: "", toptanFiyat: "", perakendeFiyat: "", paraBirimi: "TL", stokAdedi: "", gorselUrl: "", sonKullanmaTarihi: ""
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // 1. JAVA'DAN TÜM VERİLERİ ÇEKME
  const fetchAllData = async () => {
    try {
      const prodRes = await fetch("http://localhost:8080/api/products");
      const prodData = await prodRes.json();
      
      const catRes = await fetch("http://localhost:8080/api/categories");
      const catData = await catRes.json();

      const custRes = await fetch("http://localhost:8080/api/customers");
      const custData = await custRes.json();

      setProducts(prodData);
      setFilteredProducts(prodData);
      setCategories(catData);
      setCustomers(custData);
      
      if (catData.length > 0 && !newProduct.categoryId) {
        setNewProduct(prev => ({ ...prev, categoryId: catData[0].id.toString() }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filtreleme ve Sıralama Motoru (Madde 2)
  useEffect(() => {
    let result = [...products];

    // Kategoriye Göre Süzme
    if (selectedCategory !== "Tümü") {
      result = result.filter(p => p.category?.kategoriAdi === selectedCategory);
    }

    // Akıllı Sıralama Mantığı
    if (sortBy === "isim") {
      result.sort((a, b) => a.urunAdi.localeCompare(b.urunAdi, "tr"));
    } else if (sortBy === "stokAz") {
      result.sort((a, b) => a.stokAdedi - b.stokAdedi);
    } else if (sortBy === "stokCok") {
      result.sort((a, b) => b.stokAdedi - a.stokAdedi);
    } else if (sortBy === "skt") {
      result.sort((a, b) => {
        if (!a.sonKullanmaTarihi) return 1;
        if (!b.sonKullanmaTarihi) return -1;
        return new Date(a.sonKullanmaTarihi).getTime() - new Date(b.sonKullanmaTarihi).getTime();
      });
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortBy, products]);

  // 2. FOTOĞRAF DÖNÜŞTÜRÜCÜ (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: "create" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (mode === "create") setNewProduct({ ...newProduct, gorselUrl: base64String });
      else setEditingProduct({ ...editingProduct, gorselUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  // 3. MÜŞTERİ EKLEME (Madde 1)
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.musteriAdi.trim()) return;
    const res = await fetch("http://localhost:8080/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });
    if (res.ok) {
      alert("Perakende Müşteri Başarıyla Kaydedildi! 👤");
      setNewCustomer({ musteriAdi: "", telefon: "", salonAdi: "" });
      fetchAllData();
    }
  };

  // Kategori Ekleme / Silme
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await fetch("http://localhost:8080/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kategoriAdi: newCategoryName }),
    });
    if (res.ok) { setNewCategoryName(""); fetchAllData(); }
  };

  // Ürün Ekleme (B2B ve C2B Ayrı Fiyatlı)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.categoryId) return alert("Lütfen kategori seçin!");
    const response = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        urunAdi: newProduct.urunAdi,
        toptanFiyat: parseFloat(newProduct.toptanFiyat),
        perakendeFiyat: parseFloat(newProduct.perakendeFiyat),
        paraBirimi: newProduct.paraBirimi,
        stokAdedi: parseInt(newProduct.stokAdedi),
        gorselUrl: newProduct.gorselUrl,
        sonKullanmaTarihi: newProduct.sonKullanmaTarihi || null,
        category: { id: parseInt(newProduct.categoryId) }
      }),
    });
    if (response.ok) {
      setIsModalOpen(false);
      setNewProduct({ urunAdi: "", categoryId: categories[0]?.id.toString() || "", toptanFiyat: "", perakendeFiyat: "", paraBirimi: "TL", stokAdedi: "", gorselUrl: "", sonKullanmaTarihi: "" });
      fetchAllData();
    }
  };

  // Ürün Güncelleme
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8080/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingProduct,
        toptanFiyat: parseFloat(editingProduct.toptanFiyat),
        perakendeFiyat: parseFloat(editingProduct.perakendeFiyat),
        category: { id: parseInt(editingProduct.categoryId) }
      }),
    });
    if (response.ok) { setIsEditModalOpen(false); fetchAllData(); }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Silinsin mi?")) {
      await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" });
      fetchAllData();
    }
  };

  const isExpiredSoon = (dateStr: string | null) => {
    if (!dateStr) return false;
    const farkGun = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return farkGun >= 0 && farkGun <= 30;
  };

  // Analitik Sayaçları Hesaplama (Seçenek C)
  const kritikStokSayisi = products.filter(p => p.stokAdedi <= 10).length;
  const sktYaklasanSayisi = products.filter(p => isExpiredSoon(p.sonKullanmaTarihi)).length;

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white font-mono">⚡ Analitik Motoru Çalıştırılıyor...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      
      {/* 📁 SOL MENÜ: KATEGORİ VE PERAKENDE MÜŞTERİ YÖNETİMİ */}
      <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 p-6 space-y-8 flex-shrink-0">
        {/* Kategori Bölümü */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">📁 Kategori Ekle</h3>
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <input type="text" placeholder="Örn: Ağdalar" required className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-3 rounded-lg text-xs font-bold">+</button>
          </form>
          <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
            {categories.map(c => (
              <div key={c.id} className="p-2 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-400">{c.kategoriAdi}</div>
            ))}
          </div>
        </div>

        {/* Müşteri Bölümü (Madde 1) */}
        <div className="space-y-4 border-t border-slate-800 pt-6">
          <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">👤 Perakende Müşteriler</h3>
          <form onSubmit={handleCreateCustomer} className="space-y-2">
            <input type="text" placeholder="Müşteri Adı Soyadı" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none" value={newCustomer.musteriAdi} onChange={(e) => setNewCustomer({ ...newCustomer, musteriAdi: e.target.value })} />
            <input type="text" placeholder="Telefon No" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none" value={newCustomer.telefon} onChange={(e) => setNewCustomer({ ...newCustomer, telefon: e.target.value })} />
            <input type="text" placeholder="Salon / Dükkan Adı" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none" value={newCustomer.salonAdi} onChange={(e) => setNewCustomer({ ...newCustomer, salonAdi: e.target.value })} />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-1.5 rounded-lg text-xs font-bold">Müşteri Kaydet</button>
          </form>
          <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
            {customers.map(cust => (
              <div key={cust.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                <p className="font-bold text-slate-300">{cust.musteriAdi}</p>
                <p className="text-[10px] text-slate-500 font-mono">{cust.salonAdi} - {cust.telefon || "Tel Yok"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🛡️ SAĞ PANEL: ANA DASHBOARD VE ÜRÜNLER */}
      <div className="flex-1 p-8">
        
        {/* Üst Başlık */}
        <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Vesta Akıllı Yönetim</h1>
            <p className="text-slate-400 text-sm mt-1">Gelişmiş Analitik & Çoklu Para Birimi Paneli</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.open("/b2b", "_blank")} className="bg-slate-900 hover:bg-slate-800 text-blue-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-800">🌐 B2B Gör</button>
            <button onClick={() => window.open("/shop", "_blank")} className="bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-800">🛍️ Shop Gör</button>
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-emerald-500 text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg">+ Yeni Ürün Ekle</button>
          </div>
        </div>

        {/* 📊 SEÇENEK C: AKILLI ANALİTİK KARTLARI PANELİ */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
            <div><p className="text-xs text-slate-400 font-mono">TOPLAM ÇEŞİT</p><p className="text-2xl font-black text-white mt-1">{products.length} Ürün</p></div>
            <div className="text-2xl">📦</div>
          </div>
          <div className={`border rounded-xl p-4 flex justify-between items-center transition-all ${kritikStokSayisi > 0 ? "bg-red-950/20 border-red-500/40" : "bg-slate-900 border-slate-800"}`}>
            <div><p className="text-xs text-slate-400 font-mono">KRİTİK STOKTAKİLER</p><p className={`text-2xl font-black mt-1 ${kritikStokSayisi > 0 ? "text-red-400" : "text-white"}`}>{kritikStokSayisi} Çeşit</p></div>
            <div className="text-2xl">🚨</div>
          </div>
          <div className={`border rounded-xl p-4 flex justify-between items-center transition-all ${sktYaklasanSayisi > 0 ? "bg-amber-950/20 border-amber-500/40" : "bg-slate-900 border-slate-800"}`}>
            <div><p className="text-xs text-slate-400 font-mono">SKT YAKLAŞANLAR</p><p className={`text-2xl font-black mt-1 ${sktYaklasanSayisi > 0 ? "text-amber-400" : "text-white"}`}>{sktYaklasanSayisi} Ürün</p></div>
            <div className="text-2xl">⚠️</div>
          </div>
        </div>

        {/* 🎛️ MADDE 2: AKILLI FILTRE VE SIRALAMA ALANI */}
        <div className="max-w-6xl mx-auto mb-6 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory("Tümü")} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedCategory === "Tümü" ? "bg-emerald-600 text-white" : "bg-slate-950 text-slate-400 hover:text-white"}`}>Tümü</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setSelectedCategory(c.kategoriAdi)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedCategory === c.kategoriAdi ? "bg-emerald-600 text-white" : "bg-slate-950 text-slate-400 hover:text-white"}`}>{c.kategoriAdi}</button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-mono whitespace-nowrap">↕ Sırala:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-950 border border-slate-700 text-xs text-white p-1.5 rounded-lg focus:outline-none w-full sm:w-44">
              <option value="varsayilan">Varsayılan (Eklenme)</option>
              <option value="isim">Ürün Adına Göre (A-Z)</option>
              <option value="stokAz">Stoka Göre (Azalan)</option>
              <option value="stokCok">Stoka Göre (Çoğalan)</option>
              <option value="skt">Son Kullanma Tarihine Göre</option>
            </select>
          </div>
        </div>

        {/* Ürün Listesi */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const sktTehlike = isExpiredSoon(product.sonKullanmaTarihi);
            const stokKritik = product.stokAdedi <= 10;

            return (
              <div key={product.id} className={`rounded-2xl border bg-slate-900 overflow-hidden flex flex-col justify-between shadow-xl ${sktTehlike ? "border-amber-500/50" : stokKritik ? "border-red-500/50" : "border-slate-800"}`}>
                <div className="h-40 w-full bg-slate-950">
                  <img src={product.gorselUrl || "https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=500&q=80"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">{product.category?.kategoriAdi}</span>
                      {stokKritik && <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold animate-pulse">🚨 KRİTİK</span>}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{product.urunAdi}</h3>
                    <p className={`text-xs font-mono mb-1 ${stokKritik ? "text-red-400 font-bold" : "text-slate-500"}`}>Stok: {product.stokAdedi} Adet</p>
                    <p className="text-xs text-slate-500 font-mono mb-3">SKT: {product.sonKullanmaTarihi || "Muaf"}</p>
                    
                    {/* ÇİFT FİYAT EKRANI (Madde 3 & 4) */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60 grid grid-cols-2 gap-2 text-center">
                      <div><p className="text-[10px] text-slate-500 font-mono">PERAKENDE (C2B)</p><p className="text-sm font-bold text-emerald-400">{product.perakendeFiyat} {product.paraBirimi}</p></div>
                      <div className="border-l border-slate-800/80"><p className="text-[10px] text-slate-500 font-mono">TOPTAN (B2B)</p><p className="text-sm font-bold text-blue-400">{product.toptanFiyat} {product.paraBirimi}</p></div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-slate-800/60 mt-4">
                    <button onClick={() => { setEditingProduct({ ...product, categoryId: product.category?.id.toString() }); setIsEditModalOpen(true); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold py-1.5 rounded-lg text-blue-400">✏ Düzenle</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-slate-800 text-xs font-semibold px-2.5 rounded-lg text-red-400">🗑</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🖼️ MODAL 1: YENİ ÜRÜN EKLEME (ÇİFT FİYAT & PARA BİRİMİ SEÇİMİ EKLENDİ) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">Yeni Ürün Ekle</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400">ÜRÜN ADI</label>
                <input type="text" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={newProduct.urunAdi} onChange={(e) => setNewProduct({ ...newProduct, urunAdi: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400">KATEGORİ</label>
                  <select className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-white" value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}>{categories.map(c => <option key={c.id} value={c.id}>{c.kategoriAdi}</option>)}</select>
                </div>
                {/* PARA BİRİMİ SEÇİMİ (Madde 4) */}
                <div>
                  <label className="text-xs font-mono text-slate-400">PARA BİRİMİ</label>
                  <select className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-white" value={newProduct.paraBirimi} onChange={(e) => setNewProduct({ ...newProduct, paraBirimi: e.target.value })}><option value="TL">TL (₺)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select>
                </div>
              </div>
              
              {/* ÇİFT FİYAT INPUT ALANLARI (Madde 3) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400">PERAKENDE FİYAT</label>
                  <input type="number" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={newProduct.perakendeFiyat} onChange={(e) => setNewProduct({ ...newProduct, perakendeFiyat: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400">TOPTAN FİYAT (B2B)</label>
                  <input type="number" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={newProduct.toptanFiyat} onChange={(e) => setNewProduct({ ...newProduct, toptanFiyat: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400">STOK ADEDİ</label>
                  <input type="number" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={newProduct.stokAdedi} onChange={(e) => setNewProduct({ ...newProduct, stokAdedi: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400">SKT (İsteğe Bağlı)</label>
                  <input type="date" className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-white" value={newProduct.sonKullanmaTarihi} onChange={(e) => setNewProduct({ ...newProduct, sonKullanmaTarihi: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">📷 FOTOĞRAF YÜKLE</label>
                <input type="file" accept="image/*" required className="w-full mt-1 text-xs text-slate-400" onChange={(e) => handleImageUpload(e, "create")} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 rounded-xl py-2 text-sm">İptal</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl py-2 font-bold text-white">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ÜRÜN DÜZENLEME */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-blue-400">Ürünü Düzenle</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400">ÜRÜN ADI</label>
                <input type="text" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={editingProduct.urunAdi} onChange={(e) => setEditingProduct({ ...editingProduct, urunAdi: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-mono text-slate-400">PERAKENDE FİYAT</label><input type="number" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={editingProduct.perakendeFiyat} onChange={(e) => setEditingProduct({ ...editingProduct, perakendeFiyat: e.target.value })} /></div>
                <div><label className="text-xs font-mono text-slate-400">TOPTAN FİYAT</label><input type="number" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={editingProduct.toptanFiyat} onChange={(e) => setEditingProduct({ ...editingProduct, toptanFiyat: e.target.value })} /></div>
              </div>
              <div><label className="text-xs font-mono text-slate-400">STOK DURUMU</label><input type="number" required className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm" value={editingProduct.stokAdedi} onChange={(e) => setEditingProduct({ ...editingProduct, stokAdedi: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-slate-800 rounded-xl py-2 text-sm">Vazgeç</button>
                <button type="submit" className="flex-1 bg-blue-600 rounded-xl py-2 font-bold text-white">Değişiklikleri Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}