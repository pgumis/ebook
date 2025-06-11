// frontend/src/components/VendorsBookList/VendorsBookList.jsx
import "./VendorsBookList.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Dodaj useSelector
import { viewActions } from "../../store/view";

const VendorsBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData); // <--- Pobierz dane użytkownika
  const userId = userData.id; // <--- ID zalogowanego użytkownika
  const userToken = userData.token; // <--- Token dla autoryzacji

  useEffect(() => {
    const pobierzKsiazki = async () => {
      if (!userId || !userToken) {
        // Sprawdź, czy użytkownik jest zalogowany i ma ID/token
        setLoading(false);
        console.warn(
          "Użytkownik nie jest zalogowany lub brak ID/tokenu. Nie można pobrać książek dostawcy."
        );
        return;
      }

      try {
        // *** Zmieniony endpoint API ***
        const response = await fetch(
          `http://localhost:8000/api/ebooki/dostawca/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`, // Dodaj nagłówek autoryzacji
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error(
              "Brak autoryzacji lub dostępu. Upewnij się, że token jest ważny i masz uprawnienia."
            );
            // Opcjonalnie: wyloguj użytkownika lub przekieruj na stronę logowania
          }
          throw new Error(`Błąd HTTP: ${response.status}`);
        }

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
        setBooks([]); // Wyczyść listę w przypadku błędu
      } finally {
        setLoading(false);
      }
    };

    pobierzKsiazki();
  }, [userId, userToken]); // <--- Dodaj userId i userToken do zależności useEffect

  const handleOpenBookDetails = (bookObj) => {
    dispatch(viewActions.changeView("bookDetails"));
    dispatch(viewActions.setBookDetailsObj(bookObj));
  };

  if (loading) {
    return <p>Ładowanie Twoich książek...</p>;
  }
  if (books.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h4>Nie masz jeszcze żadnych książek.</h4>
        <button
          className="vendors-book-list-add-new-book"
          onClick={() => {
            dispatch(viewActions.changeView("addBook"));
          }}
        >
          + Dodaj pierwszą książkę
        </button>
      </div>
    );
  }

  // Funkcja do formatowania daty
  const formatDate = (dateString) => {
    if (!dateString) return "Brak daty";
    const date = new Date(dateString);
    // Możesz dostosować format, np. 'pl-PL' dla polskiego formatu daty
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "aktywny":
        return "status-active";
      case "wycofany":
        return "status-withdrawn";
      case "oczekujący":
        return "status-pending";
      default:
        return "";
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Twoje książki</h4>
        <button
          className="vendors-book-list-add-new-book"
          onClick={() => {
            dispatch(viewActions.changeView("addBook"));
          }}
        >
          + Dodaj nową książkę
        </button>
      </div>
      <div style={{overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th>Lp.</th>
              <th>Tytuł</th>
              <th>Autor</th>
              <th>Kategoria</th>
              <th>Wydawnictwo</th>
              <th>ISBN</th>
              <th>Format</th>
              <th>Aktualna cena</th>
              <th>Średnia ocena</th>
              <th>Data dodania</th>
              <th>Ostatnia modyfikacja</th>
              <th>Status</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr
                key={book.id} // Zawsze dodawaj key do elementów w listach
                onClick={() => {
                  handleOpenBookDetails(book);
                }}
              >
                <td>{index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.format}</td>
                <td>{book.price} zł</td>
                <td>{book.rating}</td>{" "}
                {/* lub {generateStars(book.rating)} jeśli masz taką funkcję */}
                <td>{formatDate(book.created_at)}</td>
                <td>{formatDate(book.updated_at)}</td>
                <td>
                  <span className={getStatusClassName(book.status)}>
                    {book.status}
                  </span>
                </td>
                <td>
                  {/* Tutaj możesz dodać przyciski edycji/usuwania, które będą wywoływać osobne funkcje */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation(); /* handleDelete(book.id) */
                    }}
                  >
                    Wycofaj
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VendorsBookList;
