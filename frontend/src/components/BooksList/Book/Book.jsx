import { useDispatch } from "react-redux";
import { viewActions } from "../../../store/view";
import generateStars from "../../../utils/generateStars";
import "./Book.css";
import { useRef } from "react";

const titleSliced = (title) => {
    return title.slice(0, 25) + "...";
};

const handleOpenBookDetails = (dispatch, bookObj) => {
    dispatch(viewActions.changeView("bookDetails"));
    dispatch(viewActions.setBookDetailsObj(bookObj));
};

const Book = ({ bookObj }) => {
    const dispatch = useDispatch();
    const title = bookObj.title.length >= 25 ? titleSliced(bookObj.title) : bookObj.title;

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
            handleOpenBookDetails(dispatch, bookObj);
        }
    };

    return (
        <div
            className="book-wrapper"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            <div className="book-img-wrapper">
                <img src={bookObj.okladka} />
            </div>
            <div className="book-txt-content">
                <p className="book-price">{bookObj.price} PLN</p>
                <a className="book-title" href="#" onClick={(e) => e.preventDefault()}>{title}</a>
                <p className="book-author">{bookObj.author}</p>
                <div>{generateStars(bookObj.rating)}</div>
            </div>
        </div>
    );
};

export default Book;
