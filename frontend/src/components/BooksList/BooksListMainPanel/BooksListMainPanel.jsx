<<<<<<< HEAD
import Book from "../Book/Book";
const BooksListMainPanel = () => {
  return (
    <div className="panel">
      <h3>Książki</h3>
      <div className="books-grid">
        <Book
          bookObj={{
            id: 1,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 3.5
          }}
        />
        <Book
          bookObj={{
            id: 2,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 4
          }}
        />
        <Book
          bookObj={{
            id: 3,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 5
          }}
        />
        <Book
          bookObj={{
            id: 4,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 4.3
          }}
        />
        <Book
          bookObj={{
            id: 5,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 2.1
          }}
        />
        <Book
          bookObj={{
            id: 6,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 5
          }}
        />
        <Book
          bookObj={{
            id: 7,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 3
          }}
        />
        <Book
          bookObj={{
            id: 8,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 1
          }}
        />
        <Book
          bookObj={{
            id: 9,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 2
          }}
        />
        <Book
          bookObj={{
            id: 10,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 4
          }}
        />
        <Book
          bookObj={{
            id: 11,
            title: "Harry Potter i Kamień Filozoficzny",
            author: "J.K Rowling",
            price: "35.99",
            rating: 3.34
          }}
        />
      </div>
    </div>
  );
};
=======
import { useEffect, useState } from "react";
import Book from "../Book/Book";

const BooksListMainPanel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pobierzKsiazki = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/ebooki"); // <- dostosuj jeśli inny endpoint
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
  console.log(books);

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

>>>>>>> mb
export default BooksListMainPanel;
