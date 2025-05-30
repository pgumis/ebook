import { useEffect, useState } from "react";
import Book from "../Book/Book";

const BooksListMainPanel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pobierzKsiazki = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/ebooki"); 
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

  return (
    <div className="panel">
      <h3>Książki</h3>
      {loading ? (
        <p>Ładowanie książek...</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <Book key={book.id} bookObj={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksListMainPanel;
