//package com.example.backend.model;
//
//import jakarta.persistence.*;
//import java.io.Serializable;
//import java.util.List;
//
//@Entity
//@Table(name = "Cart")
//public class Cart implements Serializable {
//
//    @Id
//    @Column(name = "Username")
//    private String username;
//
//    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<CartItem> items;
//
//    public Cart() {}
//
//    public Cart(String username) {
//        this.username = username;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public List<CartItem> getItems() {
//        return items;
//    }
//
//    public void setItems(List<CartItem> items) {
//        this.items = items;
//    }
//
//    // Tổng tiền
//    public long totalMoney() {
//        return items.stream()
//                .mapToLong(item -> item.getPrice() * item.getQuantity())
//                .sum();
//    }
//}
