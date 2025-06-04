import React, { useEffect, useState } from "react";
import "../css/ProductDescription.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProductDescription = () => {
    const { i18n, t } = useTranslation();
    const { productID } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        const lang = i18n.language;
        axios.get(`/api/product/${productID}?lang=${lang}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.category) {
                    axios.get(`/api/product/category-slide?category=${res.data.category}&lang=${lang}`)
                        .then(resp => setRelated(resp.data));
                }
            })
            .catch(err => setError(err.message));
    }, [productID, i18n.language]);

    const handleQuantityChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        const stock = product?.stockQuantity || 0;
        const num = Math.min(parseInt(value || "0"), stock);
        setQuantity(num);
    };

    const increaseQuantity = () => {
        const stock = product?.stockQuantity || 0;
        if (quantity < stock) setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 0) setQuantity(quantity - 1);
    };

    if (error) return <div className="text-danger">{t("error")}: {error}</div>;
    if (!product) return <div>{t("loadingProduct")}</div>;

    return (
        <div className="product-page">
            <div className="container product-container py-4">
                <div className="row mb-3 navi">
                    <a href="/">{t("home")}</a> / {t("productDetail")}
                </div>

                <div className="row">
                    <div className="col-md-5 text-center">
                        <img
                            src={`/img/${product.productDetail?.hinhanh}`}
                            alt={product.productDetail?.tensp}
                            className="product-image"
                        />
                    </div>
                    <div className="col-md-7">
                        <h2 className="product-title">{product.productDetail?.tensp}</h2>
                        <div className="mb-2">
                            <span className="text-muted">{t("brand")}: </span>
                            <span className="text-success fw-semibold">{product.productDetail?.nhacungcap}</span>
                            <span className="ms-4 text-muted">{t("status")}: </span>
                            <span className={product.stockQuantity ? "text-success" : "text-danger"}>
                                {product.stockQuantity ? t("inStock") : t("outOfStock")}
                            </span>
                        </div>
                        <h4 className="text-success">
                            {product.price?.toLocaleString("vi-VN")} <u>đ</u>
                        </h4>
                        <div className="mb-2">
                            <strong>{t("unitTitle")}</strong>: {product.unit}
                        </div>
                        <div className="mb-2">
                            <strong>{t("quantity")}</strong>:
                            <div className="quantity-box d-inline-flex align-items-center ms-2">
                                <button onClick={decreaseQuantity} className="btn btn-sm btn-outline-secondary">-</button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="form-control mx-2 text-center"
                                    style={{ width: "60px" }}
                                />
                                <button onClick={increaseQuantity} className="btn btn-sm btn-outline-secondary">+</button>
                            </div>
                        </div>
                        <div className="text-muted mb-3">
                            {t("stockLeft")}: {product.stockQuantity}
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-success">{t("addToCart")}</button>
                            <button className="btn btn-outline-success">{t("checkout")}</button>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <h5 className="mb-3">{t("descriptionTitle")}</h5>
                    <div className="border p-3 rounded bg-light">
                        {product.productDetail?.mota}
                    </div>
                </div>

                <div className="mt-5">
                    <h5 className="mb-3">{t("relatedProducts")}</h5>
                    <div className="row">
                        {related.map(item => (
                            <div className="col-md-2 text-center mb-4" key={item.masp}>
                                <Link to={`/product/${item.masp}`} className="text-decoration-none text-dark">
                                    <img src={`/img/${item.productDetail?.hinhanh}`} alt="" className="img-fluid mb-2" />
                                    <div>{item.productDetail?.tensp}</div>
                                    <div className="text-success fw-semibold">
                                        {item.price?.toLocaleString("vi-VN")} đ
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDescription;