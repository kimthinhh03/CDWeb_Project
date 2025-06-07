package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.model.ProductReview;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/review")
public class ProductReviewController {

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    // Gửi bình luận
    @PostMapping("/{masp}")
    public ResponseEntity<?> submitReview(@PathVariable String masp, @RequestBody ProductReview review) {
        Product product = productRepository.findById(masp).orElseThrow();
        review.setProduct(product);
        review.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    // Lấy các bình luận
    @GetMapping("/{masp}")
    public List<ProductReview> getReviewsByProduct(@PathVariable String masp) {
        return reviewRepository.findByProduct_MaspOrderByCreatedAtDesc(masp);
    }

    // Thống kê số lượng đánh giá sao
    @GetMapping("/{masp}/stats")
    public Map<String, Object> getRatingStats(@PathVariable String masp) {
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
