package com.example.backend.controller;

import com.example.backend.dto.ProductDTO;
import com.example.backend.model.Product;
//import com.example.backend.model.ProductDetail;
import com.example.backend.model.ProductTranslation;
import com.example.backend.model.UpdateHistory;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductTranslationRepository;
import com.example.backend.repository.UpdateHistoryRepository;
import com.example.backend.service.ProductService;
import com.example.backend.service.UpdateHistoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired private ProductService productService;
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductTranslationRepository productTranslationRepository;
//    @Autowired private UpdateHistoryRepository updateHistoryRepository;
//    @Autowired private ObjectMapper objectMapper; // Dùng để chuyển đổi Object <-> JSON
    @Autowired private UpdateHistoryService updateHistoryService;

    // Lấy tất cả sản phẩm theo ngôn ngữ
    @GetMapping("/all")
    public List<ProductDTO> getAllProducts(@RequestParam(defaultValue = "vi") String lang) {
        return productService.getAllProducts(lang);
    }

    // Lấy chi tiết sản phẩm theo mã sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy ngẫu nhiên sản phẩm
    @GetMapping("/random")
    public List<Product> getRandomProducts(@RequestParam int limit, @RequestParam String lang) {
        return productService.getRandomProducts(limit, lang);
    }

    // Lấy tên sản phẩm theo danh sách masp
    @GetMapping("/product-names")
    public List<Map<String, String>> getProductNames(@RequestParam List<String> maspList, @RequestParam String lang) {
        return productTranslationRepository
                .findByMaspInAndLang(maspList, lang)
                .stream()
                .map(t -> Map.of("masp", t.getMasp(), "name", t.getName()))
                .collect(Collectors.toList());
    }

    // Tìm kiếm sản phẩm theo tên
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchProductsByName(name);
    }

    // Lấy sản phẩm theo danh mục có phân trang
    @GetMapping("/category/{category}")
    public Page<Product> getProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "vi") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return productService.getPageProductsByCategory(category, lang, PageRequest.of(page, size));
    }

    // Lấy sản phẩm theo danh mục có giới hạn (limit) - dùng cho slide
    @GetMapping("/category-slide")
    public ResponseEntity<List<Product>> getProductsByCategoryWithLimit(
            @RequestParam String category,
            @RequestParam(defaultValue = "vi") String lang,
            @RequestParam(defaultValue = "16") int limit
    ) {
        List<Product> all = productService.getListProductsByCategory(category, lang);
        return ResponseEntity.ok(all.stream().limit(limit).toList());
    }

    // Lọc sản phẩm theo khoảng giá (có thể kèm category)
    @GetMapping("/filter")
    public Page<Product> filterProductsByPrice(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "vi") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return (category != null && !category.isEmpty()) ?
                productService.filterProductsByPriceAndCategory(minPrice, maxPrice, category, lang, pageable) :
                productService.filterProductsByPriceRange(minPrice, maxPrice, lang, pageable);
    }

    // Sắp xếp sản phẩm theo tên
    @GetMapping("/sort/name")
    public Page<Product> sortProductsByName(
            @RequestParam boolean ascending,
            @RequestParam(defaultValue = "vi") String lang,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return productService.sortProductsByName(ascending, lang, category, PageRequest.of(page, size));
    }

    // Sắp xếp sản phẩm theo giá
    @GetMapping("/sort/price")
    public Page<Product> sortProductsByPrice(
            @RequestParam boolean ascending,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return productService.sortProductsByPrice(ascending, category, PageRequest.of(page, size));
    }

    // Thêm sản phẩm mới
    @PostMapping("/addProduct")
    public ResponseEntity<?> createProduct(@RequestBody Product product, @RequestParam String username) {
        try {
            Product created = productService.addProduct(product);
            productService.logHistory(username, "CREATE", product.getMasp(), null, created);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi thêm sản phẩm: " + e.getMessage());
        }
    }

    // Cập nhật sản phẩm
    @PutMapping("/{masp}")
    public ResponseEntity<?> updateProduct(
            @PathVariable String masp,
            @RequestBody Product updatedProduct,
            @RequestParam String username) {
        try {
            // Lấy bản ghi cũ
            Product oldProduct = productRepository.findById(masp).orElse(null);

            // Cập nhật
            Product result = productService.updateProduct(masp, updatedProduct, username);

            // Ghi lịch sử cập nhật
//            updateHistoryService.logHistory(username, "UPDATE", masp, oldProduct, result);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // Xoá sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id, @RequestParam String username) {
        try {
            Product old = productRepository.findById(id).orElse(null);
            productService.deleteProduct(id);
            productService.logHistory(username, "DELETE", id, old, null); // Ghi lịch sử xoá
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xóa sản phẩm: " + e.getMessage());
        }
    }

}
