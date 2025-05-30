import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './VendorEditBookDetails.css';
const VendorEditBookDetails = () => {
  const view = useSelector((state) => state.view);

  const selectedBook = view.bookDetailsObj;
  const [dane, setDane] = useState({
    tytul:'',
    autor:'',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [bookFile, setBookFile] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "telefon") {
      const inputChar = e.nativeEvent.data;
      if (inputChar && !/[\d\+]/.test(inputChar)) {
        return;
      }
      if (
        inputChar === "+" &&
        (dane.telefon.includes("+") || dane.telefon.length > 0)
      ) {
        return;
      }
    }
    setDane({ ...dane, [e.target.name]: e.target.value });
  };
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/jpeg") setCoverImage(file);
    else alert("Proszę przesłać plik w formacie .jpg");
  };
  const handleBookChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/epub+zip" || file.name.endsWith(".epub"))) setBookFile(file);
    else alert("Proszę przesłać plik w formacie .epub");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dane.tytul || !dane.autor) {
      alert("Wypełnij wymagane pola (tytuł i autor).");
      return;
    }
    return;
  };
  console.log(selectedBook);
  return (
    <div className="panel vendor-edit-book-details-wrapper">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tytuł:</label>
          <input type="text" value={selectedBook.tytul} onChange={handleChange} />
        </div>
        <div>
          <label>Autor:</label>
          <input type="text" value={selectedBook.autor} onChange={handleChange} />
        </div>
        <div>
          <label>Nowa okładka (.jpg, opcjonalne):</label>
          <input type="file" accept=".jpg" onChange={handleCoverChange} />
        </div>
        <div>
          <label>Nowy plik książki (.epub, opcjonalne):</label>
          <input type="file" accept=".epub" onChange={handleBookChange} />
        </div>
        <button type="submit">Zapisz zmiany</button>
      </form>
    </div>
  );
};
export default VendorEditBookDetails;
