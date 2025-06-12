// src/components/Rating/ReviewForm.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Rating.css'; // Użyjemy stylów z Rating.css i dodamy nowe

const ReviewForm = ({ ebookId, onReviewAdded }) => {
    const [ocena, setOcena] = useState(0);
    const [hoverOcena, setHoverOcena] = useState(0);
    const [tresc, setTresc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.userData.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (ocena === 0) {
            setError('Proszę wybrać ocenę od 1 do 5 gwiazdek.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:8000/api/recenzje", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ebook_id: ebookId,
                    ocena: ocena,
                    tresc: tresc,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                // Używamy klucza 'error' z Twojego RecenzjaController.php
                const errorMessage = result.error || 'Wystąpił nieznany błąd.';
                throw new Error(errorMessage);
            }

            // W Twoim kontrolerze, po sukcesie, zwracasz bezpośrednio obiekt recenzji.
            // Musimy go uzupełnić o dane użytkownika, aby od razu dobrze się wyświetlił.
            const newReviewData = {
                ...result,
                uzytkownik: { nazwa: "Ty" } // Prosty placeholder
            };

            onReviewAdded(newReviewData);
            setOcena(0);
            setTresc('');
        } catch (err) {
            setError(err.message);
        } finally {
            // To jest kluczowe - ZAWSZE resetujemy stan ładowania
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-review-form-wrapper">
            <p className="rating-form-label">Twoja ocena:</p>
            <div className="book-details-rating-stars">
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <span
                        key={starValue}
                        style={{ color: starValue <= (hoverOcena || ocena) ? "#ffc107" : "#e0e0e0", cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '2rem' }}
                        onMouseEnter={() => !isSubmitting && setHoverOcena(starValue)}
                        onMouseLeave={() => !isSubmitting && setHoverOcena(0)}
                        onClick={() => !isSubmitting && setOcena(starValue)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <textarea
                name="recenzja"
                value={tresc}
                onChange={(e) => setTresc(e.target.value)}
                placeholder="Wpisz swoją opinię (opcjonalnie)..."
                className="review-textarea"
                disabled={isSubmitting}
                rows="4"
            />
            <div className="rating-btns-container">
                <button type="submit" className="form-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Wysyłanie...' : 'Wyślij recenzję'}
                </button>
            </div>
            {error && <p className="review-form-error">{error}</p>}
        </form>
    );
};

export default ReviewForm;