package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private String email;

    private int rating;

    @Column(length = 2000)
    private String summary;

    private String comment;

    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "masp", nullable = false)
    private Product product;
}

