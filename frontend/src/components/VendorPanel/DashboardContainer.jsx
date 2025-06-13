// src/components/VendorPanel/DashboardContainer.jsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { viewActions } from '../../store/view'; // Importujemy akcje Reduxa
import './Dashboard.css'; // Główne style kart, które już mamy
import './DashboardContainer_Vendor.css'; // Dedykowane, nowe style dla tego widoku
import DashboardSingleInfo from "./DashboardSingleInfo";

// Funkcja pomocnicza do generowania gwiazdek, przyda się w widgecie z recenzjami
const generateStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<i key={i} className={`fas fa-star ${i <= rating ? 'star-filled' : 'star-empty'}`}></i>);
    }
    return stars;
};

const DashboardContainer = () => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);

    // Stany dla wszystkich potrzebnych danych
    const [stats, setStats] = useState(null);
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userData.token) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // Używamy Promise.all, aby pobierać dane statystyk i recenzji równolegle
                const [statsRes, reviewsRes] = await Promise.all([
                    fetch('http://localhost:8000/api/dostawca/dashboard-stats', {
                        headers: { 'Authorization': `Bearer ${userData.token}` }
                    }),
                    fetch('http://localhost:8000/api/dostawca/recenzje?limit=3', { // Pobieramy tylko 3 ostatnie recenzje
                        headers: { 'Authorization': `Bearer ${userData.token}` }
                    })
                ]);

                if (!statsRes.ok || !reviewsRes.ok) {
                    throw new Error('Błąd podczas pobierania danych na pulpit.');
                }

                const statsData = await statsRes.json();
                const reviewsData = await reviewsRes.json();

                setStats(statsData);
                setRecentReviews(reviewsData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userData.token]);

    if (loading) return <div className="loading-spinner">Ładowanie danych pulpitu...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <>
            {/* Górny rząd ze statystykami - bez zmian */}
            <div className="dashboard-grid-layout">
                <div className="stat-card-main"><DashboardSingleInfo name="Zysk (30 dni)" value={`${stats?.profitInRange} zł`} /></div>
                <div className="stat-card"><DashboardSingleInfo name="Sprzedane (30 dni)" value={stats?.soldInRange} /></div>
                <div className="stat-card"><DashboardSingleInfo name="Liczba publikacji" value={stats?.publishedBooks} /></div>
            </div>

            {/* NOWA, DOLNA CZĘŚĆ PULPITU */}
            <div className="dashboard-main-content-grid">
                {/* Lewa kolumna: Ostatnie recenzje */}
                <div className="dashboard-card recent-reviews-card">
                    <h4>Ostatnia aktywność</h4>
                    {recentReviews.length > 0 ? (
                        <div className="reviews-list-widget">
                            {recentReviews.map(review => (
                                <div key={review.id} className="review-item-widget">
                                    <div className="review-item-header">
                                        <span>{review.ebook.tytul}</span>
                                        <span className="review-rating-widget">
                                        {generateStars(review.ocena)}
                                            {/* Dodajemy ocenę liczbową w nawiasie */}
                                            <span className="numeric-rating">({parseFloat(review.ocena).toFixed(1)})</span>
                                            </span>
                                    </div>
                                    <p className="review-comment-widget">"{review.tresc}"</p>
                                    <span className="review-author-widget">- {review.uzytkownik.imie}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Brak nowych recenzji do wyświetlenia.</p>
                    )}
                </div>

                {/* Prawa kolumna: Szybkie akcje i bestsellery */}
                <div className="right-column-grid">
                    <div className="dashboard-card quick-actions-card">
                        <h4>Szybkie akcje</h4>
                        <button onClick={() => dispatch(viewActions.changeView('addBook'))} className="add-book-button">
                            <i className="fas fa-plus-circle"></i> Dodaj nową książkę
                        </button>
                    </div>

                    {stats?.topEbooks?.length > 0 && (
                        <div className="dashboard-card top-ebooks-widget-card">
                            <h4>Twoje bestsellery (30 dni)</h4>
                            <ol>
                                {stats.topEbooks.slice(0, 3).map(ebook => ( // Bierzemy tylko top 3
                                    <li key={ebook.tytul}>
                                        <span>{ebook.tytul}</span>
                                        <strong>{ebook.total_sold} szt.</strong>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default DashboardContainer;