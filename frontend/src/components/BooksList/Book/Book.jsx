import { useDispatch, useSelector } from "react-redux";
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
    const userData = useSelector(state => state.userData);
    const cartItems = useSelector(state => state.cart.items);
    const isInCart = cartItems.some(item => item.id === bookObj.id);

    const title = bookObj.title.length >= 25 ? titleSliced(bookObj.title) : bookObj.title;

    // --- Logika nawigacji i dodawania do koszyka ---
    const handleOpenBookDetails = () => {
        dispatch(viewActions.changeView("bookDetails"));
        dispatch(viewActions.setBookDetailsObj(bookObj));
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!userData.token) return alert("Musisz być zalogowany.");
        // -> UŻYWAMY POPRAWNEJ AKCJI ASYNCHRONICZNEJ
        dispatch(cartActions.addItemToCart({ token: userData.token, bookData: bookObj }));
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

    const ratingValue = parseFloat(bookObj.rating);
    const hasRating = !isNaN(ratingValue) && ratingValue > 0;

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
                        {generateStars(ratingValue)}
                        {hasRating && (
                            <span className="book-rating-value">
                                ({ratingValue.toFixed(1)})
                            </span>
                        )}
                    </div>
                </div>
                <div className="book-footer">
                    <p className="book-price">{parseFloat(bookObj.price).toFixed(2)} zł</p>
                    {}
                    <button className="book-add-to-cart-btn" onClick={handleAddToCart}
                            disabled={isInCart}
                            title={isInCart ? "Produkt już jest w koszyku" : "Dodaj do koszyka"}
                    >{}
                        <i className={isInCart ? "fas fa-check" : "fas fa-cart-plus"}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Book;