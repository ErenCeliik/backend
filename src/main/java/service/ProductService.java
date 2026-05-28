package com.vesta.backend.service;

import com.vesta.backend.model.Product;
import com.vesta.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // TÜM ALANLARI GÜNCELLEYEN METOT (Müşterinin elle müdahalesi için)
    public Product updateProduct(Long id, Product details) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

        product.setUrunAdi(details.getUrunAdi());
        product.setKategori(details.getKategori());
        product.setFiyat(details.getFiyat());
        product.setStokAdedi(details.getStokAdedi());
        product.setGorselUrl(details.getGorselUrl());
        product.setSonKullanmaTarihi(details.getSonKullanmaTarihi()); // İster tarih gelir, ister null kalır

        // Eğer fiyat el ile güncellendiyse eski indirimli fiyatı sıfırlıyoruz ki kafa karışmasın
        product.setIndirimliFiyat(null);

        return productRepository.save(product);
    }

    // ÜRÜN SİLME METODU
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));
        productRepository.delete(product);
    }

    public Product applyCustomDiscount(Long id, int discountRate) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

        BigDecimal originalPrice = product.getFiyat();
        BigDecimal discountPercentage = BigDecimal.valueOf(100 - discountRate);
        BigDecimal newPrice = originalPrice.multiply(discountPercentage).divide(BigDecimal.valueOf(100));

        product.setIndirimliFiyat(newPrice);
        return productRepository.save(product);
    }
}