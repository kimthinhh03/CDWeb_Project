import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useTranslation } from 'react-i18next';

const Header = ({ user }) => {
    const { t, i18n } = useTranslation();
    const [keyword, setKeyword] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role?.name === 'ROLE_ADMIN';

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim() !== '') {
            navigate(`/lookup?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="header">
            <Link to="/"><img src="/img/logo1.jpg" className="logo" alt="Logo" /></Link>
            <div className="navbar">
                <ul className="nav">
                    <li><Link to="/">{t("home")}</Link></li>
                    <li>
                        {isAdmin ? (
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                    {t("management")}
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item" to="/admin/products">{t("product_management")}</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/admin/update-history">{t("update_history")}</Link>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                    {t("productCategories")}
                                </button>
                                <ul className="dropdown-menu">
                                    {t("productTypes", { returnObjects: true }).map((type, index) => (
                                        <li key={index}>
                                            <Link className="dropdown-item" to={`/products/category/${encodeURIComponent(type)}`}>
                                                {type}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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

                <div className="dropdown lang-dropdown mx-2">
                    <button className="btn btn-outline-success dropdown-toggle" data-bs-toggle="dropdown">
                        {i18n.language.toUpperCase()}
                    </button>
                    <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => changeLanguage('vi')}>VN</button></li>
                        <li><button className="dropdown-item" onClick={() => changeLanguage('en')}>EN</button></li>
                        <li><button className="dropdown-item" onClick={() => changeLanguage('kr')}>KR</button></li>
                    </ul>
                </div>

                <Link to={user ? '/cart' : '/signin'}>
                    <img src="/img/cart4.svg" alt="Giỏ hàng" />
                </Link>

                <div className="dropdown ms-3">
                    <button className="btn user-dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                        <img src="/img/person-fill.svg" alt="User" />
                        {user && <span className="greeting-user ms-2">{t("greeting")}, {user.userName}</span>}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        {!user ? (
                            <>
                                <li><Link className="dropdown-item" to="/signin">{t("signin")}</Link></li>
                                <li><Link className="dropdown-item" to="/signup">{t("signup")}</Link></li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={() => setShowLogoutConfirm(true)}>
                                        {t("logout")}
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/profile">{t("myPage")}</Link></li>
                                <li><Link className="dropdown-item" to="/orders">{t("orderHistory")}</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {showLogoutConfirm && (
                <div className="logout-popup">
                    <div className="popup-content">
                        <p>{t("confirmLogout")}</p>
                        <div className="popup-buttons">
                            <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                                {t("cancel")}
                            </button>
                            <button className="btn btn-danger ms-2" onClick={handleLogout}>
                                {t("confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
