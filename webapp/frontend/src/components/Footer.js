import React from 'react';
import '../css/Footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="container" style={{ backgroundColor: '#24262b' }}>
                <div className="row">
                    <div className="footer-col">
                        <h4>{t("aboutUs")}</h4>
                        <p>{t("aboutUsDesc")}</p>
                        <p>{t("shopAddress")}</p>
                        <p>{t("hotline")}</p>
                    </div>

                    <div className="footer-col">
                        <h4>{t("categories")}</h4>
                        <ul>
                            <li><a href="/">{t("home")}</a></li>
                            <li><a href="#">{t("products")}</a></li>
                            <li><a href="#">{t("introduce")}</a></li>
                            <li><a href="#">{t("about")}</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>{t("support")}</h4>
                        <ul>
                            <li><a href="#">{t("privacy")}</a></li>
                            <li><a href="#">{t("delivery")}</a></li>
                            <li><a href="#">{t("payment")}</a></li>
                            <li><a href="#">{t("refund")}</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>{t("followUs")}</h4>
                        <div className="social-links">
                            <a href="#"><img src="/img/facebook.svg" alt="Facebook" /></a>
                            <a href="#"><img src="/img/twitter.svg" alt="Twitter" /></a>
                            <a href="#"><img src="/img/instagram.svg" alt="Instagram" /></a>
                            <a href="#"><img src="/img/linkedin.svg" alt="LinkedIn" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
