import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../../store/cart';
import { viewActions } from '../../store/view';

import Rating from '../Rating/Rating';
import ReviewForm from '../Rating/ReviewForm';
import './BookDetails.css';
import generateStars from '../../utils/generateStars';
import BooksListFilterPanel from '../BooksList/BooksListFilterPanel/BooksListFilterPanel';

const BookDetails = () => {
  const dispatch = useDispatch();
  const selectedBook = useSelector((state) => state.view.bookDetailsObj);
  const selectedCategory = useSelector(state => state.view.selectedCategory);
  const { token, loggedIn, role, id: userId } = useSelector((state) => state.userData);
  const cartItems = useSelector((state) => state.cart.items);
  const isInCart = selectedBook ? cartItems.some(item => item.id === selectedBook.id) : false;


  const privilegedRoles = ['dostawca', 'admin', 'wlasciciel'];
  const shouldShowCategorySidebar = !privilegedRoles.includes(role);
  // Stany dla recenzji
  const [recenzje, setRecenzje] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Stan przechowujący informację, czy użytkownik może dodać recenzję
  const [mozeRecenzowac, setMozeRecenzowac] = useState(false);
  const [loadingCanReview, setLoadingCanReview] = useState(true);

  // Stan do kontrolowania widoczności formularza
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Stan dla komunikatu o koszyku
  const [cartMessage, setCartMessage] = useState('');


  const handleCategorySelect = (kategoria) => {
    // 1. Ustaw wybraną kategorię w Reduxie
    dispatch(viewActions.setSelectedCategory(kategoria));
    // 2. Przełącz widok z powrotem na stronę główną
    dispatch(viewActions.changeView('home'));
  };

  // --- POBIERANIE DANYCH ---
  const fetchInitialData = useCallback(async () => {
    if (!selectedBook?.id) return;

    setLoadingReviews(true);
    setLoadingCanReview(true);

    // 1. Pobieranie listy recenzji (publiczne)
    const fetchReviewsPromise = fetch(`http://localhost:8000/api/ebooki/${selectedBook.id}/recenzje`)
        .then(res => {
          if (!res.ok) throw new Error('Błąd pobierania recenzji');
          return res.json();
        });

    // 2. Sprawdzanie uprawnień do recenzowania (tylko dla zalogowanych)
    const checkCanReviewPromise = loggedIn && token
        ? fetch(`http://localhost:8000/api/recenzje/sprawdz/${selectedBook.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }).then(res => {
          if (!res.ok) throw new Error('Błąd sprawdzania uprawnień');
          return res.json();
        })
        : Promise.resolve({ mozeRecenzowac: false });

    try {
      // Wykonaj oba zapytania równolegle
      const [reviewsData, canReviewData] = await Promise.all([fetchReviewsPromise, checkCanReviewPromise]);

      setRecenzje(reviewsData || []);
      setMozeRecenzowac(canReviewData.mozeRecenzowac);

    } catch (error) {
      console.error("Błąd podczas ładowania danych:", error);
    } finally {
      setLoadingReviews(false);
      setLoadingCanReview(false);
    }
  }, [selectedBook?.id, loggedIn, token]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);


  // --- OBSŁUGA AKCJI ---
  const handleReviewAdded = (nowaRecenzja) => {
    setRecenzje(aktualnaLista => [nowaRecenzja, ...aktualnaLista]);
    setIsFormVisible(false); // Zamknij formularz po dodaniu
    setMozeRecenzowac(false); // Użytkownik już nie może dodać kolejnej
  };

  const handleAddToCart = async () => {
    if (!loggedIn) {
      // Można by tu też dispatchować akcję otwarcia modalu logowania
      setCartMessage("Musisz być zalogowany, aby dodać produkt.");
      return;
    }

    setCartMessage('Dodawanie do koszyka...');

    try {
      await dispatch(cartActions.addItemToCart({ token: token, bookData: selectedBook })).unwrap();

      setCartMessage('Dodano pomyślnie!');

      setTimeout(() => {
        setCartMessage('');
      }, 3000);

    } catch (error) {
      setCartMessage(`Błąd: ${error || 'Nie udało się dodać produktu.'}`);
    }
  };


  // --- RENDEROWANIE ---
  if (!selectedBook) {
    return <div className="panel">Wybierz książkę, aby zobaczyć szczegóły.</div>;
  }

  return (

      <div className={shouldShowCategorySidebar ? "book-details-layout-with-sidebar" : "book-details-layout-full"}>

        {/* === LEWA KOLUMNA: PANEL KATEGORII === */}
        {shouldShowCategorySidebar && (
            <aside className="details-sidebar-panel">
              <BooksListFilterPanel
                  selectedKategoria={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                  onCloseMenu={() => {}}
              />
            </aside>
        )}

        {/* === PRAWA KOLUMNA: CAŁA ZAWARTOŚĆ SZCZEGÓŁÓW TWOJEJ KSIĄŻKI === */}
        <main className="details-main-content">

          {privilegedRoles.includes(role) && (
              <div className="back-to-panel-container">
                <button
                    onClick={() => dispatch(viewActions.changeView('home'))}
                    className="back-to-panel-btn"
                >
                  <i className="fas fa-arrow-left"></i> Wróć do panelu
                </button>
              </div>
          )}
          <div className="book-details-wrapper panel">
            {/* --- SEKCJA GÓRNA: ZDJĘCIE + INFORMACJE --- */}
            <div className="book-details-main-info">
              <div className="book-details-img-container">
                <img src={selectedBook.okladka} alt={`Okładka ${selectedBook.tytul}`} className="book-details-img" />
              </div>

              <div className="book-details-right-panel">
                <div className="book-details-main-text">
                  <p className="book-details-title">{selectedBook.tytul}</p>
                  <p className="book-details-author">{selectedBook.autor}</p>
                  <div className="book-details-rating">
                    {generateStars(selectedBook.rating)}
                    <span className="book-details-rating-value">{ !isNaN(parseFloat(selectedBook.rating))
                        ? `(${parseFloat(selectedBook.rating).toFixed(1)})`
                        : '(Brak ocen)'
                    }</span>
                  </div>
                  <p className="book-details-price">{selectedBook.cena} zł</p>
                  {selectedBook.format && <p className="book-format">{selectedBook.format.toUpperCase()}</p>}
                </div>

                <div className="book-details-actions">
                  {role !== 'dostawca' ? (
                      <>
                        <button className="book-details-add-book" disabled={!loggedIn || isInCart} onClick={handleAddToCart}>
                          {isInCart ? 'Produkt w koszyku' : 'Dodaj do koszyka'}
                        </button>
                        {cartMessage && <p className="cart-message">{cartMessage}</p>}
                      </>
                  ) : (
                      <button className="book-details-add-book" onClick={() => dispatch(viewActions.changeView("editBookDetails"))}>
                        Edytuj informacje
                      </button>
                  )}
                </div>
              </div>
            </div>

            {/* --- SEKCJA DOLNA: OPIS + RECENZJE --- */}
            <div className="book-details-bottom-content">
              <div className="book-details-description">
                <h3>Opis książki</h3>
                <p>{selectedBook.opis || "Ta książka nie ma jeszcze opisu."}</p>
              </div>

              <div className="book-details-ratings-container">
                <div className="book-details-rating-top-section">
                  <h3>Opinie użytkowników ({recenzje.length})</h3>
                  {!loadingCanReview && mozeRecenzowac && (
                      <button onClick={() => setIsFormVisible(!isFormVisible)} className="add-review-btn">
                        {isFormVisible ? '− Anuluj' : '+ Napisz recenzję'}
                      </button>
                  )}
                </div>

                <div className={`review-form-container ${isFormVisible ? 'form-visible' : ''}`}>
                  <ReviewForm
                      ebookId={selectedBook.id}
                      onReviewAdded={handleReviewAdded}
                  />
                </div>

                <div className="book-details-users-rating-wrapper">
                  {loadingReviews ? <p>Ładowanie recenzji...</p> : (
                      recenzje.length > 0 ? (
                          recenzje.map((recenzja, index) => {
                            let authorName = "Ty";
                            if (recenzja.uzytkownik && recenzja.uzytkownik.imie && recenzja.uzytkownik.nazwisko) {
                              const pierwszaLiteraNazwiska = recenzja.uzytkownik.nazwisko.charAt(0).toUpperCase();
                              authorName = `${recenzja.uzytkownik.imie} ${pierwszaLiteraNazwiska}.`;
                            }
                            return (
                                <Rating
                                    key={recenzja.id || index}
                                    ratingObj={{
                                      author: authorName,
                                      rating: recenzja.ocena,
                                      date: new Date(recenzja.created_at).toLocaleDateString("pl-PL"),
                                      text: recenzja.tresc
                                    }}
                                />
                            );
                          })
                      ) : (
                          <p>Brak recenzji dla tej książki.</p>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

      </div>
  );
};

export default BookDetails;