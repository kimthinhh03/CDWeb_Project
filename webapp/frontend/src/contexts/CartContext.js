import { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const updateCart = (items) => setCartItems(items);
    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, updateCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);