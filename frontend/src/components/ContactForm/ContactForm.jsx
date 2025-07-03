import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./ContactForm.css";

const ContactForm = () => {
  const userData = useSelector((state) => state.userData);
  const [dane, setDane] = useState({
    imie: "",
    email: "",
    telefon: "",
    powodKontaktu: "",
    wiadomosc: "",
  });
  const [isInputValid, setIsInputValid] = useState({
    imie: true, email: true, telefon: true, powodKontaktu: true, wiadomosc: true,
  });
  const [komunikat, setKomunikat] = useState({ typ: "", tresc: "" });
  const [dlugoscTextArea, setDlugoscTextArea] = useState(0);

  useEffect(() => {
    if (userData.loggedIn) {
      setDane((prev) => ({
        ...prev,
        imie: userData.imie || "",
        email: userData.email || "",
        telefon: userData.numer_telefonu || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefon") {
      const inputChar = e.nativeEvent.data;
      if (inputChar && !/[\d\+]/.test(inputChar)) return;
      if (inputChar === "+" && (dane.telefon.includes("+") || dane.telefon.length > 0)) return;
    }
    setDane((prev) => ({ ...prev, [name]: value }));
    setIsInputValid((prev) => ({ ...prev, [name]: true }));
    if (name === "wiadomosc") setDlugoscTextArea(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newIsInputValid = { ...isInputValid };

    if (!userData.loggedIn) {
      if (!dane.imie || dane.imie.length < 2) {
        newIsInputValid.imie = false;
        isValid = false;
      }
      if (!dane.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dane.email)) {
        newIsInputValid.email = false;
        isValid = false;
      }
    }
    if (!dane.powodKontaktu || dane.powodKontaktu === "Wybierz") {
      newIsInputValid.powodKontaktu = false;
      isValid = false;
    }
    if (!dane.wiadomosc || dane.wiadomosc.length < 20) {
      newIsInputValid.wiadomosc = false;
      isValid = false;
    }

    setIsInputValid(newIsInputValid);

    if (!isValid) {
      setKomunikat({ typ: "blad", tresc: "Proszę wypełnić wszystkie wymagane pola poprawnie." });
      return;
    }

    try {
      const payload = userData.loggedIn
          ? { temat: dane.powodKontaktu, tresc: dane.wiadomosc }
          : { imie: dane.imie, email: dane.email, temat: dane.powodKontaktu, tresc: dane.wiadomosc };

      const response = await fetch("http://localhost:8000/api/wiadomosci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const wynik = await response.json();

      if (response.ok) {
        setKomunikat({ typ: "sukces", tresc: wynik.message || "Wiadomość została wysłana pomyślnie!" });
        setDane({
          imie: userData.loggedIn ? userData.imie || "" : "",
          email: userData.loggedIn ? userData.email || "" : "",
          telefon: userData.loggedIn ? userData.phoneNumber || "" : "",
          powodKontaktu: "",
          wiadomosc: "",
        });
        setDlugoscTextArea(0);
      } else {
        const trescBledow = wynik.bledy ? Object.values(wynik.bledy).flat().join(", ") : "Wystąpił błąd.";
        setKomunikat({ typ: "blad", tresc: wynik.message || trescBledow });
      }
    } catch (error) {
      setKomunikat({ typ: "blad", tresc: "Błąd serwera: " + error.message });
    }
  };

  return (
      <div className="contact-form-container">
        <div className="form-wrapper-contact">
          <div className="form-header">
            <h2>Formularz kontaktowy</h2>
            <p>Masz pytanie lub problem? Chętnie pomożemy!</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form-grid" noValidate>
            <div className="form-group">
              <label htmlFor="imie">Imię</label>
              <input id="imie" type="text" name="imie" value={dane.imie} onChange={handleChange} className={!isInputValid.imie ? "invalid" : ""} disabled={userData.loggedIn} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Adres email</label>
              <input id="email" type="email" name="email" value={dane.email} onChange={handleChange} className={!isInputValid.email ? "invalid" : ""} disabled={userData.loggedIn} />
            </div>
            <div className="form-group">
              <label htmlFor="telefon">Numer telefonu (opcjonalnie)</label>
              <input id="telefon" type="tel" name="telefon" value={dane.telefon} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="powodKontaktu">Powód kontaktu</label>
              <select id="powodKontaktu" name="powodKontaktu" value={dane.powodKontaktu} onChange={handleChange} className={!isInputValid.powodKontaktu ? "invalid" : ""}>
                <option value="Wybierz">Wybierz z listy...</option>
                <option value="Problem z logowaniem">Problem z logowaniem</option>
                <option value="Założenie konta autora">Założenie konta autora</option>
                <option value="Pytanie ogólne">Pytanie ogólne</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="wiadomosc">Treść wiadomości</label>
              <div className="text-area-wrapper">
                <textarea id="wiadomosc" maxLength={1000} name="wiadomosc" value={dane.wiadomosc} onChange={handleChange} className={!isInputValid.wiadomosc ? "invalid" : ""}></textarea>
                <div className="text-area-word-counter">{dlugoscTextArea}/1000</div>
              </div>
              {!isInputValid.wiadomosc && <span className="error-text">Wiadomość musi mieć co najmniej 20 znaków.</span>}
            </div>

            {komunikat.tresc && (
                <div className={`form-komunikat full-width ${komunikat.typ === 'sukces' ? 'sukces' : 'blad'}`}>
                  {komunikat.tresc}
                </div>
            )}

            <div className="form-actions full-width">
              <button type="button" className="btn btn-secondary">Anuluj</button>
              <button type="submit" className="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12L3 21L21 12L3 3L6 12ZM6 12H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Wyślij wiadomość
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ContactForm;