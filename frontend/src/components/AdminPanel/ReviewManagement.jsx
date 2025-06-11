import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './ManagementTable.css';
import generateStars from '../../utils/generateStars';

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    if (lastPage <= 1) return null;
    const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
    return (
        <div className="pagination-container">
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={page === currentPage ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

const ReviewManagement = () => {
    const token = useSelector(state => state.userData.token);

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [ratingFilter, setRatingFilter] = useState(''); // Nowy stan dla filtra ocen

    const fetchReviews = useCallback(async () => {
        if (!token) return;
        setLoading(true);

        const params = new URLSearchParams({
            page: currentPage,
            szukaj: searchTerm,
            sortuj_wg: sortConfig.key,
            kierunek: sortConfig.direction,
            filtruj_ocena: ratingFilter, // Dodajemy filtr do zapytania
        });
        const url = `http://localhost:8000/api/admin/recenzje?${params.toString()}`;

        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setReviews(data.data);
            setLastPage(data.last_page);
            setCurrentPage(data.current_page);
        } catch (error) {
            console.error("Błąd pobierania recenzji:", error);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage, searchTerm, sortConfig, ratingFilter]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę recenzję?")) return;
        try {
            await fetch(`http://localhost:8000/api/admin/recenzje/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchReviews(); // Odśwież listę po usunięciu
        } catch (error) {
            console.error("Błąd usuwania recenzji:", error);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (event) => {
        setRatingFilter(event.target.value);
        setCurrentPage(1);
    };

    if (loading && reviews.length === 0) return <p>Ładowanie recenzji...</p>;

    return (
        <div>
            <h1>Zarządzanie recenzjami</h1>

            <div className="filters-container">
                <input
                    type="search"
                    className="search-input"
                    placeholder="Szukaj po treści, autorze, tytule książki..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select className="filter-select" value={ratingFilter} onChange={handleFilterChange}>
                    <option value="">Wszystkie oceny</option>
                    <option value="5">★★★★★ (5)</option>
                    <option value="4">★★★★☆ (4)</option>
                    <option value="3">★★★☆☆ (3)</option>
                    <option value="2">★★☆☆☆ (2)</option>
                    <option value="1">★☆☆☆☆ (1)</option>
                </select>
            </div>

            <table className="management-table">
                <thead>
                <tr>
                    <th className="sortable" onClick={() => handleSort('id')}>ID</th>
                    <th>E-book</th>
                    <th>Autor recenzji</th>
                    <th className="sortable" onClick={() => handleSort('ocena')}>Ocena</th>
                    <th>Treść</th>
                    <th className="sortable" onClick={() => handleSort('created_at')}>Data dodania</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {loading && <tr><td colSpan="7">Odświeżanie...</td></tr>}
                {!loading && reviews.length === 0 && (
                    <tr><td colSpan="7">Nie znaleziono recenzji pasujących do kryteriów.</td></tr>
                )}
                {!loading && reviews.map((review) => (
                    <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>{review.ebook?.tytul || 'Brak danych'}</td>
                        <td>{review.uzytkownik?.imie} {review.uzytkownik?.nazwisko || 'Brak danych'}</td>
                        <td>{generateStars(review.ocena)}</td>
                        <td className="review-content">{review.tresc ? `${review.tresc.substring(0, 100)}...` : '-'}</td>
                        <td>{new Date(review.created_at).toLocaleDateString('pl-PL')}</td>
                        <td>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteReview(review.id)}>Usuń</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ReviewManagement;