import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../css/AuthForm.css';

const SignUp = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        userName: '', password: '', confirmPassword: '',
        email: '', phone: '', surName: '', lastName: '',
        address: '', dateOfBirth: '', gender: 'Male'
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'userName' && value.length < 3) {
            newErrors.userName = t('username_min');
        } else if (name === 'password' && value.length < 6) {
            newErrors.password = t('password_min');
        } else if (name === 'confirmPassword' && value !== form.password) {
            newErrors.confirmPassword = t('password_mismatch');
        } else if (name === 'phone' && !/^\d{10,11}$/.test(value)) {
            newErrors.phone = t('invalid_phone');
        } else {
            delete newErrors[name];
        }

        setErrors(newErrors);
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setErrors({ confirmPassword: t('password_mismatch') });
            return;
        }

        const payload = { ...form };
        delete payload.confirmPassword;

        try {
            const res = await axios.post('/auth/register', payload);
            setMessage(t('register_success'));
            setErrors({});
        } catch (err) {
            const msg = err.response?.data?.message || t('register_failed');
            setMessage(msg);
        }
    };

    return (
        <div className="auth-form">
            <h2>{t('sign_up')}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="userName" placeholder={t('username')} onChange={handleChange} />
                {errors.userName && <p className="error">{errors.userName}</p>}

                <input type="password" name="password" placeholder={t('password')} onChange={handleChange} />
                {errors.password && <p className="error">{errors.password}</p>}

                <input type="password" name="confirmPassword" placeholder={t('confirm_password')} onChange={handleChange} />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                <input type="text" name="email" placeholder={t('email')} onChange={handleChange} required />
                <input type="text" name="phone" placeholder={t('phone')} onChange={handleChange} />
                {errors.phone && <p className="error">{errors.phone}</p>}

                <input type="text" name="surName" placeholder={t('surname')} onChange={handleChange} />
                <input type="text" name="lastName" placeholder={t('lastname')} onChange={handleChange} />
                <input type="text" name="address" placeholder={t('address')} onChange={handleChange} />
                <input type="date" name="dateOfBirth" onChange={handleChange} />
                <select name="gender" onChange={handleChange}>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                </select>

                <button type="submit">{t('register')}</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default SignUp;
