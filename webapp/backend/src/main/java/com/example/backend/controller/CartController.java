package com.example.backend.controller;

import com.example.backend.dto.CartItemDTO;
import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired private CartService cartService;

    @GetMapping("/{username}")
    public Cart getCart(@PathVariable String username) {
        return cartService.getCart(username);
    }

    @PostMapping("/{username}/add")
    public ResponseEntity<?> addItem(@PathVariable String username, @RequestBody CartItemDTO itemRequest) {
        try {
            Cart updatedCart = cartService.addItem(username, itemRequest);
            return ResponseEntity.ok(updatedCart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Add to cart failed: " + e.getMessage());
        }
    }

    @PutMapping("/{username}/update/{itemId}")
    public Cart updateItem(@PathVariable String username, @PathVariable Long itemId, @RequestParam int quantity) {
        return cartService.updateItem(username, itemId, quantity);
    }

    @DeleteMapping("/{username}/remove/{itemId}")
    public void removeItem(@PathVariable String username, @PathVariable Long itemId) {
        cartService.removeItem(username, itemId);
    }

    @DeleteMapping("/{username}/clear")
    public void clearCart(@PathVariable String username) {
        cartService.clearCart(username);
    }
}
