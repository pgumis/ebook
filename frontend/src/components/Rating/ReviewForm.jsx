// src/components/Rating/ReviewForm.jsx (wersja z interaktywnymi gwiazdkami)
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ReviewForm = ({ ebookId, onReviewAdded }) => {
    const [ocena, setOcena] = useState(0);
    // -> NOWY STAN: Przechowuje ocenę, nad którą jest kursor myszy
    const [hoverOcena, setHoverOcena] = useState(0);
    const [tresc, setTresc] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = useSelector((state) => state.userData.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (ocena === 0) {
            setError('Proszę wybrać ocenę od 1 do 5 gwiazdek.');
            return;
        }
        setLoading(true);
        // ... reszta logiki fetch bez zmian ...
    };

    // -> NOWA, ULEPSZONA FUNKCJA DO RENDEROWANIA GWIAZDEK
    const renderRatingInput = () => {
        return (

            <div className="book-details-rating-stars">
                {[1, 2, 3, 4, 5].map((starValue) => {
                    const color = starValue <= (hoverOcena || ocena) ? "orange" : "lightgray";
                    return (
                        <span
                            key={starValue}
                            style={{ color, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '2rem' }}
                            onMouseEnter={() => !loading && setHoverOcena(starValue)}
                            onMouseLeave={() => !loading && setHoverOcena(0)}
                            onClick={() => !loading && setOcena(starValue)}
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="add-review-form-wrapper">
            <p className="rating-form-label">Twoja ocena</p>
            {renderRatingInput()}
            <textarea
                name="recenzja"
                value={tresc}
                onChange={(e) => setTresc(e.target.value)}
                placeholder="Wpisz swoją opinię..."
                className="review-textarea"
                disabled={loading}
            />
            <div className="rating-btns-container">
                <button type="submit" className="form-submit" disabled={loading}>
                    {loading ? 'Wysyłanie...' : 'Wyślij recenzję'}
                </button>
            </div>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
    );
};

export default ReviewForm;