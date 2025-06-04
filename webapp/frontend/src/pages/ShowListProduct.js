import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/ShowListProduct.css";

const ShowListProduct = () => {
    const { t, i18n } = useTranslation();
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [sort, setSort] = useState(null);
    // Loading sản phẩm
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const navigate = useNavigate();
    // Phân trang
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const priceRanges = [
        { label: t("priceLabel1"), min: 0, max: 100000 },
        { label: t("priceLabel2"), min: 100000, max: 200000 },
        { label: t("priceLabel3"), min: 200000, max: 300000 },
        { label: t("priceLabel4"), min: 300000, max: 500000 },
        { label: t("priceLabel5"), min: 500000, max: Number.MAX_SAFE_INTEGER }
    ];

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const lang = i18n.language;
            let endpoint = "";

            if (selectedPrice) {
                const encodedCategory = category ? `&category=${encodeURIComponent(category)}` : "";
                endpoint = `/api/product/filter?minPrice=${selectedPrice.min}&maxPrice=${selectedPrice.max}${encodedCategory}&lang=${lang}&page=${page}&size=6`;
            } else if (sort === "nameAZ" || sort === "nameZA") {
                const ascending = sort === "nameAZ";
                endpoint = `/api/product/sort/name?ascending=${ascending}&lang=${lang}&page=${page}&size=6`;
            } else if (sort === "priceAZ" || sort === "priceZA") {
                const ascending = sort === "priceAZ";
                endpoint = `/api/product/sort/price?ascending=${ascending}&lang=${lang}&page=${page}&size=6`;
            } else if (category) {
                endpoint = `/api/product/category/${encodeURIComponent(category)}?lang=${lang}&page=${page}&size=6`;
            } else {
                endpoint = `/api/product/all?lang=${lang}&page=${page}&size=6`;
            }

            const response = await axios.get(endpoint);
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
            setHasLoaded(true);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category, selectedPrice, sort, page]);

    const handlePriceClick = (range) => {
        setPage(0);
        if (selectedPrice?.min === range.min && selectedPrice?.max === range.max) {
            fetchProducts();
        } else {
            setSelectedPrice(range);
        }
    };

    const resetFilters = () => {
        setSelectedPrice(null);
        setSort(null);
        setPage(0);
        navigate(0);
    };

    return (
        <div className="container my-4 show-list">
            <div className="row">
                <div className="col-md-3 filter-section">
                    <h6>{t("brand")}</h6>
                    <p className="text-muted">{t("notAvailable")}</p>
                    <hr />
                    <h6>{t("priceRange")}</h6>
                    {priceRanges.map((range, index) => (
                        <div className="form-check" key={index}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="priceRange"
                                id={`price-${index}`}
                                checked={selectedPrice?.min === range.min && selectedPrice?.max === range.max}
                                onChange={() => handlePriceClick(range)}
                            />
                            <label className="form-check-label" htmlFor={`price-${index}`}>{range.label}</label>
                        </div>
                    ))}
                    <hr />
                    <h6>{t("sortBy")}</h6>
                    <div className="d-flex flex-column gap-1">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSort("nameAZ")}>{t("sortNameAZ")}</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSort("nameZA")}>{t("sortNameZA")}</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSort("priceAZ")}>{t("sortPriceAZ")}</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSort("priceZA")}>{t("sortPriceZA")}</button>
                    </div>
                    <button className="btn btn-success w-100 mt-3" onClick={resetFilters}>{t("reset")}</button>
                </div>

                <div className="col-md-9">
                    <h4 className="mb-4">{category ? t("categoryTitle", { category }) : t("allProducts")}</h4>

                    <div className="row">
                        {loading ? (
                            <div className="text-center w-100">
                                <span>{t("loading")}</span>
                            </div>
                        ) : !loading && hasLoaded && products.length === 0 ? (
                            <div className="text-center w-100">
                                <span>{t("noProducts")}</span>
                            </div>
                        ) : (
                            products.map((product) => (
                                <div className="col-lg-4 col-md-6 mb-4" key={product.masp}>
                                    <Link to={`/product/${product.masp}`} className="text-decoration-none">
                                        <div className="card product-card">
                                            <img
                                                src={`/img/${product.productDetail?.hinhanh}`}
                                                className="card-img-top"
                                                alt={product.productDetail?.tensp}
                                                onError={(e) => { e.target.src = "/img/logo.png"; }}
                                            />
                                            <div className="card-body">
                                                <h6>{product.productDetail?.tensp}</h6>
                                                <h5>{product.price?.toLocaleString("vi-VN")} <u>đ</u></h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                className="btn btn-outline-primary mx-1"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </button>
                            {[...Array(totalPages).keys()].map((p) => (
                                <button
                                    key={p}
                                    className={`btn mx-1 ${p === page ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p + 1}
                                </button>
                            ))}
                            <button
                                className="btn btn-outline-primary mx-1"
                                disabled={page === totalPages - 1}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowListProduct;
