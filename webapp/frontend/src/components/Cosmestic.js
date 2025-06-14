import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import '../css/Cosmestic.css';
import {Link} from "react-router-dom";

const Cosmestic = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);

    const visibleCount = 4;

    useEffect(() => {
        axios
            .get(`/api/product/category-slide?category=MY PHAM&lang=${i18n.language}`)
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data.slice(0, 16) : [];
                setProducts(data);
            })
            .catch(() => setProducts([]));
    }, [i18n.language]);

    const totalSlides = Math.ceil(products.length / visibleCount);

    const next = () => {
        setSlideIndex((prev) => (prev + 1) % totalSlides);
    };

    const prev = () => {
        setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const slideStyle = {
        transform: `translateX(-${slideIndex * (100 / totalSlides)}%)`,
        transition: 'transform 0.6s ease-in-out',
        width: `${(products.length / visibleCount) * 100}%`
    };
    return (
        <div className="cosmestic-slide-container container my-5 position-relative">
            <h2 className="cosmestic-heading">
                {t("cosmeticProducts")}
            </h2>

            <button className="slide-button left" onClick={prev}>&#10094;</button>
            <button className="slide-button right" onClick={next}>&#10095;</button>

            <div className="product-wrapper">
                <div className="product-slide" style={slideStyle}>
                    {products.map((product) => (
                        <Link to={`/product/${product.masp}`} className="product-slide-card" key={product.masp}>
                            <div className="card h-100 text-center border-0 shadow-sm">
                                <img
                                    src={`/img/${product.hinhanh}`}
                                    alt={product.tensp}
                                    className="card-img-top"
                                    style={{ height: '180px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.src = '/img/logo.png';
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="text-success">
                                        {product.price?.toLocaleString('vi-VN')} đ
                                    </h5>
                                    <p className="card-text text-dark">
                                        {product.tensp?.length > 45
                                            ? product.tensp.substring(0, 45) + '...'
                                            : product.tensp}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Cosmestic;
