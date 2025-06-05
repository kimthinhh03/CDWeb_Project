import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../css/AuthForm.css';

const SignIn = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form, setForm] = useState({ userName: '', password: '' });
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', form);
            const token = res.data.data.token;
            localStorage.setItem('token', token);
            alert(t('login_success'));
        } catch (err) {
            setError(t('login_failed'));
        }
    };

    const handleSendEmail = () => {
        setMessage('Email sent');
    };

    const handleVerifyOtp = () => {
        setMessage('OTP verified');
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-section">
                    <div className="auth-header">
                        <h2>{t('sign_in_title')}</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="userName"
                            placeholder={t('username')}
                            value={form.userName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder={t('password')}
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="forgot-password">
                            <span onClick={() => setShowPopup(true)}>{t('forgot_password')}</span>
                        </div>
                        <button type="submit">{t('login')}</button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-section">
                    <div className="auth-header">
                        <h2>{t('sign_up_title')}</h2>
                    </div>
                    <p className="description">{t('sign_up_desc')}</p>
                    <button className="signup-btn" onClick={() => navigate('/signup')}>
                        {t('sign_up')}
                    </button>
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <h4>{t('forgot_password_title')}</h4>
                        <div className="forgot-row">
                            <input
                                type="email"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="button" onClick={handleSendEmail}>{t('send')}</button>
                        </div>
                        <div className="forgot-row">
                            <input
                                type="text"
                                placeholder={t('otp_code')}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button type="button" onClick={handleVerifyOtp}>{t('confirm')}</button>
                        </div>
                        {message && <p className="message">{message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignIn;