package com.example.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestItemDTO {
    private String masp;
    private int quantity;
    private double unitPrice;
    private String tensp;
}
