import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import "./VendorEditBookDetails.css"; // Użyjemy zaktualizowanych stylów

const VendorEditBookDetails = () => {
  const dispatch = useDispatch();
  const selectedBook = useSelector((state) => state.view.bookDetailsObj);
  const userData = useSelector((state) => state.userData);

  const [dane, setDane] = useState({});
  const [okladka, setOkladka] = useState(null); // Dla nowego pliku okładki
  const [plik, setPlik] = useState(null);     // Dla nowego pliku e-booka
  const [coverPreview, setCoverPreview] = useState(null); // Do podglądu nowej okładki

  useEffect(() => {
    if (selectedBook) {
      // Formatowanie daty dla input[type=date]
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
      setCoverPreview(selectedBook.okladka); // Ustawiamy podgląd na istniejącą okładkę
    }
  }, [selectedBook]);

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOkladka(file);
      setCoverPreview(URL.createObjectURL(file)); // Generuj podgląd dla nowego pliku
    }
  };

  const handleBookChange = (e) => {
    setPlik(e.target.files[0]);
  };

  // --- NOWA, POPRAWIONA FUNKCJA WYSYŁANIA DANYCH Z PLIKAMI ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Dodajemy wszystkie pola tekstowe do formData
    for (const key in dane) {
      formData.append(key, dane[key]);
    }

    // Jeśli użytkownik wybrał nową okładkę, dodajemy plik
    if (okladka) {
      formData.append("okladka", okladka);
    }

    // Jeśli użytkownik wybrał nowy plik e-booka, dodajemy go
    if (plik) {
      formData.append("plik", plik);
    }

    // WAŻNE: Laravel nie obsługuje poprawnie PUT z multipart/form-data.
    // Używamy "tunelowania" - wysyłamy jako POST z dodatkowym polem _method.
    formData.append('_method', 'PUT');

    try {
      const response = await fetch(`http://localhost:8000/api/ebooki/${selectedBook.id}`, {
        method: "POST", // Wysyłamy jako POST
        headers: {
          // NIE USTAWIAJ 'Content-Type', przeglądarka zrobi to sama dla FormData
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd podczas aktualizacji.');
      }

      alert("Książka została pomyślnie zaktualizowana!");
      dispatch(viewActions.changeView('home')); // Wróć do panelu po sukcesie

    } catch (error) {
      console.error("Błąd:", error);
      alert(`Nie udało się zaktualizować książki: ${error.message}`);
    }
  };

  if (!selectedBook) return <div>Ładowanie danych...</div>

  return (
      // Używamy struktury i klas z formularza dodawania książki dla spójności
      <div className="panel vendor-edit-book-details-wrapper">
        <div className="container mt-5" style={{ maxWidth: "900px" }}>
          <div className="card shadow-sm">
            <div className="card-header text-center fw-bold fs-5 bg-light">
              <h4 className="mb-0">Dodaj nowy e-book</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="row">
                  {/* LEWA KOLUMNA – formularz */}
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
                      <textarea className="form-control" name="opis" value={dane.opis} onChange={handleChange} />
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
                        <option value="Niemiecki">Niemiecki</option>
                        <option value="Hiszpański">Hiszpański</option>
                        <option value="Francuski">Francuski</option>
                        <option value="Inne">Inne</option>
                      </select>
                    </div>

                  </div>

                  {/* PRAWA KOLUMNA – okładka i podgląd */}
                  <div className="col-md-5">

                    <div className="mb-3">
                      <label className="form-label">Data wydania</label>
                      <input type="date" className="form-control" name="data_wydania" value={dane.data_wydania} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Cena</label>
                      <input type="number" className="form-control" name="cena" value={dane.cena} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Cena promocyjna (opcjonalnie)</label>
                      <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          name="cena_promocyjna"
                          value={dane.cena_promocyjna}
                          onChange={handleChange}
                          placeholder="np. 19.99"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Plik książki (.epub, .mobi, .pdf)</label>
                      <input type="file" className="form-control" accept=".epub, .pdf, .mobi" onChange={handleBookChange} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Okładka (.jpg, .jpeg, .png)</label>
                      <input type="file" className="form-control" accept=".jpg, .jpeg, .png" onChange={handleCoverChange} />
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
                      <button type="button" className="btn btn-secondary me-3" onClick={() => dispatch(viewActions.changeView('home'))}>Anuluj</button>
                      <button type="submit" className="btn btn-primary-custom">Zapisz zmiany</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default VendorEditBookDetails;