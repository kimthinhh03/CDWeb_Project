package com.example.backend.repository;

import com.example.backend.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProduct_MaspOrderByCreatedAtDesc(String masp);

    @Query("SELECT COUNT(r), r.rating FROM ProductReview r WHERE r.product.masp = :masp GROUP BY r.rating")
    List<Object[]> countByRating(@Param("masp") String masp);
}
