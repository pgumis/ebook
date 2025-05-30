import { useState } from "react";
import { useSelector } from "react-redux";

const VendorAddBook = () => {
  const userData = useSelector((state) => state.userData);

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
    format: "EPUB",
  });

  const [okladka, setOkladka] = useState(null);
  const [plik, setPlik] = useState(null);

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
    if (file && (file.type === "application/epub+zip" || file.name.endsWith(".epub")))
      setPlik(file);
    else alert("Proszę przesłać plik w formacie .epub");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dane.tytul || !dane.autor || !dane.cena || !dane.format) {
      alert("Uzupełnij wszystkie wymagane pola: tytuł, autor, cena, format.");
      return;
    }

    const payload = {
      ...dane,
      liczba_stron: dane.liczba_stron ? parseInt(dane.liczba_stron) : null,
      cena: parseFloat(dane.cena),
      cena_promocyjna: dane.cena_promocyjna ? parseFloat(dane.cena_promocyjna) : null,
      okladka: okladka ? okladka.name : null,
      plik: plik ? plik.name : null,
    };

    try {
      const response = await fetch("http://localhost:8000/api/ebooki", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        alert("Błąd dodawania książki: " + JSON.stringify(result.bledy || result));
        return;
      }

      alert("E-book został dodany!");
    } catch (err) {
      console.error("Błąd sieci:", err);
      alert("Wystąpił błąd połączenia.");
    }
  };

  return (
    <div className="panel vendor-edit-book-details-wrapper">
      <form onSubmit={handleSubmit}>
        <input type="text" name="tytul" placeholder="Tytuł *" value={dane.tytul} onChange={handleChange} />
        <input type="text" name="autor" placeholder="Autor *" value={dane.autor} onChange={handleChange} />
        <textarea name="opis" placeholder="Opis" value={dane.opis} onChange={handleChange} />
        <input type="text" name="isbn" placeholder="ISBN" value={dane.isbn} onChange={handleChange} />
        <input type="number" name="liczba_stron" placeholder="Liczba stron" value={dane.liczba_stron} onChange={handleChange} />
        <input type="text" name="wydawnictwo" placeholder="Wydawnictwo" value={dane.wydawnictwo} onChange={handleChange} />
        <input type="text" name="kategoria" placeholder="Kategoria" value={dane.kategoria} onChange={handleChange} />
        <input type="text" name="jezyk" placeholder="Język" value={dane.jezyk} onChange={handleChange} />
        <input type="date" name="data_wydania" placeholder="Data wydania" value={dane.data_wydania} onChange={handleChange} />
        <input type="number" name="cena" placeholder="Cena *" step="0.01" value={dane.cena} onChange={handleChange} />
        <input type="number" name="cena_promocyjna" placeholder="Cena promocyjna" step="0.01" value={dane.cena_promocyjna} onChange={handleChange} />
        <select name="format" value={dane.format} onChange={handleChange}>
          <option value="EPUB">EPUB</option>
          <option value="PDF">PDF</option>
          <option value="MOBI">MOBI</option>
        </select>

        <div>
          <label>Okładka (.jpg, opcjonalnie):</label>
          <input type="file" accept=".jpg" onChange={handleCoverChange} />
        </div>
        <div>
          <label>Plik książki (.epub, opcjonalnie):</label>
          <input type="file" accept=".epub" onChange={handleBookChange} />
        </div>

        <button type="submit">Dodaj e-booka</button>
      </form>
    </div>
  );
};

export default VendorAddBook;
