import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./ShoppingCart.css";
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        axios.get("/api/cart")
            .then(res => {
                setCartItems(res.data.items);
                setTotal(res.data.total);
            })
            .catch(error => {
                console.error("Lỗi khi tải giỏ hàng:", error);
            });
    }, []);


    const handleBuy = () => {
        alert("Chức năng mua hàng đang được phát triển...");
    };

    return (
        <>
            <Header />
            <div className="container cart-container">
                <h3 className="mt-4 mb-4">GIỎ HÀNG</h3>
                <div className="row">
                    {cartItems.map((item, index) => (
                        <div className="col-md-4 cart-item" key={index}>
                            <img
                                src={`./img/${item.nameFile}`}
                                alt={item.nameProduct}
                                className="img-thumbnail"
                                width="150"
                            />
                            <div className="item-info">
                                <h5>{item.nameProduct}</h5>
                                <p>Số lượng: {item.quantity}</p>
                                <h6 style={{ color: "forestgreen" }}>
                                    {item.price.toLocaleString()} <u>đ</u>
                                </h6>
                            </div>
                        </div>
                    ))}
                </div>

                <hr />
                <div className="cart-summary">
                    <h4>Tổng tiền: {total.toLocaleString()} <u>đ</u></h4>
                    <button className="btn btn-success mt-3" onClick={handleBuy}>
                        MUA NGAY
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ShoppingCart;
