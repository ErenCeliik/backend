package com.vesta.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "urun_adi", nullable = false)
    private String urunAdi;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "toptan_fiyat")
    private BigDecimal toptanFiyat;

    @Column(name = "perakende_fiyat")
    private BigDecimal perakendeFiyat;

    @Column(name = "para_birimi")
    private String paraBirimi; // "TL", "USD", "EUR" buraya yazılacak

    @Column(name = "stok_adedi")
    private int stokAdedi;

    @Lob
    @Column(name = "gorsel_url", columnDefinition = "TEXT")
    private String gorselUrl;

    @Column(name = "son_kullanma_tarihi")
    private LocalDate sonKullanmaTarihi;

    public Product() {}

    // GETTER - SETTER METOTLARI
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrunAdi() { return urunAdi; }
    public void setUrunAdi(String urunAdi) { this.urunAdi = urunAdi; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public BigDecimal getToptanFiyat() { return toptanFiyat; }
    public void setToptanFiyat(BigDecimal toptanFiyat) { this.toptanFiyat = toptanFiyat; }

    public BigDecimal getPerakendeFiyat() { return perakendeFiyat; }
    public void setPerakendeFiyat(BigDecimal perakendeFiyat) { this.perakendeFiyat = perakendeFiyat; }

    public String getParaBirimi() { return paraBirimi; }
    public void setParaBirimi(String paraBirimi) { this.paraBirimi = paraBirimi; }

    public int getStokAdedi() { return stokAdedi; }
    public void setStokAdedi(int stokAdedi) { this.stokAdedi = stokAdedi; }

    public String getGorselUrl() { return gorselUrl; }
    public void setGorselUrl(String gorselUrl) { this.gorselUrl = gorselUrl; }

    public LocalDate getSonKullanmaTarihi() { return sonKullanmaTarihi; }
    public void setSonKullanmaTarihi(LocalDate sonKullanmaTarihi) { this.sonKullanmaTarihi = sonKullanmaTarihi; }
}