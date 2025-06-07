package com.example.backend.service;

import com.example.backend.dto.CartItemDTO;
import com.example.backend.model.Cart;

public interface CartService {
    Cart getCart(String username);
    Cart addItem(String username, CartItemDTO item);
    Cart updateItem(String username, Long itemId, int quantity);
    void removeItem(String username, Long itemId);
    void clearCart(String username);
}
