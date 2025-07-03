import React, { useEffect, useState } from "react";
import Book from "../Book/Book";
import Pagination from '../../Pagination/Pagination';
import BooksCarouselSection from "../../BooksCarousel/BooksCarouselSection";
import './BooksListMainPanel.css';

const transformBookData = (bookItem) => {
    if (!bookItem) return null;

    return {
        ...bookItem,
        id: bookItem.id,
        title: bookItem.tytul,
        author: bookItem.autor,
        price: bookItem.cena_promocyjna !== null && bookItem.cena_promocyjna !== undefined ? bookItem.cena_promocyjna : bookItem.cena,
        okladka: bookItem.okladka,
        rating: bookItem.recenzje_avg_ocena,
    };
};

const BooksListMainPanel = ({ selectedKategoria }) => {

    const [nowosci, setNowosci] = useState([]);
    const [bestsellery, setBestsellery] = useState([]);
    const [promocje, setPromocje] = useState([]);

    const [allBooks, setAllBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);

    const [loadingMain, setLoadingMain] = useState(true);
    const [loadingAllBooks, setLoadingAllBooks] = useState(true);
    const [error, setError] = useState(null);

    const fetchMainSections = async (kategoria = null) => {
        setLoadingMain(true);
        setError(null);
        let url = 'http://localhost:8000/api/strona-glowna'; //
        if (kategoria) {
            url += `?kategoria=${encodeURIComponent(kategoria)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
            const data = await response.json();
            setNowosci(data.nowosci.map(transformBookData));
            setBestsellery(data.bestsellery.map(transformBookData));
            setPromocje(data.promocje.map(transformBookData));
        } catch (err) {
            console.error("Błąd pobierania sekcji głównych:", err);
            setError("Nie udało się załadować głównych sekcji.");
        } finally {
            setLoadingMain(false);
        }
    };


    const fetchAllBooks = async (kategoria = null, page = 1) => {
        setLoadingAllBooks(true);
        setError(null);
        let url = `http://localhost:8000/api/ebooki-kategoria?page=${page}`;
        if (kategoria) {
            url += `&kategoria=${encodeURIComponent(kategoria)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
            const data = await response.json();

            setAllBooks(data.data.map(transformBookData));
            setCurrentPage(data.current_page);
            setLastPage(data.last_page);
            setTotalBooks(data.total);
        } catch (err) {
            console.error("Błąd pobierania wszystkich książek:", err);
            setError("Nie udało się załadować wszystkich książek.");
        } finally {
            setLoadingAllBooks(false);
        }
    };

    useEffect(() => {
        setError(null);
        if (selectedKategoria || currentPage === 1) {
            fetchMainSections(selectedKategoria);
        } else {
            setNowosci([]);
            setBestsellery([]);
            setPromocje([]);
        }

        fetchAllBooks(selectedKategoria, currentPage);

        window.scrollTo(0, 0);

    }, [selectedKategoria, currentPage]);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const BooksGridSection = ({ title, books, loading }) => {
        if (loading) return <p>Ładowanie {title.toLowerCase()}...</p>;
        if (!books || books.length === 0 || books.every(book => book === null)) return null;

        return (
            <section className="books-section" style={{ marginBottom: '40px' }}>
                <h2>{title}</h2>
                <div className="books-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '20px',
                    justifyContent: 'center',
                    padding: '20px 0'
                }}>
                    {books.map((book) => (
                        book ? <Book key={book.id} bookObj={book} /> : null
                    ))}
                </div>
            </section>
        );
    };

    if (error) {
        return <div className="panel" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Błąd: {error}</div>;
    }

    return (
        <div className="panel books-list-main-panel" style={{width: '100%'}}>
            {currentPage === 1 && (
                <>
                    <BooksCarouselSection title={selectedKategoria ? `Nowości w kategorii ${selectedKategoria}` : "Nowości"} books={nowosci} loading={loadingMain} />
                    <BooksCarouselSection title={selectedKategoria ? `Bestsellery w kategorii ${selectedKategoria}` : "Bestsellery"} books={bestsellery} loading={loadingMain} />
                    <BooksCarouselSection title={selectedKategoria ? `Promocje w kategorii ${selectedKategoria}` : "Promocje"} books={promocje} loading={loadingMain} />
                </>
            )}

            <section className="all-books-section">
                <h2>{selectedKategoria ? `Wszystkie ebooki w kategorii ${selectedKategoria}` : 'Wszystkie ebooki'}</h2>
                {loadingAllBooks ? <p>Ładowanie...</p> : (
                    <>
                        <div className="books-grid">
                            {allBooks.map(book => book ? <Book key={book.id} bookObj={book} /> : null)}
                        </div>
                        <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={handlePageChange} />
                    </>
                )}
            </section>
        </div>
    );
};

export default BooksListMainPanel;