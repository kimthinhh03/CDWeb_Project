import React, { useEffect, useState } from "react";
import "../css/ProductDescription.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ProductDescription = () => {
    const { i18n, t } = useTranslation();
    const { productID } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const lang = i18n.language;
        axios
            .get(`/api/product/${productID}?lang=${lang}`)
            .then(res => setProduct(res.data))
            .catch(err => setError(err.message));
    }, [productID, i18n.language]);

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
                        <h4 className="text-success">
                            {product.price?.toLocaleString("vi-VN")} <u>đ</u>
                        </h4>
                        <p className="product-description">{product.productDetail?.mota}</p>

                        <div className="mt-4">
                            <a href={`/addToCart?productID=${product.masp}`}>
                                <button className="btn btn-warning">{t("addToCart")}</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDescription;
