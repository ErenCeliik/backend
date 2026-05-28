package com.vesta.backend.controller;

import com.vesta.backend.model.Product;
import com.vesta.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        if (product.getGorselUrl() == null || product.getGorselUrl().isEmpty()) {
            product.setGorselUrl("https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=500&q=80");
        }
        return productService.addProduct(product);
    }

    // 1. YENİ KAPORTA: Ürün Güncelleme Kapısı (Fiyat, Stok, SKT vs. değiştirmek için)
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }

    // 2. YENİ KAPORTA: Ürün Silme Kapısı
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/discount")
    public Product applyDiscount(@PathVariable Long id, @RequestParam int rate) {
        return productService.applyCustomDiscount(id, rate);
    }
}