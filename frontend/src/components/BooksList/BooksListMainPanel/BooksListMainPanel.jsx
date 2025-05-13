import Book from "../Book/Book";
const BooksListMainPanel = () => {
  return (
    <div className="panel">
      <h3>
        Książki
      </h3>
      <div className="books-grid">
        <Book bookObj={{id:1,title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
        <Book bookObj={{title:'Harry Potter i Kamień Filozoficzny',author: 'J.K Rowling'}}/>
            
      </div>
    </div>
  );
};
export default BooksListMainPanel;
