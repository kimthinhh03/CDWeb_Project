import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../css/ProductList.css";
import i18n from "i18next";

const PAGE_SIZE = 20;

const ProductList = () => {
    const { t } = useTranslation();

    const [allProducts, setAllProducts] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("pageNumber")) || 1;
    const lang = i18n.language;

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await axios.get(`/api/product/all?lang=${lang}`);
                if (Array.isArray(res.data)) {
                    setAllProducts(res.data);
                } else {
                    setAllProducts([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, [lang]);

    useEffect(() => {
        const startIdx = (page - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;
        setListProduct(allProducts.slice(startIdx, endIdx));
    }, [page, allProducts]);

    const changePage = (newPage) => {
        setSearchParams({ pageNumber: newPage });
    };

    const totalPages = Math.ceil(allProducts.length / PAGE_SIZE);

    if (loading) return <div className="text-center my-5">{t("loading")}</div>;
    if (error) return <div className="text-center my-5 text-danger">{t("error", { error })}</div>;

    return (
        <div className="container product-list">
            <h3 className="mt-4 mb-4">{t("productList")}</h3>
            {listProduct?.length === 0 ? (
                <div className="text-center my-5">{t("noProducts")}</div>
            ) : (
                <>
                    <div className="row">
                        {listProduct.map((product) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.masp}>
                                <Link to={`/product/${product.masp}`} className="product-link">
                                    <div className="card product-card">
                                        <img
                                            src={`/img/${product.hinhanh}`}
                                            alt={product.tensp}
                                            className="card-img-top"
                                            height="200"
                                            onError={(e) => {
                                                e.target.src = '/img/logo.png';
                                            }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {product.tensp || "Không có tên"}
                                            </h5>
                                            <h6 className="card-price text-success">
                                                {product.price?.toLocaleString("vi-VN")} <u>đ</u>
                                            </h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination justify-content-center mt-4">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`btn btn-sm mx-1 ${page === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => changePage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;
