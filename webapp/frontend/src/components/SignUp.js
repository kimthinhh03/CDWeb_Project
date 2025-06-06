import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../css/AuthForm.css';

const SignUp = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        userName: '', password: '', email: '', phone: '',
        surName: '', lastName: '', address: '', dateOfBirth: '', gender: 'Male'
    });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('/auth/register', form);
            setMessage(t('register_success'));
        } catch (err) {
            setMessage(t('register_failed'));
        }
    };

    return (
        <div className="signup-page">
            <h2>{t('sign_up')}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="userName" placeholder={t('username')} onChange={handleChange} required />
                <input type="password" name="password" placeholder={t('password')} onChange={handleChange} required />
                <input type="text" name="email" placeholder={t('email')} onChange={handleChange} required />
                <input type="text" name="phone" placeholder={t('phone')} onChange={handleChange} required />
                <input type="text" name="surName" placeholder={t('surname')} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder={t('lastname')} onChange={handleChange} required />
                <input type="text" name="address" placeholder={t('address')} onChange={handleChange} required />
                <input type="date" name="dateOfBirth" onChange={handleChange} required />
                <select name="gender" onChange={handleChange} required>
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
