// frontend/src/components/BooksList/BooksListMainPanel/BooksListMainPanel.jsx
import React, { useEffect, useState } from "react";
import Book from "../Book/Book"; // Ścieżka do Book.jsx jest poprawna
import Pagination from '../../Pagination/Pagination'; // Ścieżka do Pagination.jsx jest poprawna
import BooksCarouselSection from "../../BooksCarousel/BooksCarouselSection";
import './BooksListMainPanel.css';

// Funkcja pomocnicza do transformacji danych książki z API na format oczekiwany przez komponent Book
const transformBookData = (bookItem) => {
    if (!bookItem) return null; // Zabezpieczenie przed pustym obiektem

    return {
        ...bookItem, // zachowaj wszystkie oryginalne pola
        id: bookItem.id, // Upewnij się, że ID jest zawsze dostępne
        title: bookItem.tytul, // Zmieniamy 'tytul' na 'title'
        author: bookItem.autor, // Zmieniamy 'autor' na 'author'
        price: bookItem.cena_promocyjna !== null && bookItem.cena_promocyjna !== undefined ? bookItem.cena_promocyjna : bookItem.cena, // Obsługa ceny promocyjnej
        okladka: bookItem.okladka, // Zapewniamy, że okładka jest dostępna
        rating: bookItem.recenzje_avg_ocena,
    };
};

const BooksListMainPanel = ({ selectedKategoria }) => {
    // Stany dla poszczególnych sekcji
    const [nowosci, setNowosci] = useState([]);
    const [bestsellery, setBestsellery] = useState([]);
    const [promocje, setPromocje] = useState([]);

    // Stan dla pełnej listy książek z paginacją
    const [allBooks, setAllBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);

    const [loadingMain, setLoadingMain] = useState(true);
    const [loadingAllBooks, setLoadingAllBooks] = useState(true);
    const [error, setError] = useState(null);

    // Funkcja do pobierania danych dla sekcji (nowości, bestsellery, promocje)
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
            // Transformujemy dane przed ustawieniem ich w stanie
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

    // Funkcja do pobierania pełnej listy książek z paginacją dla danej kategorii
    const fetchAllBooks = async (kategoria = null, page = 1) => {
        setLoadingAllBooks(true);
        setError(null);
        let url = `http://localhost:8000/api/ebooki-kategoria?page=${page}`; //
        if (kategoria) {
            url += `&kategoria=${encodeURIComponent(kategoria)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
            const data = await response.json();
            // Transformujemy dane z paginacji
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

    // Efekt, który uruchamia się przy zmianie kategorii lub strony paginacji
    useEffect(() => {
        setError(null); // Resetuj błąd przy każdej nowej operacji
        // Jeśli jest wybrana kategoria LUB jeśli jesteśmy na stronie 1 (dla sekcji głównych)
        if (selectedKategoria || currentPage === 1) {
            fetchMainSections(selectedKategoria);
        } else {
            // Jeśli jesteśmy na stronie > 1 i nie ma wybranej kategorii, czyścimy sekcje główne
            // (bo nie powinny być wyświetlane)
            setNowosci([]);
            setBestsellery([]);
            setPromocje([]);
        }

        // Zawsze pobieramy pełną listę książek
        fetchAllBooks(selectedKategoria, currentPage);

        // Ważne: przewiń do góry po zmianie strony lub kategorii, dla lepszego UX
        window.scrollTo(0, 0);

    }, [selectedKategoria, currentPage]); // Reaguj na zmiany kategorii i strony

    // Obsługa zmiany strony paginacji
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Komponent do renderowania siatki książek (aby unikać powtórzeń)
    const BooksGridSection = ({ title, books, loading }) => {
        if (loading) return <p>Ładowanie {title.toLowerCase()}...</p>;
        // Zabezpieczenie przed brakiem danych po transformacji
        if (!books || books.length === 0 || books.every(book => book === null)) return null; // Zwróć null, jeśli brak książek lub wszystkie są null

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
                        // Sprawdź, czy book nie jest null po transformacji
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
            {/* Wyświetl sekcje Nowości, Bestsellery, Promocje TYLKO na pierwszej stronie */}
            {currentPage === 1 && (
                <>
                    <BooksCarouselSection title={selectedKategoria ? `Nowości w kategorii ${selectedKategoria}` : "Nowości"} books={nowosci} loading={loadingMain} />
                    <BooksCarouselSection title={selectedKategoria ? `Bestsellery w kategorii ${selectedKategoria}` : "Bestsellery"} books={bestsellery} loading={loadingMain} />
                    <BooksCarouselSection title={selectedKategoria ? `Promocje w kategorii ${selectedKategoria}` : "Promocje"} books={promocje} loading={loadingMain} />
                </>
            )}

            {/* Pełna lista książek z paginacją (zawsze wyświetlana) */}
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