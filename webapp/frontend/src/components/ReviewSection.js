import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewPopup from './ReviewPopup';
import '../css/Review.css';
import { useTranslation } from 'react-i18next';

const ReviewSection = ({ masp, product }) => {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ total: 0, ratings: {} });
    const [showPopup, setShowPopup] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/review/${masp}`);
            setReviews(res.data);
            const statRes = await axios.get(`/api/review/${masp}/stats`);
            setStats(statRes.data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [masp]);

    return (
        <div className="review-section">
            <div className="review-left">
                <h3>{t('review')}</h3>
                <p><strong>{stats.total}</strong> {t('total_reviews')}</p>
                {[5, 4, 3, 2, 1].map((star) => (
                    <div className="rating-bar" key={star}>
                        <span>{star}</span>
                        <span className="star">★</span>
                        <div className="bar">
                            <div
                                className="fill"
                                style={{ width: `${(stats.ratings[star] || 0) / (stats.total || 1) * 100}%` }}
                            ></div>
                        </div>
                        <span>({stats.ratings[star] || 0})</span>
                    </div>
                ))}
                <button className="write-btn" onClick={() => setShowPopup(true)}>
                    {t('write_review')}
                </button>
            </div>

            <div className="review-right">
                {reviews.map((r) => (
                    <div key={r.id} className="review-item">
                        <div className="review-header">
                            <strong>{r.nickname}</strong> <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                            <div className="stars">
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                            </div>
                        </div>
                        <div className="review-summary"><strong>{r.summary}</strong></div>
                        <p>{r.comment}</p>
                    </div>
                ))}
            </div>

            {showPopup && (
                <ReviewPopup
                    masp={masp}
                    product={product}
                    onClose={() => {
                        setShowPopup(false);
                        fetchReviews();
                    }}
                />
            )}
        </div>
    );
};

export default ReviewSection;
