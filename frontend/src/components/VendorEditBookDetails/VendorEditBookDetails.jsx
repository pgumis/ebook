import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./VendorEditBookDetails.css";

const VendorEditBookDetails = () => {
  const view = useSelector((state) => state.view);
  const userData = useSelector((state) => state.userData);
  const selectedBook = view.bookDetailsObj;

  const [dane, setDane] = useState({
    tytul: "",
    autor: "",
    opis: "",
    isbn: "",
    liczba_stron: "",
    wydawnictwo: "",
    kategoria: "",
    jezyk: "",
    data_wydania: "",
    cena: "",
    cena_promocyjna: "",
    format: "",
  });

  const [okladka, setOkladka] = useState(null);
  const [plik, setPlik] = useState(null);

  useEffect(() => {
    if (selectedBook) {
      setDane({
        tytul: selectedBook.tytul || "",
        autor: selectedBook.autor || "",
        opis: selectedBook.opis || "",
        isbn: selectedBook.isbn || "",
        liczba_stron: selectedBook.liczba_stron || "",
        wydawnictwo: selectedBook.wydawnictwo || "",
        kategoria: selectedBook.kategoria || "",
        jezyk: selectedBook.jezyk || "",
        data_wydania: selectedBook.data_wydania || "",
        cena: selectedBook.cena || "",
        cena_promocyjna: selectedBook.cena_promocyjna || "",
        format: selectedBook.format || "",
      });
    }
  }, [selectedBook]);

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/jpeg") setOkladka(file);
    else alert("Proszę przesłać plik w formacie .jpg");
  };

  const handleBookChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/epub+zip" || file.name.endsWith(".epub"))
    )
      setPlik(file);
    else alert("Proszę przesłać plik w formacie .epub");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dane.tytul || !dane.autor || !dane.cena || !dane.format) {
      alert("Wypełnij wymagane pola: tytuł, autor, cena, format.");
      return;
    }

    const payload = {
      ...dane,
      liczba_stron: dane.liczba_stron ? parseInt(dane.liczba_stron) : null,
      cena: parseFloat(dane.cena),
      cena_promocyjna: dane.cena_promocyjna
        ? parseFloat(dane.cena_promocyjna)
        : null,
      okladka: okladka ? okladka.name : selectedBook.okladka,
      plik: plik ? plik.name : selectedBook.plik,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/ebooki/${selectedBook.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.log("Błąd serwera:", error);
        throw new Error(error.komunikat || "Błąd edycji książki");
      }

      alert("Książka zaktualizowana");
    } catch (error) {
      console.error("Błąd:", error);
      alert(`Nie udało się zaktualizować książki: ${error.message}`);
    }
  };

  return (
    <div className="panel vendor-edit-book-details-wrapper">
      <form onSubmit={handleSubmit}>
        <div><label>Tytuł*</label><input type="text" name="tytul" value={dane.tytul} onChange={handleChange} /></div>
        <div><label>Autor*</label><input type="text" name="autor" value={dane.autor} onChange={handleChange} /></div>
        <div><label>Opis</label><textarea name="opis" value={dane.opis} onChange={handleChange} /></div>
        <div><label>ISBN</label><input type="text" name="isbn" value={dane.isbn} onChange={handleChange} /></div>
        <div><label>Liczba stron</label><input type="number" name="liczba_stron" value={dane.liczba_stron} onChange={handleChange} /></div>
        <div><label>Wydawnictwo</label><input type="text" name="wydawnictwo" value={dane.wydawnictwo} onChange={handleChange} /></div>
        <div><label>Kategoria</label><input type="text" name="kategoria" value={dane.kategoria} onChange={handleChange} /></div>
        <div><label>Język</label><input type="text" name="jezyk" value={dane.jezyk} onChange={handleChange} /></div>
        <div><label>Data wydania</label><input type="date" name="data_wydania" value={dane.data_wydania} onChange={handleChange} /></div>
        <div><label>Cena*</label><input type="number" step="0.01" name="cena" value={dane.cena} onChange={handleChange} /></div>
        <div><label>Cena promocyjna</label><input type="number" step="0.01" name="cena_promocyjna" value={dane.cena_promocyjna} onChange={handleChange} /></div>
        <div>
          <label>Format*</label>
          <select name="format" value={dane.format} onChange={handleChange}>
            <option value="">Wybierz format</option>
            <option value="PDF">PDF</option>
            <option value="EPUB">EPUB</option>
            <option value="MOBI">MOBI</option>
          </select>
        </div>
        <div>
          <label>Nowa okładka (.jpg, opcjonalna):</label>
          <input type="file" accept=".jpg" onChange={handleCoverChange} />
        </div>
        <div>
          <label>Nowy plik książki (.epub, opcjonalny):</label>
          <input type="file" accept=".epub" onChange={handleBookChange} />
        </div>
        <button type="submit">Zapisz zmiany</button>
      </form>
    </div>
  );
};

export default VendorEditBookDetails;
