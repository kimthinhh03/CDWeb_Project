package com.example.backend.controller;

import com.example.backend.dto.OrderItemResponseDTO;
import com.example.backend.dto.OrderRequestDTO;
import com.example.backend.dto.OrderRequestItemDTO;
import com.example.backend.dto.OrderResponseDTO;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository itemRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequestDTO request) {
        Order order = orderService.placeOrder(
                request.getUserId(),
                request.getItems(),
                request.getPaymentMethod(),
                request.getTotalAmount(),
                request.getStatus()
        );
        return ResponseEntity.ok(order);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(request.getTotalAmount());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(request.getStatus());

        orderRepository.save(order);

        for (OrderRequestItemDTO dto : request.getItems()) {
            OrderItem item = new OrderItem();
            Product product = productRepository.findByMasp(dto.getMasp())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getMasp()));
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.setUnitPrice((double) dto.getUnitPrice());
            item.setOrder(order);
            itemRepository.save(item);
        }

        return ResponseEntity.ok("Order created successfully");
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUser(@PathVariable Integer userId) {
        List<OrderResponseDTO> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUserId(@PathVariable Integer userId) {
//        List<Order> orders = orderRepository.findByUserId(userId);
//
//        List<OrderResponseDTO> response = orders.stream().map(order -> {
//            List<OrderItemResponseDTO> itemDTOs = order.getItems().stream().map(item -> {
//                return new OrderItemResponseDTO(
//                        item.getProduct().getMasp(),
//                        item.getProduct().getTensp(),
//                        item.getQuantity(),
//                        item.getUnitPrice()
//                );
//            }).toList();
//
//            return new OrderResponseDTO(
//                    order.getOrderId(),
//                    order.getOrderDate(),
//                    order.getTotalAmount(),
//                    order.getPaymentMethod(),
//                    order.getStatus(),
//                    itemDTOs
//            );
//        }).toList();
//
//        return ResponseEntity.ok(response);
//    }

    public void main() {
    }
}