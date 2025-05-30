import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useTranslation } from 'react-i18next';

const Header = ({ user }) => {
    const { t, i18n } = useTranslation();
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const isAdmin = user?.rolename === 'addmin';

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim() !== "") {
            navigate(`/lookup?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    const categories = t("productTypes", { returnObjects: true });

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="header">
            <Link to="/"><img src="/img/logo1.jpg" className="logo" alt="Logo" /></Link>
            <div className="navbar">
                <ul className="nav">
                    <li><Link to="/">{t("home")}</Link></li>
                    <li>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                {t("productCategories")}
                            </button>
                            <ul className="dropdown-menu">
                                {categories.map((type, index) => (
                                    <li key={index}>
                                        <Link
                                            className="dropdown-item"
                                            to={`/products/category/${encodeURIComponent(type)}`}
                                        >
                                            {type}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="icon_header">
                <form className="search_box" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search_input"
                        placeholder={t("searchPlaceholder")}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button className="searchbutton" type="submit">{t("search")}</button>
                </form>

                <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                    className="form-select form-select-sm mx-2"
                    style={{width: 'auto', display: 'inline-block'}}
                >
                    <option value="vi">VN</option>
                    <option value="en">US</option>
                    <option value="kr">KR</option>
                </select>

                <Link to={user ? '/tocart' : '/signin'}>
                    <img src="/img/cart4.svg" alt="Giỏ hàng" />
                </Link>

                {user ? (
                    <>
                        <p style={{ color: 'black', margin: '0px 10px' }}>{t("greeting")}, {user.tenkh}</p>
                        <a href="/logout" style={{ fontSize: '80%', color: '#5f9ea0' }}>{t("logout")}</a>
                        {isAdmin && (
                            <Link to="/admin/users" style={{ fontSize: '80%', color: '#5f9ea0' }}>
                                {t("userManagement")}
                            </Link>
                        )}
                    </>
                ) : (
                    <Link to="/signin">
                        <img src="/img/person-fill.svg" alt={t("signin")} />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
