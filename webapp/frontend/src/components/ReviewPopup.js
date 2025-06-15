import React, { useState } from 'react';
import axios from 'axios';
import '../css/Review.css';
import { useTranslation } from 'react-i18next';

const ReviewPopup = ({ masp, product, onClose }) => {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        nickname: '',
        email: '',
        rating: 5,
        summary: '',
        comment: '',
        imageUrl: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`/api/review/${masp}`, form);
            alert(t('review_submit_success'));
            onClose();
        } catch (err) {
            alert(t('review_submit_error'));
        }
    };

    return (
        <div className="popup-overlay review-popup-wrapper" onClick={onClose}>
            <div className="popup-content-review" onClick={e => e.stopPropagation()}>
                <h3>{t('write_review')}</h3>
                <div className="popup-body">
                    <div className="popup-left">
                        <label>{t('nickname')} *</label>
                        <input name="nickname" placeholder="v.d. JackJack" onChange={handleChange}/>

                        <label>{t('email')} *</label>
                        <input name="email" type="email" placeholder="abc@gmail.com" onChange={handleChange}/>

                        <label>{t('summary')} *</label>
                        <input name="summary" placeholder={t('summary_placeholder')} onChange={handleChange}/>

                        <label>{t('image_url')}</label>
                        <input name="imageUrl" placeholder="https://..." onChange={handleChange}/>

                        <label>{t('detailed_comment')}</label>
                        <textarea name="comment" rows={4} onChange={handleChange}/>
                    </div>

                    <div className="popup-right">
                        <div className="product-info">
                            <img src={`/img/${product.hinhanh}`} alt={product.tensp}/>
                            <div><strong>{product.tensp}</strong></div>
                        </div>

                        <label>{t('rating')} *</label>
                        <div className="star-input">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <span
                                    key={n}
                                    className={form.rating >= n ? 'star active' : 'star'}
                                    onClick={() => setForm({...form, rating: n})}
                                >★</span>
                            ))}
                        </div>

                        <button onClick={handleSubmit}>{t('submit_review')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewPopup;
