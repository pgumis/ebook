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
      if (!userId || !userToken) { // Sprawdź, czy użytkownik jest zalogowany i ma ID/token
        setLoading(false);
        console.warn("Użytkownik nie jest zalogowany lub brak ID/tokenu. Nie można pobrać książek dostawcy.");
        return;
      }

      try {
        // *** Zmieniony endpoint API ***
        const response = await fetch(`http://localhost:8000/api/ebooki/dostawca/${userId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}` // Dodaj nagłówek autoryzacji
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error("Brak autoryzacji lub dostępu. Upewnij się, że token jest ważny i masz uprawnienia.");
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
              price: item.cena_promocyjna || item.cena,
              rating: 4, // Możesz pobierać prawdziwą ocenę z backendu
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
        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "center" }}>
          <h4>Nie masz jeszcze żadnych książek.</h4>
          <button className="vendors-book-list-add-new-book" onClick={()=>{ dispatch(viewActions.changeView("addBook"));}}>
            + Dodaj pierwszą książkę
          </button>
        </div>
    );
  }

  return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Twoje książki</h4>
          <button className="vendors-book-list-add-new-book" onClick={()=>{ dispatch(viewActions.changeView("addBook"));}}>
            + Dodaj nową książkę
          </button>
        </div>

        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Tytuł</th>
            <th>Cena</th>
            <th>Śr. ocena</th>

            <th>Akcje</th> {/* Dodaj kolumnę na akcje, np. edycję/usuwanie */}
          </tr>
          </thead>
          <tbody>
          {books.map((book) => (
              <tr
                  key={book.id} // Zawsze dodawaj key do elementów w listach
                  onClick={() => {
                    handleOpenBookDetails(book);
                  }}
              >
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.price} PLN</td> {/* Dodaj PLN */}
                <td>{book.rating}</td> {/* lub {generateStars(book.rating)} jeśli masz taką funkcję */}

                <td>
                  {/* Tutaj możesz dodać przyciski edycji/usuwania, które będą wywoływać osobne funkcje */}
                  <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); /* handleDelete(book.id) */ }}>Wycofaj</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </>
  );
};

export default VendorsBookList;