//package com.example.backend.service;
//
//import com.example.backend.model.Cart;
//import com.example.backend.model.CartItem;
//import com.example.backend.model.Product;
//import org.springframework.stereotype.Service;
//
//import java.util.Iterator;
//import java.util.List;
//
//@Service
//public class CartService {
//
//    public void addToCart(Cart cart, Product product, int quantity) {
//        boolean updated = false;
//        for (CartItem item : cart.getItems()) {
//            if (item.getMaSP().equals(product.getMaSP())) {
//                item.setQuantity(item.getQuantity() + quantity);
//                updated = true;
//                break;
//            }
//        }
//        if (!updated) {
//            CartItem item = new CartItem(
//                    product.getMaSP(),
//                    product.getTypeProduct(),
//                    product.getPrice(),
//                    product.getUnit(),
//                    quantity
//            );
//            cart.getItems().add(item);
//        }
//    }
//
//    public void removeFromCart(Cart cart, String maSP) {
//        cart.getItems().removeIf(item -> item.getMaSP().equals(maSP));
//    }
//
//    public long calculateTotal(Cart cart) {
//        return cart.getItems().stream()
//                .mapToLong(item -> item.getPrice() * item.getQuantity())
//                .sum();
//    }
//}
