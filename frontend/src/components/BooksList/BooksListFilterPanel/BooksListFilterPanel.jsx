// src/components/BooksList/BooksListFilterPanel/BooksListFilterPanel.jsx

import React, { useState, useEffect } from 'react';
import './BooksListFilterPanel.css';

// Komponent otrzymuje nową funkcję 'onCloseMenu' jako prop
const BooksListFilterPanel = ({ onSelectCategory, selectedKategoria, onCloseMenu }) => {
    const [kategorie, setKategorie] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const pobierzKategorie = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:8000/api/kategorie');
                if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
                const dane = await response.json();
                setKategorie(dane);
            } catch (blad) {
                console.error("Błąd przy pobieraniu kategorii:", blad);
                setError(blad);
            } finally {
                setLoading(false);
            }
        };
        pobierzKategorie();
    }, []);

    // Nowa funkcja, która wywołuje dwie akcje
    const handleCategoryClick = (kategoria) => {
        onSelectCategory(kategoria);
        onCloseMenu(); // Zawsze zamykaj menu po kliknięciu
    };

    if (loading) return <div className="filter-panel">Ładowanie...</div>;
    if (error) return <div className="filter-panel" style={{ color: 'red' }}>Błąd ładowania.</div>;

    return (
        <div className="panel filter-panel">
            <div className="filter-panel-header">
                <h3>Kategorie</h3>
                {/* Przycisk zamykania - widoczny tylko na mobilce (dzięki CSS) */}
                <button className="close-menu-btn" onClick={onCloseMenu} aria-label="Zamknij menu">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <ul className="filter-panel-list">
                <li
                    className={!selectedKategoria ? 'active-category' : ''}
                    onClick={() => handleCategoryClick(null)}
                >
                    Wszystkie
                </li>
                {kategorie.map((kategoria, index) => (
                    <li
                        key={index}
                        className={selectedKategoria === kategoria ? 'active-category' : ''}
                        onClick={() => handleCategoryClick(kategoria)}
                    >
                        {kategoria}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BooksListFilterPanel;