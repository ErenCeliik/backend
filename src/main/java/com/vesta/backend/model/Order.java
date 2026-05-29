package com.vesta.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "urun_adi", nullable = false)
    private String urunAdi;

    private int adet;

    @Column(name = "toplam_tutar")
    private double toplamTutar;

    @Column(name = "para_birimi")
    private String paraBirimi;

    @Column(name = "siparis_turu")
    private String siparisTuru; // "B2B (Toptan)" veya "C2B (Perakende)"

    @Column(name = "siparis_tarihi")
    private LocalDateTime siparisTarihi;

    public Order() {}

    public Order(String urunAdi, int adet, double toplamTutar, String paraBirimi, String siparisTuru, LocalDateTime siparisTarihi) {
        this.urunAdi = urunAdi;
        this.adet = adet;
        this.toplamTutar = toplamTutar;
        this.paraBirimi = paraBirimi;
        this.siparisTuru = siparisTuru;
        this.siparisTarihi = siparisTarihi;
    }

    // GETTER - SETTER METOTLARI
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrunAdi() { return urunAdi; }
    public void setUrunAdi(String urunAdi) { this.urunAdi = urunAdi; }

    public int getAdet() { return adet; }
    public void setAdet(int adet) { this.adet = adet; }

    public double getToplamTutar() { return toplamTutar; }
    public void setToplamTutar(double toplamTutar) { this.toplamTutar = toplamTutar; }

    public String getParaBirimi() { return paraBirimi; }
    public void setParaBirimi(String paraBirimi) { this.paraBirimi = paraBirimi; }

    public String getSiparisTuru() { return siparisTuru; }
    public void setSiparisTuru(String siparisTuru) { this.siparisTuru = siparisTuru; }

    public LocalDateTime getSiparisTarihi() { return siparisTarihi; }
    public void setSiparisTarihi(LocalDateTime siparisTarihi) { this.siparisTarihi = siparisTarihi; }
}