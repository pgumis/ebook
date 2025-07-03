import React, { useState } from 'react';
import BooksListFilterPanel from '../BooksList/BooksListFilterPanel/BooksListFilterPanel';
import BooksListMainPanel from '../BooksList/BooksListMainPanel/BooksListMainPanel';
import './HomePageContent.css';
import { viewActions } from '../../store/view';
import { useSelector, useDispatch } from 'react-redux';

function HomePageContent() {
    const dispatch = useDispatch();
    const selectedKategoria = useSelector(state => state.view.selectedCategory);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSelectCategory = (kategoria) => {
        dispatch(viewActions.setSelectedCategory(kategoria));
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="home-page-layout">

            <button className="hamburger-menu-btn" onClick={toggleMenu} aria-label="Otwórz menu kategorii">
                <i className="fas fa-bars"></i>
            </button>

            <aside className={`sidebar-panel ${isMenuOpen ? 'menu-open' : ''}`}>
                <BooksListFilterPanel
                    selectedKategoria={selectedKategoria}
                    onSelectCategory={handleSelectCategory}
                    onCloseMenu={() => setIsMenuOpen(false)}
                />
            </aside>

            <main className="content-panel">
                <BooksListMainPanel
                    selectedKategoria={selectedKategoria}
                />
            </main>

            {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </div>
    );
}

export default HomePageContent;