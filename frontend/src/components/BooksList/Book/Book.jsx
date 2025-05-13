import { useDispatch } from "react-redux";
import { viewActions } from "../../../store/view";

import "./Book.css";
const generateStars = (rating) => {
  let orangeStars = "";
  let greyStars = "";
  for (let i = rating; i > 0; i--) {
    if (i < 1) {
      orangeStars += "⯪";
    } else {
      orangeStars += "★";
    }
  }
  for (let i = 5 - orangeStars.length; i > 0; i--) {
    greyStars += "★";
  }
  return (
    <span style={{ fontWeight: "bold", letterSpacing: "5px", color: "orange" }}>
      {orangeStars}
      <span style={{ color: "lightgray" }}>{greyStars}</span>
    </span>
  );
};
const titleSliced = (title) => {
  return title.slice(0, 25) + "...";
};
const handleOpenBookDetails = (dispatch,id) => {
  //Ustawiam na view z detailsami i przekazuje id
  dispatch(viewActions.changeView("bookDetails"));
  dispatch(viewActions.setBookDetailsId(id));

}
const Book = ({ bookObj }) => {
  const dispatch = useDispatch();
  const rating = generateStars(3.2);
  const title = titleSliced(bookObj.title);
  return (
    <div className="book-wrapper">
      <div className="book-img-wrapper" onClick={()=>{handleOpenBookDetails(dispatch,bookObj.id)}}>
        <img src="okladka1.jpg" />
      </div>
      <div className="book-txt-content">
        <p className="book-price">32.99 zł</p>
        <a className="book-title" href="#" onClick={()=>{handleOpenBookDetails(dispatch,bookObj.id)}}>{title}</a>
        <p className="book-author">{bookObj.author}</p>
        {rating}
      </div>
    </div>
  );
};
export default Book;
