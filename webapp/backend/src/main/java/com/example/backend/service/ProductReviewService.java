package com.example.backend.service;

import com.example.backend.model.Product;
import com.example.backend.model.ProductReview;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductReviewService {

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    // Lưu review
    public ProductReview submitReview(String masp, ProductReview review) {
        Product product = productRepository.findById(masp).orElseThrow();
        review.setProduct(product);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    // Lấy danh sách review
    public List<ProductReview> getReviewsByProduct(String masp) {
        return reviewRepository.findByProduct_MaspOrderByCreatedAtDesc(masp);
    }

    // Thống kê số sao
    public Map<String, Object> getRatingStats(String masp) {
        List<Object[]> raw = reviewRepository.countByRating(masp);
        Map<Integer, Integer> ratingCounts = new HashMap<>();
        int total = 0;

        for (Object[] row : raw) {
            int count = ((Long) row[0]).intValue();
            int rating = (Integer) row[1];
            ratingCounts.put(rating, count);
            total += count;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("ratings", ratingCounts);
        return result;
    }
}
