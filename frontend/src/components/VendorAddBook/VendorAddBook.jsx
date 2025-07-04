import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
const VendorAddBook = () => {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

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

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

    if (file && acceptedImageTypes.includes(file.type)) {
      setOkladka(file);
    } else {
      alert("Proszę przesłać plik obrazu w formacie .jpg, .png, .gif, .bmp lub .webp");
    }
  };

  const handleBookChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const acceptedExtensions = ['pdf', 'epub', 'mobi'];

    if (acceptedExtensions.includes(fileExtension)) {
      setPlik(file);
      setDane(prevState => ({
        ...prevState,
        format: fileExtension.toUpperCase()
      }));

    } else {
      alert("Proszę przesłać plik ebooka w formacie .epub, .pdf lub .mobi");
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dane.tytul || !dane.autor || !dane.cena ) {
      alert("Uzupełnij wszystkie wymagane pola.");
      return;
    }

    const formData = new FormData();

    for (const key in dane) {
      if (key === "liczba_stron" && dane[key] === "") continue;
      formData.append(key, dane[key]);
    }

    if (okladka) formData.append("okladka", okladka);
    if (plik) formData.append("plik", plik);

    console.log("Token:", userData.token);
    try {
      const response = await fetch("http://localhost:8000/api/ebooki", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        alert("Błąd dodawania książki: " + JSON.stringify(result.bledy || result));
        return;
      }
      dispatch(viewActions.changeView('home'));
      alert("E-book został dodany!");
    } catch (err) {
      console.error("Błąd sieci:", err.message || err);
      alert("Wystąpił błąd połączenia.");
    }
  };

  return (
    <div className="panel vendor-edit-book-details-wrapper">
      <div className="container mt-5" style={{ maxWidth: "900px" }}>

        <div className="card shadow-sm">
          <div className="card-header text-center fw-bold fs-5 bg-light">
            <h4 className="mb-0">Dodaj nowy e-book</h4>
          </div>
          <div className="back-to-panel-container">
            <button
                onClick={() => dispatch(viewActions.changeView('home'))}
                className="back-to-panel-btn"
            >
              <i className="fas fa-arrow-left"></i> Wróć do listy książek
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body">
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
                <div className="col-md-5">

                  <div className="mb-3">
                    <label className="form-label">Data wydania</label>
                    <input type="date" className="form-control" name="data_wydania" value={dane.data_wydania} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cena</label>
                    <input type="number" className="form-control" name="cena" value={dane.cena} onChange={handleChange} />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Plik książki (.epub, .mobi, .pdf)</label>
                    <input type="file" className="form-control" accept=".epub, .pdf, .mobi" onChange={handleBookChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Okładka (.jpg, .jpeg, .png)</label>
                    <input type="file" className="form-control" accept=".jpg, .jpeg, .png" onChange={handleCoverChange} />
                  </div>

                  {okladka && (
                      <div className="mt-3">
                        <label className="form-label">Podgląd okładki:</label>
                        <img
                            src={URL.createObjectURL(okladka)}
                            alt="Podgląd okładki"
                            style={{
                              width: "100%",
                              maxWidth: "180px", 
                              aspectRatio: "2 / 3",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                              display: "block",
                              margin: "0 auto",
                              marginTop: "10px"
                            }}
                        />
                      </div>
                  )}
                </div>
                <div className="row mt-3">
                  <div className="col text-center">
                    <button type="submit" className="btn w-50" style={{ backgroundColor: "#4C7766", color: "white" }}>
                      Dodaj e-booka
                    </button>
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

export default VendorAddBook;
