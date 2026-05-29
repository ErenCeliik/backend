package com.vesta.backend.repository;

import com.vesta.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Spring'e bunun otomatik veritabanı sorguları üreten merkez olduğunu söylüyoruz
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Sadece bu kadarcık hacı! JpaRepository sayesinde insert, update, delete, findAll gibi
    // yüzlerce hazır metot arka planda otomatik olarak Java tarafından yaratılacak.
}