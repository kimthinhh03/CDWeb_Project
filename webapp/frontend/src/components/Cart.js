import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../css/Cart.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const { cartItems, updateCart } = useCart();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            setItems([]);
            return;
        }

        const user = JSON.parse(storedUser);

        try {
            const res = await axios.get(`/api/cart/${user.userName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems(res.data.items || []);
        } catch (e) {
            console.error('Error fetching cart:', e);
            setItems([]);
        }
    };

    const updateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!storedUser || !token) return;
        const user = JSON.parse(storedUser);

        try {
            await axios.put(`/api/cart/${user.userName}/update/${itemId}?quantity=${newQty}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchCart();
        } catch (e) {
            console.error(e);
        }
    };

    const removeItem = async (itemId) => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!storedUser || !token) return;
        const user = JSON.parse(storedUser);

        try {
            await axios.delete(`/api/cart/${user.userName}/remove/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
                <div className="empty-cart text-center">
                    <img src="/img/empty-cart.png" alt="Empty Cart"
                         style={{width: '180px', opacity: 0.6, marginBottom: '20px'}}/>
                    <h2>{t('cart_empty_title') || 'Giỏ hàng của bạn đang trống'}</h2>
                    <p className="text-muted">{t('cart_empty_desc') || 'Hãy chọn sản phẩm yêu thích và thêm vào giỏ hàng!'}</p>
                    <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/')}>
                        {t('continue_shopping') || 'Tiếp tục mua sắm'}
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {items.map(item => (
                            <div className="cart-item" key={item.id}>
                                <img src={`/img/${item.hinhanh}`} alt={item.tensp}/>
                                <div className="cart-item-details">
                                    <h4>{item.tensp}</h4>
                                    <p>{t('unit')}: {item.unit}</p>
                                    <div className="cart-item-controls">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <input type="text" value={item.quantity} readOnly />
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        <span className="cart-item-price">{t('price')}: {item.price?.toLocaleString()} đ</span>
                                        <button className="cart-item-remove" onClick={() => removeItem(item.id)}>X</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <span className="label">{t('total')}:</span> {getTotalPrice().toLocaleString()} đ
                        <div className="mt-3">
                            <button className="btn btn-success">{t('checkout')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
