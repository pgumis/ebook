// src/components/SearchOverlay/SearchOverlay.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewActions } from '../../store/view';
import './SearchOverlay.css';

// Prosty hook do opóźniania wykonania funkcji (debounce)
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const SearchOverlay = () => {
    const dispatch = useDispatch();
    const isVisible = useSelector(state => state.view.isSearchOverlayVisible);

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        kategoria: 'all',
        format: 'all',
        cena_min: '',
        cena_max: ''
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [kategorie, setKategorie] = useState([]);

    const debouncedSearchTerm = useDebounce(searchTerm, 300); // Czekaj 300ms po zaprzestaniu pisania

    useEffect(() => {
        const fetchKategorie = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/kategorie');
                const data = await response.json();
                setKategorie(data);
            } catch (error) {
                console.error("Nie udało się pobrać kategorii", error);
            }
        };
        if(isVisible) {
            fetchKategorie();
        }
    }, [isVisible]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClose = useCallback(() => {
        dispatch(viewActions.toggleSearchOverlay(false));
    }, [dispatch]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    useEffect(() => {
        const hasActiveFilters = filters.kategoria !== 'all' || filters.format !== 'all' || filters.cena_min || filters.cena_max;
        if (debouncedSearchTerm.length < 2 && !hasActiveFilters) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            const params = new URLSearchParams({ sort_by: sortBy });
            if (debouncedSearchTerm.length >= 2) params.append('term', debouncedSearchTerm);
            if (filters.kategoria !== 'all') params.append('kategoria', filters.kategoria);
            if (filters.format !== 'all') params.append('format', filters.format);
            if (filters.cena_min) params.append('cena_min', filters.cena_min);
            if (filters.cena_max) params.append('cena_max', filters.cena_max);

            try {
                const response = await fetch(`http://localhost:8000/api/wyszukiwanie?${params.toString()}`);
                const data = await response.json();
                setResults(data);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchResults();
    }, [debouncedSearchTerm, filters, sortBy]);

    const handleResultClick = (book) => {
        handleClose();
        dispatch(viewActions.setBookDetailsObj(book));
        dispatch(viewActions.changeView('bookDetails'));
    };

    if (!isVisible) return null;

    return (
        <div className="search-overlay-backdrop" onClick={handleClose}>
            <div className="search-overlay-content" onClick={(e) => e.stopPropagation()}>
                <button className="search-overlay-close-btn" onClick={handleClose}>&times;</button>
                <div className="search-input-wrapper">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Czego szukasz?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="search-filters-bar">
                    <div className="filter-group">
                        <label>Kategoria:</label>
                        <select name="kategoria" value={filters.kategoria} onChange={handleFilterChange}>
                            <option value="all">Wszystkie</option>
                            {kategorie.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Format:</label>
                        <select name="format" value={filters.format} onChange={handleFilterChange}>
                            <option value="all">Wszystkie</option>
                            <option value="PDF">PDF</option> <option value="EPUB">EPUB</option> <option value="MOBI">MOBI</option>
                        </select>
                    </div>
                    <div className="filter-group price-filter">
                        <label>Cena:</label>
                        <div className="price-inputs-row"> {/* <-- NOWY DIV OPAKOWUJĄCY */}
                            <input type="number" name="cena_min" placeholder="Od" value={filters.cena_min} onChange={handleFilterChange} />
                            <span>-</span>
                            <input type="number" name="cena_max" placeholder="Do" value={filters.cena_max} onChange={handleFilterChange} />
                        </div>
                    </div>
                    <div className="filter-group sort-filter">
                        <label>Sortuj:</label>
                        <select name="sort_by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="relevance">Trafność</option>
                            <option value="latest">Najnowsze</option>
                            <option value="price_asc">Cena: Rosnąco</option>
                            <option value="price_desc">Cena: Malejąco</option>
                        </select>
                    </div>
                </div>
                <div className="search-results-wrapper">
                    {loading && <p>Wyszukiwanie...</p>}
                    {!loading && debouncedSearchTerm.length > 1 && results.length === 0 && <p>Brak wyników dla "{debouncedSearchTerm}"</p>}
                    {results.map(book => (
                        <div key={book.id} className="search-result-item" onClick={() => handleResultClick(book)}>
                            <img src={book.okladka} alt={book.tytul} />
                            <div className="result-info">
                                <strong>{book.tytul}</strong>
                                <span>{book.autor}</span>
                            </div>
                            <span className="result-price">{parseFloat(book.cena).toFixed(2)} zł</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;