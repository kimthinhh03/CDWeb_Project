package com.example.backend.service;

import com.example.backend.dto.ProductDTO;
import com.example.backend.model.Product;
import com.example.backend.model.UpdateHistory;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductTranslationRepository;
import com.example.backend.repository.UpdateHistoryRepository;
import com.example.backend.utils.VietnameseUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductService {

    // =============== CONFIGURATION ===============
//    @Bean
//    public ObjectMapper objectMapper() {
//        return new ObjectMapper();
//    }

    private final ProductRepository productRepository;
    private final ProductTranslationRepository translationRepo;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          ProductTranslationRepository translationRepo) {
        this.productRepository = productRepository;
        this.translationRepo = translationRepo;
    }

    @Autowired
    private UpdateHistoryRepository updateHistoryRepository;
    @Autowired
    private UpdateHistoryService updateHistoryService;
    @Autowired
    private ObjectMapper objectMapper;

    // LỊCH SỬ CẬP NHẬT
    public void logHistory(String username, String actionType, String masp, Product oldData, Product newData) {
        try {
            UpdateHistory history = new UpdateHistory();
            history.setUsername(username);
            history.setActionType(actionType);
            history.setMasp(masp);
            history.setUpdatedAt(LocalDateTime.now());

            if (oldData != null) {
                history.setOldData(objectMapper.writeValueAsString(oldData));
            }
            if (newData != null) {
                history.setNewData(objectMapper.writeValueAsString(newData));
            }

            updateHistoryRepository.save(history);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // LẤY SẢN PHẨM
    public List<ProductDTO> getAllProducts(String lang) {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> productDTOs = new ArrayList<>();

        for (Product product : products) {
            ProductDTO dto = new ProductDTO(product);
            translationRepo.findByMaspAndLang(product.getMasp(), lang)
                    .ifPresent(tr -> dto.setTensp(tr.getName()));
            productDTOs.add(dto);
        }

        return productDTOs;
    }


    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByTenspContainingIgnoreCase(name);
    }

    public List<Product> getRandomProducts(int limit, String lang) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findRandomProducts(pageable);
        applyTranslations(products, lang);
        return products;
    }

    public Page<Product> getPageProductsByCategory(String category, String lang, Pageable pageable) {
        String normalized = VietnameseUtils.toUpperNoAccent(category);
        List<Product> products = productRepository.findByCategory(normalized);
        applyTranslations(products, lang);
        return new PageImpl<>(products, pageable, products.size());
    }

    public List<Product> getListProductsByCategory(String category, String lang) {
        String normalized = VietnameseUtils.toUpperNoAccent(category);
        List<Product> products = productRepository.findByCategory(normalized);
        applyTranslations(products, lang);
        return products;
    }

    public Page<Product> filterProductsByPriceAndCategory(double min, double max, String category, String lang, Pageable pageable) {
        Page<Product> page = productRepository.filterCategoryIgnoreAccent(min, max, category, pageable);
        applyTranslations(page.getContent(), lang);
        return page;
    }

    public Page<Product> filterProductsByPriceRange(Double min, Double max, String lang, Pageable pageable) {
        Page<Product> page = productRepository.findByPriceBetween(min, max, pageable);
        applyTranslations(page.getContent(), lang);
        return page;
    }

    public Page<Product> sortProductsByName(boolean ascending, String lang, String category, Pageable pageable) {
        if (category != null && !category.isEmpty()) {
            String normalized = VietnameseUtils.toUpperNoAccent(category);
            return ascending ?
                    productRepository.findByCategoryOrderByNameAsc(normalized, lang, pageable) :
                    productRepository.findByCategoryOrderByNameDesc(normalized, lang, pageable);
        }

        return ascending ?
                productRepository.findAllOrderByNameAsc(lang, pageable) :
                productRepository.findAllOrderByNameDesc(lang, pageable);
    }

    public Page<Product> sortProductsByPrice(boolean ascending, String category, Pageable pageable) {
        Sort sort = ascending ? Sort.by("price").ascending() : Sort.by("price").descending();
        if (category != null && !category.isEmpty()) {
            String normalized = VietnameseUtils.toUpperNoAccent(category);
            return productRepository.findByCategory(normalized, PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    sort
            ));
        } else {
            return productRepository.findAll(PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    sort
            ));
        }
    }

    // THÊM / CẬP NHẬT / XOÁ
    public Product addProduct(Product product) {
        if (product.getMasp() == null || product.getMasp().trim().isEmpty()) {
            throw new IllegalArgumentException("Mã sản phẩm (masp) không được để trống.");
        }
        if (productRepository.findById(product.getMasp()).isPresent()) {
            throw new IllegalArgumentException("Mã sản phẩm đã tồn tại.");
        }
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(String masp, Product updatedProduct, String username) {
        Product existing = productRepository.findById(masp)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + masp));
        Product oldCopy = new Product(existing); // sao lưu bản gốc

        existing.setTensp(updatedProduct.getTensp());
        existing.setHinhanh(updatedProduct.getHinhanh());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        existing.setUnit(updatedProduct.getUnit());
        existing.setCategory(updatedProduct.getCategory());

        Product saved = productRepository.save(existing);

        updateHistoryService.logHistory(username, "UPDATE", masp, oldCopy, saved);
        return saved;
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    // DỊCH NGÔN NGỮ
    private void applyTranslations(List<Product> products, String lang) {
        for (Product product : products) {
            if (product.getTranslations() != null) {
                product.setTranslations(
                        product.getTranslations().stream()
                                .filter(t -> t.getLang().equalsIgnoreCase(lang))
                                .toList()
                );
            }
            translationRepo.findByMaspAndLang(product.getMasp(), lang)
                    .ifPresent(tr -> product.setTensp(tr.getName()));
        }
    }
}
