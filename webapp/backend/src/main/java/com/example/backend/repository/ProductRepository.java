package com.example.backend.repository;

import com.example.backend.model.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    // Lấy tất cả sản phẩm
    @EntityGraph(attributePaths = {"productDetail", "translations"})
    Page<Product> findAll(Pageable pageable);


    // Tìm kiếm sản phẩm theo tên (không phân biệt hoa thường)
    List<Product> findByTenspContainingIgnoreCase(String name);

    // Lọc sản phẩm theo danh mục
    List<Product> findByCategory(String category);

    // Lọc sản phẩm theo khoảng giá
    List<Product> findByPriceBetween(Double price, Double price2);

    // Lọc sản phẩm ngẫu nhiên
    @Query("SELECT p FROM Product p ORDER BY function('RANDOM')")
    List<Product> findRandomProducts(Pageable pageable);

    // Sắp xếp sản phẩm
    List<Product> findAllByOrderByPriceAsc();
    List<Product> findAllByOrderByPriceDesc();
    @Query("SELECT p FROM Product p JOIN ProductTranslation t ON p.masp = t.masp WHERE t.lang = :lang ORDER BY t.name ASC")
    List<Product> findAllOrderByTranslatedNameAsc(@Param("lang") String lang);

    @Query("SELECT p FROM Product p JOIN ProductTranslation t ON p.masp = t.masp WHERE t.lang = :lang ORDER BY t.name DESC")
    List<Product> findAllOrderByTranslatedNameDesc(@Param("lang") String lang);

}