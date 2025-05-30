import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../css/LookUp.css';

const LookUp = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`/api/product/search?keyword=${encodeURIComponent(keyword)}`);
                const data = Array.isArray(res.data) ? res.data : [];
                setProducts(data);
            } catch (err) {
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (keyword.trim() !== "") {
            fetchProducts();
        } else {
            setLoading(false);
            setProducts([]);
        }
    }, [keyword]);

    if (loading) return <div className="text-center my-5">{t("loading")}</div>;
    if (error) return <div className="text-center my-5 text-danger">{t("error", { error })}</div>;

    return (
        <div className="container my-5">
            <h3 className="text-center mb-4">
                {t("searchResultsFor")} <strong>"{keyword}"</strong>
            </h3>

            {products.length === 0 ? (
                <div className="text-center my-5">{t("noProducts")}</div>
            ) : (
                <div className="row">
                    {products.map((product) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.masp}>
                            <Link to={`/product/${product.masp}`} className="text-decoration-none">
                                <div className="card h-100 text-center shadow-sm">
                                    <img
                                        src={`/img/${product.productDetail?.hinhanh}`}
                                        alt={product.productDetail?.tensp}
                                        className="card-img-top"
                                        style={{ height: 200, objectFit: 'contain' }}
                                        onError={(e) => { e.target.src = '/img/logo.png'; }}
                                    />
                                    <div className="card-body">
                                        <h5 className="text-success">
                                            {product.price?.toLocaleString("vi-VN")} đ
                                        </h5>
                                        <p className="card-text text-dark">
                                            {product.productDetail?.tensp?.length > 45
                                                ? product.productDetail.tensp.substring(0, 45) + "..."
                                                : product.productDetail?.tensp}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LookUp;
