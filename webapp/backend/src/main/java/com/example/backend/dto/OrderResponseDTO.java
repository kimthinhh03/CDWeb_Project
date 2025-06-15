package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private Long orderId;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private String paymentMethod;
    private String status;
    private List<OrderItemResponseDTO> items;
}
