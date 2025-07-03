import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './ReviewsView.css';

const generateStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <i key={i} className={`fas fa-star ${i <= rating ? 'star-filled' : 'star-empty'}`}></i>
        );
    }
    return stars;
};

const ReviewsView = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userToken = useSelector(state => state.userData.token);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!userToken) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:8000/api/dostawca/recenzje', {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                if (!response.ok) {
                    throw new Error('Nie udało się pobrać recenzji.');
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [userToken]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pl-PL', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) return <p>Ładowanie recenzji...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="reviews-view-container">
            <h2>Ostatnie recenzje Twoich książek</h2>

            {reviews.length === 0 ? (
                <div className="no-reviews-card">
                    <p>Twoje książki nie mają jeszcze żadnych recenzji.</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-card-header">
                                <div className="review-rating">
                                    {generateStars(review.ocena)}
                                </div>
                                <div className="review-book-title">
                                    Dotyczy: <strong>{review.ebook.tytul}</strong>
                                </div>
                            </div>
                            <div className="review-card-body">
                                <p>"{review.tresc}"</p>
                            </div>
                            <div className="review-card-footer">
                                <span>Autor: {review.uzytkownik.imie}</span>
                                <span>Data: {formatDate(review.created_at)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsView;