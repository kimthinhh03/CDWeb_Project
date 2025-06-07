import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../css/Cart.css';

const Cart = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get('/api/cart');
            setItems(res.data);
        } catch {
            setItems([]);
        }
    };

    const updateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;
        try {
            await axios.put(`/api/cart/item/${itemId}`, { quantity: newQty });
            fetchCart();
        } catch (e) {
            console.error(e);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`/api/cart/item/${itemId}`);
            fetchCart();
        } catch (e) {
            console.error(e);
        }
    };

    const getTotalPrice = () => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <div className="cart-container">
            {items.length === 0 ? (
                <div className="empty-cart">
                    <h2>{t('cart_title')}</h2>
                    <p>{t('cart_empty')}</p>
                    <button>{t('continue_shopping')}</button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-list">
                        {items.map(item => (
                            <div className="cart-item" key={item.id}>
                                <img src={`/img/${item.hinhanh}`} alt={item.tensp} />
                                <div className="cart-details">
                                    <h4>{item.tensp}</h4>
                                    <p>{t('unit')}: {item.unit}</p>
                                    <div className="cart-actions">
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <span>{t('price')}: {item.price?.toLocaleString()} đ</span>
                                        <button className="delete-btn" onClick={() => removeItem(item.id)}>X</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>{t('total')}: {getTotalPrice().toLocaleString()} đ</h3>
                        <button>{t('checkout')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;