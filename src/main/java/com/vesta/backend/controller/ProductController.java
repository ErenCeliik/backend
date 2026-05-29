package com.vesta.backend.controller;

import com.vesta.backend.model.Category;
import com.vesta.backend.model.Product;
import com.vesta.backend.model.Customer;
import com.vesta.backend.model.Order;
import com.vesta.backend.repository.CustomerRepository;
import com.vesta.backend.repository.OrderRepository;
import com.vesta.backend.service.ProductService;
import com.vesta.backend.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ExcelService excelService;

    public ProductController(ProductService productService, CustomerRepository customerRepository,
                             OrderRepository orderRepository, ExcelService excelService) {
        this.productService = productService;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.excelService = excelService;
    }

    // --- ÜRÜN KAPILARI ---
    @GetMapping("/products")
    public List<Product> getAllProducts() { return productService.getAllProducts(); }

    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product) { return productService.addProduct(product); }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    // --- KATEGORİ KAPILARI ---
    @GetMapping("/categories")
    public List<Category> getAllCategories() { return productService.getAllCategories(); }

    @PostMapping("/categories")
    public Category createCategory(@RequestBody Category category) { return productService.addCategory(category); }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        productService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }

    // --- MÜŞTERİ KAPILARI ---
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() { return customerRepository.findAll(); }

    @PostMapping("/customers")
    public Customer createCustomer(@RequestBody Customer customer) { return customerRepository.save(customer); }

    // --- 🛒 SIPARIS KAPILARI (YENİ) ---
    @GetMapping("/orders")
    public List<Order> getAllOrders() { return orderRepository.findAll(); }

    @PostMapping("/orders")
    public ResponseEntity<Void> createOrders(@RequestBody List<Order> newOrders) {
        for (Order order : newOrders) {
            order.setSiparisTarihi(LocalDateTime.now());
            orderRepository.save(order);
        }
        return ResponseEntity.ok().build();
    }

    // --- 📊 EXCEL RAPOR INDIRME PORTU (YENİ) ---
    @GetMapping("/orders/excel")
    public ResponseEntity<InputStreamResource> downloadExcelReport() throws IOException {
        ByteArrayInputStream in = excelService.siparisleriExceleDok();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=haftalik_siparis_raporu.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}