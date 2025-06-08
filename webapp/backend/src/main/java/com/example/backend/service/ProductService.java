package com.example.backend.service;

import com.example.backend.model.Product;
import com.example.backend.model.ProductDetail;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductTranslationRepository;
import com.example.backend.utils.VietnameseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    @Autowired
    private ProductTranslationRepository translationRepo;
    @Autowired
    public ProductService(ProductRepository productRepository,
                          ProductTranslationRepository translationRepo) {
        this.productRepository = productRepository;
        this.translationRepo = translationRepo;
    }

    // Lấy tất cả sản phẩm
    public List<Product> getAllProducts(String lang) {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            ProductDetail detail = product.getProductDetail();

            translationRepo.findByMaspAndLang(product.getMasp(), lang)
                    .ifPresent(tr -> {
                        if (detail != null) {
                            detail.setTensp(tr.getName());
                        }
                    });
        }

        return products;
    }
    // Lấy sản phẩm theo ID
    public Optional<Product> getProductById(String id) {
         return productRepository.findById(id);
    }

    // Tìm kiếm sản phẩm theo tên
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByTenspContainingIgnoreCase(name);
    }
    // Lọc sản phẩm ngẫu nhiên
    public List<Product> getRandomProducts(int limit, String lang) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findRandomProducts(pageable);

        // Lọc translation theo lang
        for (Product product : products) {
            if (product.getTranslations() != null) {
                product.setTranslations(
                        product.getTranslations().stream()
                                .filter(t -> t.getLang().equalsIgnoreCase(lang))
                                .toList()
                );
            }
        }

        return products;
    }
    // Lọc sản phẩm theo danh mục
    public Page<Product> getPageProductsByCategory(String category, String lang, Pageable pageable) {
        String normalized = VietnameseUtils.toUpperNoAccent(category);
        List<Product> products = productRepository.findByCategory(normalized);
        applyTranslations(products, lang);
        return new PageImpl<>(products, pageable, products.size());
    }
//    public List<Product> getProductsByCategory(String category) {
//        String normalized = VietnameseUtils.toUpperNoAccent(category);
//        System.out.println(">>> Lọc sản phẩm theo category: " + normalized);
//        return productRepository.findByCategory(normalized);
//    }
    public List<Product> getListProductsByCategory(String category, String lang) {
        String normalized = VietnameseUtils.toUpperNoAccent(category);
        System.out.println(">>> Lọc sản phẩm theo category: " + normalized);

        List<Product> products = productRepository.findByCategory(normalized);

        for (Product product : products) {
            if (product.getTranslations() != null) {
                product.setTranslations(
                        product.getTranslations().stream()
                                .filter(t -> t.getLang().equalsIgnoreCase(lang))
                                .toList()
                );
            }
        }

        return products;
    }

    // Lọc sản phẩm theo khoảng giá
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

    // Sắp xếp sản phẩm theo tên (có thể theo danh mục)
    public Page<Product> sortProductsByName(boolean ascending, String lang, String category, Pageable pageable) {
        if (category != null && !category.isEmpty()) {
            String normalized = VietnameseUtils.toUpperNoAccent(category);  // 👈 chuẩn hoá
            return ascending ?
                    productRepository.findByCategoryOrderByNameAsc(normalized, lang, pageable) :
                    productRepository.findByCategoryOrderByNameDesc(normalized, lang, pageable);
        }
        return ascending ?
                productRepository.findAllOrderByNameAsc(lang, pageable) :
                productRepository.findAllOrderByNameDesc(lang, pageable);
    }
    // Sắp xếp sản phẩm theo giá (có thể theo danh mục)
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

    // Thêm sản phẩm mới
    public Product addProduct(Product product) {
        if (product.getMasp() == null || product.getMasp().trim().isEmpty()) {
            throw new IllegalArgumentException("Mã sản phẩm (masp) không được để trống.");
        }
        // Kiểm tra xem masp đã tồn tại chưa (tùy chọn)
        if (productRepository.findById(product.getMasp()).isPresent()) {
            throw new IllegalArgumentException("Mã sản phẩm đã tồn tại.");
        }
        return productRepository.save(product);
    }

    // Cập nhật sản phẩm
    public Product updateProduct(String id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setTensp(productDetails.getTensp());
        product.setHinhanh(productDetails.getHinhanh());
        product.setNhacungcap(productDetails.getNhacungcap());
        product.setMota(productDetails.getMota());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setUnit(productDetails.getUnit());
        product.setStockQuantity(productDetails.getStockQuantity()); // Sửa thành getStockQuantity()

        return productRepository.save(product);
    }

    // Xóa sản phẩm
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    private void applyTranslations(List<Product> products, String lang) {
        for (Product product : products) {
            if (product.getTranslations() != null) {
                product.setTranslations(
                        product.getTranslations().stream()
                                .filter(t -> t.getLang().equalsIgnoreCase(lang))
                                .toList()
                );
            }
        }
    }
}