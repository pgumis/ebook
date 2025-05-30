import "./VendorsBookList.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
const VendorsBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const pobierzKsiazki = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/ebooki"); // WSZYSTKIE EBOOKI A NIE AUTORA!
        const dane = await response.json();
        setBooks(
          dane.map((item) => ({
            ...item,
            title: item.tytul,
            author: item.autor,
            price: item.cena_promocyjna || item.cena,
            rating: 4,
          }))
        );
      } catch (error) {
        console.error("Błąd przy pobieraniu książek:", error);
      } finally {
        setLoading(false);
      }
    };

    pobierzKsiazki();
  }, []);
  const handleOpenBookDetails = (bookObj) => {
    dispatch(viewActions.changeView("bookDetails"));
    dispatch(viewActions.setBookDetailsObj(bookObj));
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Twoje książki</h4>
        <button className="vendors-book-list-add-new-book">
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
            <th>Dostępne formaty</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              onClick={() => {
                handleOpenBookDetails(book);
              }}
            >
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.price}</td>
              <td>{book.rating}</td>
              <td>{book.format}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default VendorsBookList;
