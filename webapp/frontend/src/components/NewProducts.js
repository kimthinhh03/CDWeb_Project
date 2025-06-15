import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../api/productApi';
import '../css/NewProducts.css';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import axios from "axios";

const NewProducts = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const changeLanguage = (lang) => {
    //     i18n.changeLanguage(lang);
    //
    //     const maspList = products.map(p => p.masp);
    //     axios.get("/api/product-names", {
    //         params: {
    //             maspList: maspList,
    //             lang: lang
    //         }
    //     }).then(res => {
    //         const updatedNames = res.data;
    //         const nameMap = {};
    //         updatedNames.forEach(({ masp, name }) => {
    //             nameMap[masp] = name;
    //         });
    //
    //         const updatedProducts = products.map(p => ({
    //             ...p,
    //             name: nameMap[p.masp] || p.name  // fallback if not found
    //         }));
    //         setProducts(updatedProducts);
    //     });
    // };
    useEffect(() => {
        const lang = i18n.language;

        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/product/random?limit=4&lang=${lang}`);
                const data = Array.isArray(res.data) ? res.data : [];
                setProducts(data);
            } catch (err) {
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [i18n.language]);
    if (loading) {
        return <div className="text-center my-5">{t("loading")}</div>;
    }

    if (error) {
        return <div className="text-center my-5 text-danger">{t("error", { error })}</div>;
    }

    return (
        <div className="new-products container my-5">
            <h2 className="text-center mb-4">{t("newProducts")}</h2>
            <div className="row justify-content-center">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map(product => (
                        <div className="col-md-3 mb-4" key={product.masp}>
                            <Link to={`/product/${product.masp}`} className="text-decoration-none">
                                <div className="card h-100 text-center border-0 shadow-sm">
                                    <img
                                        src={`/img/${product.hinhanh}`}
                                        alt={product.tensp}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'contain' }}
                                        onError={(e) => { e.target.src = '/img/logo.png'; }}
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
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>{t("noProducts")}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewProducts;
