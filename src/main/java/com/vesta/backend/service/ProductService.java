package com.vesta.backend.service;

import com.vesta.backend.model.Category;
import com.vesta.backend.model.Product;
import com.vesta.backend.repository.CategoryRepository;
import com.vesta.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> getAllProducts() { return productRepository.findAll(); }
    public Product addProduct(Product product) { return productRepository.save(product); }

    public Product updateProduct(Long id, Product details) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));
        product.setUrunAdi(details.getUrunAdi());
        product.setCategory(details.getCategory());
        product.setToptanFiyat(details.getToptanFiyat());
        product.setPerakendeFiyat(details.getPerakendeFiyat());
        product.setParaBirimi(details.getParaBirimi());
        product.setStokAdedi(details.getStokAdedi());
        product.setGorselUrl(details.getGorselUrl());
        product.setSonKullanmaTarihi(details.getSonKullanmaTarihi());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) { productRepository.deleteById(id); }
    public List<Category> getAllCategories() { return categoryRepository.findAll(); }
    public Category addCategory(Category category) { return categoryRepository.save(category); }
    public void deleteCategory(Long id) { categoryRepository.deleteById(id); }
}