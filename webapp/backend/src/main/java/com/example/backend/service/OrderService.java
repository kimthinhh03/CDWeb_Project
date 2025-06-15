package com.example.backend.service;

import com.example.backend.dto.OrderItemResponseDTO;
import com.example.backend.dto.OrderRequestItemDTO;
import com.example.backend.dto.OrderResponseDTO;
import com.example.backend.model.*;
import com.example.backend.repository.*;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(Integer userId, List<OrderRequestItemDTO> items, String paymentMethod, Double ignoredClientTotal, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(paymentMethod);
        order.setStatus(status);

        // Tính tổng tiền từ dữ liệu backend
        List<OrderItem> orderItems = items.stream().map(itemDto -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);

            Product product = productRepository.findByMasp(itemDto.getMasp())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getMasp()));
            item.setProduct(product);

            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(product.getPrice());  // Lấy đơn giá từ DB chứ không lấy từ client

            return item;
        }).collect(Collectors.toList());

        double totalAmount = orderItems.stream()
                .mapToDouble(i -> i.getUnitPrice() * i.getQuantity())
                .sum();

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        return orderRepository.save(order);
    }
    public List<OrderResponseDTO> getOrdersByUser(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId);

        return orders.stream().map(order -> {
            List<OrderItemResponseDTO> itemDTOs = order.getItems().stream().map(item -> {
                return new OrderItemResponseDTO(
                        item.getProduct().getMasp(),
                        item.getProduct().getTensp(),
                        item.getQuantity(),
                        item.getUnitPrice()
                );
            }).toList();

            return new OrderResponseDTO(
                    order.getOrderId(),
                    order.getOrderDate(),
                    order.getTotalAmount(),
                    order.getPaymentMethod(),
                    order.getStatus(),
                    itemDTOs
            );
        }).toList();
    }
}
