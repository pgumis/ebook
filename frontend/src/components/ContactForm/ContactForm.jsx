import { useState } from "react";
import "./ContactForm.css";
import Logo from "../Logo/Logo";
const ContactForm = () => {
  const [dane, setDane] = useState({
    imie: "",
    telefon:"",
    email: "",
    haslo: "",
    wiadomosc: "",
  });

  const [komunikat, setKomunikat] = useState("");
  const [dlugoscTextArea, setDlugoscTextArea] = useState(0);
  const handleChange = (e) => {
    console.log(e.nativeEvent.data);
    setDane({ ...dane, [e.target.name]: e.target.value });
    e.target.name === "wiadomosc" && setDlugoscTextArea(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/rejestracja", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dane),
    });

    const wynik = await response.json();

    if (response.ok) {
      setKomunikat(wynik.komunikat);
    } else {
      setKomunikat("Błąd: " + JSON.stringify(wynik.bledy));
    }
  };

  return (
    <div className="screen-center">
      <div className="form-wrapper" style={{ width: 822 }}>
        <div className="form-header">
          <h2>Dane kontaktowe</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="contact-form-center">
            <div className="form-whole-line">
              <label for="nazwisko">Adres email</label>
              <input
                type="text"
                name="imie"
                value={dane.imie}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-whole-line">
              <label for="nazwisko">Numer telefonu</label>
              <input
                type="tel"
                name="telefon"
                value={dane.telefon}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-whole-line">
              <label for="email">Powód kontaktu</label>
              <select name="cars" id="cars">
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="opel">Opel</option>
                <option value="audi">Audi</option>
              </select>
            </div>
          </div>

          <div className="form-whole-line">
            <label>Treść wiadomości</label>
            <div className="text-area-wrapper">
              <textarea
                className="contact-form-textarea"
                maxLength={1000}
                name="wiadomosc"
                value={dane.wiadomosc}
                onChange={handleChange}
              ></textarea>
              <div className="text-area-word-counter">
                {dlugoscTextArea}/1000
              </div>
            </div>
          </div>
          <div className="contact-form-buttons-container">
            <button className="contact-form-cancel-button">
              Anuluj
            </button>
            <button type="submit" className="form-submit contact-form-send">
              <svg
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L3 21L21 12L3 3L6 12ZM6 12L12 12"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              Wyślij wiadomość
            </button>
          </div>
        </form>
        {komunikat && <p>{komunikat}</p>}
      </div>
    </div>
  );
};

export default ContactForm;
