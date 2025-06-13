// frontend/src/components/VendorsBookList/VendorsBookList.jsx
import "./VendorsBookList.css";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewActions } from "../../store/view";

const VendorsBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  // --- NOWY STAN DO FILTROWANIA ---
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const userId = userData.id;
  const userToken = userData.token;

  useEffect(() => {
    const pobierzKsiazki = async () => {
      if (!userId || !userToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/ebooki/dostawca/${userId}`, {
          headers: { 'Authorization': `Bearer ${userToken}` } //
        });
        if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
        const dane = await response.json();
        setBooks(
            dane.map((item) => ({
              ...item,
              title: item.tytul,
              author: item.autor,
              category: item.kategoria,
              publisher: item.wydawnictwo,
              isbn: item.isbn,
              format: item.format,
              price: item.cena_promocyjna || item.cena,
              rating: item.ocena,
              status: item.status,
            }))
        );
      } catch (error) {
        console.error("Błąd przy pobieraniu książek dostawcy:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    pobierzKsiazki();
  }, [userId, userToken]);

  const filteredBooks = useMemo(() => {
    return books
        .filter(book => { // Filtr statusu
          return statusFilter === 'all' || book.status === statusFilter;
        })
        .filter(book => { // Filtr wyszukiwania (tytuł lub autor)
          const term = searchTerm.toLowerCase();
          return book.tytul.toLowerCase().includes(term) || book.autor.toLowerCase().includes(term);
        })
        .filter(book => { // Filtr ceny "od"
          return priceFrom === '' || book.price >= parseFloat(priceFrom);
        })
        .filter(book => { // Filtr ceny "do"
          return priceTo === '' || book.price <= parseFloat(priceTo);
        });
  }, [books, statusFilter, searchTerm, priceFrom, priceTo]);

  // --- NOWA FUNKCJA DO WYCOFYWANIA KSIĄŻKI ---
  const handleWithdraw = async (e, bookId) => {
    e.stopPropagation(); // Zapobiega otwarciu szczegółów książki po kliknięciu przycisku

    if (window.confirm('Czy na pewno chcesz wycofać tę książkę? Zostanie ona ukryta w sklepie, ale zachowana w panelu.')) {
      try {
        const response = await fetch(`http://localhost:8000/api/ebooki/${bookId}/wycofaj`, {
          method: 'PUT', //
          headers: {
            'Authorization': `Bearer ${userToken}`, //
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Wycofanie książki nie powiodło się.');
        }

        // Aktualizuj status książki w stanie lokalnym dla natychmiastowego efektu
        setBooks(prevBooks =>
            prevBooks.map(book =>
                book.id === bookId ? { ...book, status: 'wycofany' } : book
            )
        );
        alert('Książka została pomyślnie wycofana.');

      } catch (error) {
        console.error("Błąd podczas wycofywania książki:", error);
        alert(error.message);
      }
    }
  };

  // --- NOWA FUNKCJA DO EDYCJI (PRZYGOTOWANIE POD PRZYSZŁY WIDOK) ---
  const handleEdit = (e, book) => {
    e.stopPropagation();
    console.log("Przekierowanie do edycji książki:", book);
    handleOpenBookDetails(book);
  };

  const handleOpenBookDetails = (bookObj) => {
    dispatch(viewActions.changeView("bookDetails"));
    dispatch(viewActions.setBookDetailsObj(bookObj));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Brak daty';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'aktywny': return 'status-active';
      case 'wycofany': return 'status-withdrawn';
      case 'oczekujący': return 'status-pending';
      default: return '';
    }
  };

  if (loading) return <p>Ładowanie Twoich książek...</p>;

  if (books.length === 0 && !loading) {
    return (
        <div className="empty-list-container">
          <h4>Nie masz jeszcze żadnych książek.</h4>
          <button className="vendors-book-list-add-new-book" onClick={() => { dispatch(viewActions.changeView("addBook")); }}>
            + Dodaj pierwszą książkę
          </button>
        </div>
    );
  }


  return (
      <div className="vendors-book-list-wrapper">
        <div className="list-header">
          <h4>Twoje książki ({filteredBooks.length})</h4>
          <button className="vendors-book-list-add-new-book" onClick={() => dispatch(viewActions.changeView("addBook"))}>
            + Dodaj nową książkę
          </button>
        </div>

        {/* --- NOWY PANEL FILTRÓW --- */}
        <div className="filters-bar">
          <div className="filter-input-group search-filter">
            <i className="fas fa-search"></i>
            <input
                type="text"
                placeholder="Szukaj po tytule lub autorze..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-input-group">
            <label htmlFor="status-filter">Status:</label>
            <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Wszystkie</option>
              <option value="aktywny">Aktywne</option>
              <option value="oczekujący">Oczekujące</option>
              <option value="wycofany">Wycofane</option>
            </select>
          </div>
          <div className="filter-input-group">
            <label htmlFor="price-from">Cena od:</label>
            <input id="price-from" type="number" placeholder="np. 10" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} />
          </div>
          <div className="filter-input-group">
            <label htmlFor="price-to">Cena do:</label>
            <input id="price-to" type="number" placeholder="np. 50" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
            <tr>
              <th>Lp.</th>
              <th>Tytuł</th>
              <th>Autor</th>
              <th>Cena</th>
              <th>Status</th>
              <th>Data dodania</th>
              <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {filteredBooks.map((book, index) => (
                <tr key={book.id} onClick={() => { handleOpenBookDetails(book); }}>
                  <td>{index + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.price} zł</td>
                  <td><span className={`status-badge ${getStatusClassName(book.status)}`}>{book.status}</span></td>
                  <td>{formatDate(book.created_at)}</td>
                  <td className="actions-cell">
                    {/* --- NOWE PRZYCISKI AKCJI --- */}
                    <button className="btn-action btn-edit" onClick={(e) => handleEdit(e, book)}>Edytuj</button>
                    {book.status !== 'wycofany' && (
                        <button className="btn-action btn-withdraw" onClick={(e) => handleWithdraw(e, book.id)}>Wycofaj</button>
                    )}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
              <p className="no-results-info">Brak książek spełniających wybrane kryteria.</p>
          )}
        </div>
      </div>
  );
};

export default VendorsBookList;