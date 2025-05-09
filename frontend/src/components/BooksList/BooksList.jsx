import BooksListFilterPanel from "./BooksListFilterPanel/BooksListFilterPanel";
import BooksListMainPanel from "./BooksListMainPanel/BooksListMainPanel";
import './BooksList.css';
const BooksList = () => {
    return <div className="book-list-grid">
        <BooksListFilterPanel />
        <BooksListMainPanel />
    </div>
}
export default BooksList;