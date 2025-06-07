package com.example.backend.service.impl;

import com.example.backend.dto.CartItemDTO;
import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {

    @Autowired private CartRepository cartRepo;
    @Autowired private CartItemRepository itemRepo;

    @Override
    public Cart getCart(String username) {
        return cartRepo.findByUserName(username).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUserName(username);
            return cartRepo.save(cart);
        });
    }

    @Override
    public Cart addItem(String username, CartItemDTO dto) {
        Cart cart = getCart(username);

        CartItem item = new CartItem();
        item.setMasp(dto.getMasp());
        item.setTensp(dto.getTensp());
        item.setHinhanh(dto.getHinhanh());
        item.setPrice(dto.getPrice());
        item.setQuantity(dto.getQuantity());
        item.setUnit(dto.getUnit());
        item.setTotalPrice(dto.getPrice() * dto.getQuantity());
        item.setCart(cart);

        cart.getItems().add(item);
        itemRepo.save(item);
        return cartRepo.save(cart);
    }

    @Override
    public Cart updateItem(String username, Long itemId, int quantity) {
        Cart cart = getCart(username);
        for (CartItem item : cart.getItems()) {
            if (item.getId().equals(itemId)) {
                item.setQuantity(quantity);
                item.setTotalPrice(item.getPrice() * quantity);
                itemRepo.save(item);
                break;
            }
        }
        return cart;
    }

    @Override
    public void removeItem(String username, Long itemId) {
        itemRepo.deleteById(itemId);
    }

    @Override
    public void clearCart(String username) {
        Cart cart = getCart(username);
        itemRepo.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepo.save(cart);
    }
}
