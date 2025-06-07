package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private String masp;
    private String tensp;
    private String hinhanh;
    private Double price;
    private String unit;
    private Integer quantity;
}