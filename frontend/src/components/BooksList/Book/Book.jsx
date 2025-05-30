import { useDispatch } from "react-redux";
import { viewActions } from "../../../store/view";
import generateStars from "../../../utils/generateStars";
import "./Book.css";

const titleSliced = (title) => {
  return title.slice(0, 25) + "...";
};
const handleOpenBookDetails = (dispatch, bookObj) => {
  //Ustawiam na view z detailsami i przekazuje id
  dispatch(viewActions.changeView("bookDetails"));
  dispatch(viewActions.setBookDetailsObj(bookObj));

}
const Book = ({ bookObj }) => {
  const dispatch = useDispatch();

  const title = bookObj.title.length >= 25 ? titleSliced(bookObj.title) : bookObj.title;
  return (
    <div className="book-wrapper">
      <div className="book-img-wrapper" onClick={()=>{handleOpenBookDetails(dispatch,bookObj)}}>
        <img src={bookObj.okladka} />
      </div>
      <div className="book-txt-content">
        <p className="book-price">{bookObj.price} PLN</p>
        <a className="book-title" href="#" onClick={()=>{handleOpenBookDetails(dispatch, bookObj)}}>{title}</a>
        <p className="book-author">{bookObj.author}</p>
        <div>{generateStars(bookObj.rating)}</div>
      </div>
    </div>
  );
};
export default Book;
