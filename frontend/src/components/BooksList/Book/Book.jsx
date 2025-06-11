import { useDispatch } from "react-redux";
import { viewActions } from "../../../store/view";
import { cartActions } from "../../../store/cart"; // Importujemy akcje koszyka
import generateStars from "../../../utils/generateStars";
import "./Book.css";
import { useRef } from "react";

// Funkcja pomocnicza do skracania tytułu pozostaje bez zmian
const titleSliced = (title) => {
    return title.slice(0, 25) + "...";
};

const Book = ({ bookObj }) => {
    const dispatch = useDispatch();
    const title = bookObj.title.length >= 25 ? titleSliced(bookObj.title) : bookObj.title;

    // --- Logika nawigacji i dodawania do koszyka ---
    const handleOpenBookDetails = () => {
        dispatch(viewActions.changeView("bookDetails"));
        dispatch(viewActions.setBookDetailsObj(bookObj));
    };

    const handleAddToCart = (e) => {
        // Zatrzymujemy propagację, aby kliknięcie przycisku
        // nie uruchomiło przejścia do szczegółów książki. To bardzo ważne!
        e.stopPropagation();
        dispatch(cartActions.addItem({ ...bookObj, quantity: 1 }));
        // Można dodać jakieś powiadomienie "Dodano!"
        console.log(`Dodano do koszyka: ${bookObj.title}`);
    };

    // Logika do rozróżniania kliknięcia od przeciągania w karuzeli
    const isDragging = useRef(false);
    const startX = useRef(0);
    const handleMouseDown = (e) => {
        isDragging.current = false;
        startX.current = e.clientX;
    };
    const handleMouseMove = (e) => {
        if (Math.abs(e.clientX - startX.current) > 5) {
            isDragging.current = true;
        }
    };
    const handleClick = () => {
        if (!isDragging.current) {
            handleOpenBookDetails();
        }
    };

    return (
        <div
            className="book-wrapper"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            title={bookObj.title} // Tooltip z pełnym tytułem
        >
            <div className="book-img-wrapper">
                <img src={bookObj.okladka} alt={`Okładka ${title}`} />
            </div>
            <div className="book-txt-content">
                <div className="book-info">
                    <p className="book-title">{title}</p>
                    <p className="book-author">{bookObj.author}</p>
                    <div className="book-rating">
                        {generateStars(bookObj.rating)}
                        {bookObj.rating > 0 && (
                            <span className="book-rating-value">
                                ({bookObj.rating.toFixed(1)})
                            </span>
                        )}
                    </div>
                </div>
                <div className="book-footer">
                    <p className="book-price">{bookObj.price} zł</p>
                    {/* Ten przycisk będzie widoczny tylko po najechaniu myszką (dzięki CSS) */}
                    <button className="book-add-to-cart-btn" onClick={handleAddToCart}>
                        <i className="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Book;