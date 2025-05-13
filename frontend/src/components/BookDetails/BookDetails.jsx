import "./BookDetails.css";
import { useSelector } from "react-redux";

//fetch
const data = {
  id: 1,
  title: "Harry Potter i Kamień Filozoficzny",
  author: "J.K Rowling",
  price: "32.99zł",
};

const BookDetails = () => {
  const view = useSelector((state) => state.view);
  const selectedBookId = view.bookDetailsId;

  return (
    <div className="book-details-wrapper panel">
      <div className="book-details-img-container">
        <img src="okladka1.jpg" alt="okładka" className="book-details-img" />
      </div>
      <div className="book-details-info-container">
        <p>{data.title}</p>
        <p>{data.author}</p>
        <p>{data.price}</p>
      </div>
    </div>
  );
};
export default BookDetails;
