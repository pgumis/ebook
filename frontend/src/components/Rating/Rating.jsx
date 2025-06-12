// src/components/Rating/Rating.jsx
import React from 'react';
import "./Rating.css";
import generateStars from '../../utils/generateStars';

const Rating = ({ ratingObj }) => {
    // Zabezpieczenie na wypadek, gdyby obiekt był pusty
    if (!ratingObj) return null;

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="review-author-info">
                    <img src="/avatars/avatar1.png" alt="Awatar" className="review-author-avatar" />
                    <span>{ratingObj.author}</span>
                </div>
                <div className="review-rating-info">
                    <div className="review-stars">{generateStars(ratingObj.rating)}</div>
                    <span className="review-date">{ratingObj.date}</span>
                </div>
            </div>
            <div className="review-body">
                <p>{ratingObj.text || "Użytkownik nie dodał treści recenzji."}</p>
            </div>
        </div>
    );
};

export default Rating;