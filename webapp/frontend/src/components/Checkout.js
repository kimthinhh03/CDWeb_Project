import React, { useEffect, useState } from 'react';
import '../css/Checkout.css';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Checkout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { product, products } = location.state || {};

    const [formData, setFormData] = useState({
        lastName: '',
        surName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        ward: ''
    });

    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setFormData(prev => ({
                ...prev,
                lastName: storedUser.lastName || '',
                surName: storedUser.surName || '',
                phone: storedUser.phone || '',
                email: storedUser.email || '',
                address: storedUser.address || ''
            }));
        }
    }, []);

    useEffect(() => {
        if (products?.length > 0) {
            const enriched = products.map(p => ({
                ...p,
                unitPrice: p.unitPrice || p.price
            }));
            setOrderItems(enriched);
        } else if (product) {
            setOrderItems([{
                ...product,
                unitPrice: product.unitPrice || product.price
            }]);
        }
    }, [product, products]);

    useEffect(() => {
        const total = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        setTotalPrice(total);
    }, [orderItems]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatCurrency = (value) => value.toLocaleString('vi-VN') + 'đ';

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleOrder = () => {
        const { surName, lastName, phone, email, city, district, ward } = formData;
        if (!surName || !lastName || !phone || !email || !validateEmail(email) || !city || !district || !ward) {
            toast.error(t("checkout.fillRequired"));
            return;
        }

        if (!["COD", "VNPay"].includes(paymentMethod)) {
            toast.warn(t("checkout.paymentNotAvailable"));
            return;
        }

        setShowConfirmPopup(true);
    };

    const handleConfirmOrder = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        const orderData = {
            userId: storedUser.id,
            date: new Date().toISOString(),
            items: orderItems.map(item => ({
                masp: item.masp,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            })),
            totalAmount: totalPrice,
            status: "Chờ xác nhận",
            paymentMethod
        };

        axios.post("http://localhost:8888/api/orders", orderData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                toast.success(t("checkout.orderSuccess"));
                navigate("/orders");
            })
            .catch((err) => {
                console.error(err);
                toast.error(t("checkout.orderFailed"));
            });

        setShowConfirmPopup(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen px-6 py-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                {/* Left */}
                <div className="w-full lg:w-3/5 checkout-section">
                    <h2 className="checkout-title">{t("checkout.title")}</h2>

                    {/* Buyer Info */}
                    <div className="border rounded mb-6">
                        <div className="bg-gray-100 px-4 py-2 font-semibold">{t("checkout.buyerInfo")}</div>
                        <div className="p-4 grid grid-cols-2 gap-4">
                            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder={t("checkout.lastName")} className="checkout-input" />
                            <input name="surName" value={formData.surName} onChange={handleChange} placeholder={t("checkout.surName")} className="checkout-input" />
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder={t("checkout.phone")} className="checkout-input" />
                            <input name="email" value={formData.email} onChange={handleChange} placeholder={t("checkout.email")} className="checkout-input" />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mb-6">
                        <h3 className="checkout-label">{t("checkout.shippingInfo")}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="city" value={formData.city} onChange={handleChange} placeholder={t("checkout.city")} className="checkout-input" />
                            <input name="district" value={formData.district} onChange={handleChange} placeholder={t("checkout.district")} className="checkout-input" />
                            <input name="ward" value={formData.ward} onChange={handleChange} placeholder={t("checkout.ward")} className="checkout-input" />
                            <input name="address" value={formData.address} onChange={handleChange} placeholder={t("checkout.street")} className="checkout-input" />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border rounded">
                        <div className="bg-gray-100 px-4 py-2 font-semibold">{t("checkout.paymentMethod")}</div>
                        <div className="p-4 space-y-2">
                            {["COD", "VNPay"].map(method => (
                                <label key={method} className="flex items-center gap-2">
                                    <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                                    <span>{t(`checkout.${method.toLowerCase()}`)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="w-full lg:w-2/5 checkout-section h-fit">
                    <h2 className="checkout-title">{t("checkout.orderSummary")}</h2>

                    {/* Products */}
                    <div className="space-y-4 border-b pb-4">
                        {orderItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 border-b pb-3">
                                <img src={`/img/${item.hinhanh}`} alt={item.tensp} className="w-14 h-14 object-cover rounded border" />
                                <div className="flex-grow">
                                    <p className="text-sm font-medium">{item.tensp}</p>
                                    <p className="text-xs text-gray-600">SKU: {item.masp} | {t("quantity")}: {item.quantity}</p>
                                </div>
                                <div className="font-bold">{formatCurrency(item.unitPrice * item.quantity)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="text-sm py-4 space-y-2">
                        <div className="order-summary-line"><span>{t("checkout.subtotal")}</span><span>{formatCurrency(totalPrice)}</span></div>
                        <div className="order-summary-line"><span>{t("checkout.discount")}</span><span>0đ</span></div>
                        <div className="order-summary-line"><span>{t("checkout.shipping")}</span><span>0đ</span></div>
                        <div className="order-summary-total"><span>{t("checkout.totalWithVAT")}</span><span>{formatCurrency(totalPrice)}</span></div>
                    </div>

                    <button className="checkout-button" onClick={handleOrder}>
                        {t("checkout.placeOrder")}
                    </button>

                    <p className="checkout-terms">
                        {t("checkout.terms")}<br />*{t("checkout.noCancelNote")}*
                    </p>
                </div>
            </div>

            {/* Confirm popup */}
            {showConfirmPopup && (
                <div className="popup-overlay">
                    <div className="popup-content bg-white p-4 rounded shadow text-black">
                        <h5>{t("checkout.confirmTitle")}</h5>
                        <p className="text-black"><strong>{t("checkout.name")}:</strong> {formData.lastName} {formData.surName}</p>
                        <p className="text-black"><strong>{t("checkout.phone")}:</strong> {formData.phone}</p>
                        <p className="text-black"><strong>{t("checkout.email")}:</strong> {formData.email}</p>
                        <p className="text-black"><strong>{t("checkout.address")}:</strong> {formData.address}, {formData.ward}, {formData.district}, {formData.city}</p>
                        <p className="text-black"><strong>{t("checkout.paymentMethod")}:</strong> {paymentMethod === "COD" ? t("checkout.cod") : "VNPay"}</p>

                        {paymentMethod === "VNPay" && (
                            <img src="/img/vnpay-qr-demo.png" alt="QR VNPay" className="w-40 h-auto my-3 mx-auto" />
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button className="btn btn-secondary" onClick={() => setShowConfirmPopup(false)}>
                                {t("checkout.backToCheckout")}
                            </button>
                            {paymentMethod === "COD" && (
                                <button className="btn btn-success" onClick={handleConfirmOrder}>
                                    {t("checkout.confirm")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
