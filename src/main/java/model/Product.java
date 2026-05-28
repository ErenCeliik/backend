package com.vesta.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity // 1. Spring'e bu sınıfın PostgreSQL'de bir tablo olduğunu söylüyoruz
@Table(name = "products") // 2. Veri tabanındaki tablonun adı "products" olacak
public class Product {

    @Id // 3. Benzersiz ID alanı (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 4. ID'leri PostgreSQL otomatik 1, 2, 3 diye artıracak
    private Long id;

    @Column(name = "urun_adi", nullable = false) // Veri tabanında sütun adı urun_adi olacak ve boş geçilemeyecek
    private String urunAdi;

    private String kategori;

    private BigDecimal fiyat;

    @Column(name = "indirimli_fiyat")
    private BigDecimal indirimliFiyat;

    @Column(name = "stok_adedi")
    private int stokAdedi;

    @Column(name = "gorsel_url")
    private String gorselUrl;

    @Column(name = "son_kullanma_tarihi")
    private LocalDate sonKullanmaTarihi;

    // BOŞ CONSTRUCTOR: JPA'nın veri tabanından verileri çekerken kullanması için şarttır hacı
    public Product() {
    }

    // GETTER VE SETTER METOTLARI (Aynen duruyor)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrunAdi() { return urunAdi; }
    public void setUrunAdi(String urunAdi) { this.urunAdi = urunAdi; }

    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }

    public BigDecimal getFiyat() { return fiyat; }
    public void setFiyat(BigDecimal fiyat) { this.fiyat = fiyat; }

    public BigDecimal getIndirimliFiyat() { return indirimliFiyat; }
    public void setIndirimliFiyat(BigDecimal indirimliFiyat) { this.indirimliFiyat = indirimliFiyat; }

    public int getStokAdedi() { return stokAdedi; }
    public void setStokAdedi(int stokAdedi) { this.stokAdedi = stokAdedi; }

    public String getGorselUrl() { return gorselUrl; }
    public void setGorselUrl(String gorselUrl) { this.gorselUrl = gorselUrl; }

    public LocalDate getSonKullanmaTarihi() { return sonKullanmaTarihi; }
    public void setSonKullanmaTarihi(LocalDate sonKullanmaTarihi) { this.sonKullanmaTarihi = sonKullanmaTarihi; }
}