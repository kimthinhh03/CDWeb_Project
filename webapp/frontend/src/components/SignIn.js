import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../css/AuthForm.css';

const SignIn = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form, setForm] = useState({ userName: '', password: '' });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [successPopup, setSuccessPopup] = useState(false);
    const validate = (name, value) => {
        let err = '';
        if (!value) err = t('field_required');
        return err;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const err = validate(name, value);
            setErrors(prev => ({ ...prev, [name]: err }));
        }
    };

    const handleBlur = e => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const err = validate(name, value);
        setErrors(prev => ({ ...prev, [name]: err }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const newErrors = {};
        Object.entries(form).forEach(([key, value]) => {
            const err = validate(key, value);
            if (err) newErrors[key] = err;
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const res = await axios.post('/auth/login', form);
            const { token, user } = res.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));


            setSuccessPopup(true);
        } catch (err) {
            setErrorMsg(t('login_failed'));
        }
    };

    const handleSendEmail = () => {
        setMessage(t('email_sent'));
    };

    const handleVerifyOtp = () => {
        setMessage(t('otp_verified'));
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
                            onBlur={handleBlur}
                        />
                        {errors.userName && <p className="error">{errors.userName}</p>}

                        <input
                            type="password"
                            name="password"
                            placeholder={t('password')}
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}

                        <div className="forgot-password">
                            <span onClick={() => setShowPopup(true)}>{t('forgot_password')}</span>
                        </div>
                        <button type="submit">{t('login')}</button>
                        {errorMsg && <p className="error">{errorMsg}</p>}
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
                                onChange={e => setEmail(e.target.value)}
                            />
                            <button type="button" onClick={handleSendEmail}>{t('send')}</button>
                        </div>
                        <div className="forgot-row">
                            <input
                                type="text"
                                placeholder={t('otp_code')}
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                            />
                            <button type="button" onClick={handleVerifyOtp}>{t('confirm')}</button>
                        </div>
                        {message && <p className="message">{message}</p>}
                    </div>
                </div>
            )}
            {successPopup && (
                <div className="popup-overlay" onClick={() => setSuccessPopup(false)}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <h4>{t('login_success')}</h4>
                        <button
                            className="popup-btn"
                            onClick={() => {
                                setSuccessPopup(false);
                                window.location.href = '/';
                            }}
                        >
                            {t('back_to_home')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignIn;
