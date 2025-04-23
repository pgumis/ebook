import { useState } from "react";
import "./ContactForm.css";
import Logo from "../Logo/Logo";
const ContactForm = () => {
  const [dane, setDane] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
  });

  const [komunikat, setKomunikat] = useState("");

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
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
      <div className="form-wrapper" style={{width:822}}>
        <h2>Dane kontaktowe</h2>
        <form onSubmit={handleSubmit}>
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
                type="text"
                name="nazwisko"
                value={dane.nazwisko}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-whole-line">
              <label for="email">Powód kontaktu</label>
              <input
                type="email"
                name="email"
                value={dane.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-whole-line">
            <label>Treść wiadomości</label>
            <textarea className="contact-form-textarea"></textarea>
          </div>

          <button type="submit" className="form-submit">
            Zarejestruj się
          </button>
        </form>
        {komunikat && <p>{komunikat}</p>}
      </div>
    </div>
  );
};

export default ContactForm;
