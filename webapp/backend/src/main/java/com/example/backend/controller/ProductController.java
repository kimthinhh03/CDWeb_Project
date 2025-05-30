package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductTranslationRepository;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    @Autowired
    private ProductTranslationRepository productTranslationRepository;
    // Lấy tất cả sản phẩm
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Lọc lấy sản phẩm ngẫu nhiên
    @GetMapping("/random")
    public ResponseEntity<List<Product>> getRandomProducts(@RequestParam(defaultValue = "4") int limit) {
        List<Product> products = productService.getRandomProducts(limit);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(products);
    }
    // Tạo API lấy danh sách name theo masp[] và lang
    @GetMapping("/product-names")
    public List<Map<String, String>> getProductNames(
            @RequestParam List<String> maspList,
            @RequestParam String lang) {
        return productTranslationRepository
                .findByMaspInAndLang(maspList, lang)
                .stream()
                .map(t -> {
                    Map<String, String> m = new HashMap<>();
                    m.put("masp", t.getMasp());
                    m.put("name", t.getName());
                    return m;
                })
                .collect(Collectors.toList());
    }

    // Tìm kiếm sản phẩm theo tên
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchProductsByName(name);
    }

    // Lọc sản phẩm theo danh mục
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    // Lọc sản phẩm theo khoảng giá
    @GetMapping("/filter")
    public List<Product> filterProductsByPrice(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(defaultValue = "vi") String lang
    ) {
        return productService.filterProductsByPriceRange(minPrice, maxPrice, lang);

    }

    // Sắp xếp sản phẩm theo tên
    @GetMapping("/sort/name")
    public List<Product> sortProductsByName(@RequestParam boolean ascending) {
        return productService.sortProductsByName(ascending);
    }

    // Sắp xếp sản phẩm theo giá
    @GetMapping("/sort/price")
    public List<Product> sortProductsByPrice(@RequestParam boolean ascending) {
        return productService.sortProductsByPrice(ascending);
    }

    // Thêm sản phẩm mới
    @PostMapping("/addProduct")
    public Product createProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestBody Product productDetails) {

        Product updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}