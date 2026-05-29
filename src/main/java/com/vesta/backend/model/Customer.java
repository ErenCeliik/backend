package com.vesta.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "musteri_adi", nullable = false)
    private String musteriAdi;

    private String telefon;

    @Column(name = "salon_adi")
    private String salonAdi;

    public Customer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMusteriAdi() { return musteriAdi; }
    public void setMusteriAdi(String musteriAdi) { this.musteriAdi = musteriAdi; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getSalonAdi() { return salonAdi; }
    public void setSalonAdi(String salonAdi) { this.salonAdi = salonAdi; }
}