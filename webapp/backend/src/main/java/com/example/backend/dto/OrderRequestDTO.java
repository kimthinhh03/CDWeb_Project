package com.example.backend.dto;

import com.example.backend.model.User;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {
    private Integer userId;
    private List<OrderRequestItemDTO> items;
    private String paymentMethod;
    private Double totalAmount;
    private String status;
}