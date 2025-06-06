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
    @Query("SELECT p FROM Product p WHERE UPPER(p.category) = UPPER(:category)")
    List<Product> findByCategory(@Param("category") String category);

    // Lọc theo khoảng giá và category
    Page<Product> findByPriceBetween(Double min, Double max, Pageable pageable);

    @Query(value = """
    SELECT   p.masp, p.category, p.price, p.unit, p.stock_quantity,
             s.tensp, s.hinhanh, s.nhacungcap, s.mota
    FROM chitietsanpham p
    JOIN sanpham s ON p.masp = s.masp
    WHERE p.price BETWEEN :min AND :max
      AND unaccent(p.category) ILIKE unaccent('%' || :category || '%')
""", countQuery = """
    SELECT COUNT(*) FROM chitietsanpham p
    JOIN sanpham s ON p.masp = s.masp
    WHERE p.price BETWEEN :min AND :max
      AND unaccent(p.category) ILIKE unaccent('%' || :category || '%')
""", nativeQuery = true)
    Page<Product> filterCategoryIgnoreAccent(
            @Param("min") double min,
            @Param("max") double max,
            @Param("category") String category,
            Pageable pageable);
    // Lọc sản phẩm ngẫu nhiên
    @Query("SELECT p FROM Product p ORDER BY function('RANDOM')")
    List<Product> findRandomProducts(Pageable pageable);

    // Sắp xếp sản phẩm
    List<Product> findAllByOrderByPriceAsc();
    List<Product> findAllByOrderByPriceDesc();

    Page<Product> findByCategory(String category, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN ProductTranslation t ON p.masp = t.masp WHERE t.lang = :lang ORDER BY t.name ASC")
    Page<Product> findAllOrderByTranslatedNameAsc(@Param("lang") String lang, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN ProductTranslation t ON p.masp = t.masp WHERE t.lang = :lang ORDER BY t.name DESC")
    Page<Product> findAllOrderByTranslatedNameDesc(@Param("lang") String lang, Pageable pageable);


}