// src/components/HomePage/HomePageContent.jsx

import React, { useState } from 'react';
import BooksListFilterPanel from '../BooksList/BooksListFilterPanel/BooksListFilterPanel';
import BooksListMainPanel from '../BooksList/BooksListMainPanel/BooksListMainPanel';
import './HomePageContent.css'; // -> Importujemy nowy plik CSS

function HomePageContent() {
    const [selectedKategoria, setSelectedKategoria] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSelectCategory = (kategoria) => {
        setSelectedKategoria(kategoria);
        // Po wybraniu kategorii na mobilce, zawsze zamykaj menu
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        // Używamy klas CSS zamiast stylów inline dla lepszego zarządzania
        <div className="home-page-layout">

            {/* Przycisk hamburgera - widoczny tylko na mobilce */}
            <button className="hamburger-menu-btn" onClick={toggleMenu} aria-label="Otwórz menu kategorii">
                <i className="fas fa-bars"></i>
            </button>

            {/* Panel boczny z filtrem kategorii */}
            <aside className={`sidebar-panel ${isMenuOpen ? 'menu-open' : ''}`}>
                <BooksListFilterPanel
                    selectedKategoria={selectedKategoria}
                    onSelectCategory={handleSelectCategory}
                    onCloseMenu={() => setIsMenuOpen(false)} // Przekazujemy funkcję do zamykania
                />
            </aside>

            {/* Główny panel z listą ebooków */}
            <main className="content-panel">
                <BooksListMainPanel
                    selectedKategoria={selectedKategoria}
                />
            </main>

            {/* Nakładka przyciemniająca tło, gdy menu jest otwarte */}
            {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </div>
    );
}

export default HomePageContent;