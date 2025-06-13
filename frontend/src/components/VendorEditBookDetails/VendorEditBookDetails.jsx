import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import "./VendorEditBookDetails.css"; // Style specyficzne dla formularza
import "../BookDetails/BookDetails.css"; // Importujemy style layoutu ze szczegółów książki

const VendorEditBookDetails = () => {
  const dispatch = useDispatch();
  const selectedBook = useSelector((state) => state.view.bookDetailsObj);
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
    format: "",
  });
  const [okladka, setOkladka] = useState(null);
  const [plik, setPlik] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    if (selectedBook) {
      const formattedDate = selectedBook.data_wydania ? selectedBook.data_wydania.split(' ')[0] : '';
      setDane({
        tytul: selectedBook.tytul || "",
        autor: selectedBook.autor || "",
        opis: selectedBook.opis || "",
        isbn: selectedBook.isbn || "",
        liczba_stron: selectedBook.liczba_stron || "",
        wydawnictwo: selectedBook.wydawnictwo || "",
        kategoria: selectedBook.kategoria || "",
        jezyk: selectedBook.jezyk || "",
        data_wydania: formattedDate,
        cena: selectedBook.cena || "",
        cena_promocyjna: selectedBook.cena_promocyjna || "",
        format: selectedBook.format || "",
      });
      setCoverPreview(selectedBook.okladka);
    }
  }, [selectedBook]);

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOkladka(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleBookChange = (e) => {
    setPlik(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in dane) {
      formData.append(key, dane[key]);
    }
    if (okladka) {
      formData.append("okladka", okladka);
    }
    if (plik) {
      formData.append("plik", plik);
    }
    formData.append('_method', 'PUT');

    try {
      const response = await fetch(`http://localhost:8000/api/ebooki/${selectedBook.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd podczas aktualizacji.');
      }
      alert("Książka została pomyślnie zaktualizowana!");
      dispatch(viewActions.changeView('home'));
    } catch (error) {
      console.error("Błąd:", error);
      alert(`Nie udało się zaktualizować książki: ${error.message}`);
    }
  };

  if (!selectedBook) return <div>Ładowanie danych...</div>;

  return (
      <div className="book-details-layout-full">
        <main className="details-main-content">
          <div className="back-to-panel-container">
            <button
                onClick={() => dispatch(viewActions.changeView('home'))}
                className="back-to-panel-btn"
            >
              <i className="fas fa-arrow-left"></i> Wróć do panelu
            </button>
          </div>

          <div className="card shadow-sm">
            <div className="card-header text-center fw-bold fs-5 bg-light">
              <h4 className="mb-0">Edytuj e-book: {selectedBook.tytul}</h4>
            </div>
            <form onSubmit={handleSubmit} className="card-body">
              <div className="row">
                <div className="col-md-7 border-end pe-4">
                  <div className="mb-2">
                    <label className="form-label">Tytuł *</label>
                    <input type="text" className="form-control" name="tytul" value={dane.tytul} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Autor *</label>
                    <input type="text" className="form-control" name="autor" value={dane.autor} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Opis</label>
                    <textarea className="form-control" name="opis" value={dane.opis} onChange={handleChange} rows="5"></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISBN</label>
                    <input type="text" className="form-control" name="isbn" value={dane.isbn} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Liczba stron</label>
                    <input type="number" className="form-control" name="liczba_stron" value={dane.liczba_stron} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Wydawnictwo</label>
                    <input type="text" className="form-control" name="wydawnictwo" value={dane.wydawnictwo} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Kategoria</label>
                    <select className="form-select" name="kategoria" value={dane.kategoria} onChange={handleChange}>
                      <option value="">Wybierz kategorię</option>
                      <option value="Atlasy i albumy">Atlasy i albumy</option>
                      <option value="Biografie">Biografie</option>
                      <option value="Biznes">Biznes</option>
                      <option value="Dla dzieci">Dla dzieci</option>
                      <option value="Fantastyka">Fantastyka</option>
                      <option value="Historia">Historia</option>
                      <option value="Horror">Horror</option>
                      <option value="Informatyka">Informatyka</option>
                      <option value="Komiksy">Komiksy</option>
                      <option value="Kryminał, sensacja, thriller">Kryminał, sensacja, thriller</option>
                      <option value="Kuchnia">Kuchnia</option>
                      <option value="Kultura i sztuka">Kultura i sztuka</option>
                      <option value="Lektury">Lektury</option>
                      <option value="Literatura faktu">Literatura faktu</option>
                      <option value="Literatura piękna">Literatura piękna</option>
                      <option value="Literatura popularnonaukowa">Literatura popularnonaukowa</option>
                      <option value="Nauka języków">Nauka języków</option>
                      <option value="Nauki ścisłe, medycyna">Nauki ścisłe, medycyna</option>
                      <option value="Podróże i turystyka">Podróże i turystyka</option>
                      <option value="Poezja i dramat">Poezja i dramat</option>
                      <option value="Poradniki">Poradniki</option>
                      <option value="Prasa">Prasa</option>
                      <option value="Prawo">Prawo</option>
                      <option value="Religia">Religia</option>
                      <option value="Romanse">Romanse</option>
                      <option value="Sport">Sport</option>
                      <option value="Inne">Inne</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Język</label>
                    <select className="form-select" name="jezyk" value={dane.jezyk} onChange={handleChange}>
                      <option value="">Wybierz język</option>
                      <option value="Polski">Polski</option>
                      <option value="Angielski">Angielski</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="mb-3">
                    <label className="form-label">Data wydania</label>
                    <input type="date" className="form-control" name="data_wydania" value={dane.data_wydania} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cena</label>
                    <input type="number" step="0.01" className="form-control" name="cena" value={dane.cena} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cena promocyjna (opcjonalnie)</label>
                    <input type="number" step="0.01" className="form-control" name="cena_promocyjna" value={dane.cena_promocyjna} onChange={handleChange} placeholder="np. 19.99"/>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Nowy plik książki (.epub, .mobi, .pdf)</label>
                    <input type="file" className="form-control" accept=".epub,.pdf,.mobi" onChange={handleBookChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Nowa okładka (.jpg, .jpeg, .png)</label>
                    <input type="file" className="form-control" accept=".jpg,.jpeg,.png" onChange={handleCoverChange} />
                  </div>
                  {coverPreview && (
                      <div className="mt-3">
                        <label className="form-label">Podgląd okładki:</label>
                        <img src={coverPreview} alt="Podgląd okładki" className="cover-preview-img"/>
                      </div>
                  )}
                </div>
                <div className="row mt-4">
                  <div className="col text-center">
                    <button type="button" className="cancel-to-panel-btn" onClick={() => dispatch(viewActions.changeView('home'))}>Anuluj</button>
                    <button type="submit" className="save-to-panel-btn">Zapisz zmiany</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
  );
};

export default VendorEditBookDetails;