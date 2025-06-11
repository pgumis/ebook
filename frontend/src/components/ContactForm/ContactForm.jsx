import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import "./ContactForm.css";
import Logo from "../Logo/Logo";

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
    imie: true,
    email: true,
    telefon: true,
    powodKontaktu: true,
    wiadomosc: true,
  });
  const [komunikat, setKomunikat] = useState("");
  const [dlugoscTextArea, setDlugoscTextArea] = useState(0);

  useEffect(() => {
    if (userData.loggedIn) {
      setDane((prev) => ({
        ...prev,
        imie: userData.userName || "",
        email: userData.email || "",
        telefon: userData.phoneNumber || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefon") {
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

    setDane((prev) => ({ ...prev, [name]: value }));
    setIsInputValid((prev) => ({ ...prev, [name]: true }));
    if (name === "wiadomosc") {
      setDlugoscTextArea(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(localStorage.getItem("token"));
    console.log('wysylam')
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
      setKomunikat("Proszę wypełnić wszystkie wymagane pola poprawnie.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (userData.loggedIn && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const payload = userData.loggedIn
        ? {
            temat: dane.powodKontaktu,
            tresc: dane.wiadomosc,
          }
        : {
            imie: dane.imie,
            email: dane.email,
            temat: dane.powodKontaktu,
            tresc: dane.wiadomosc,
          };

      const response = await fetch("http://localhost:8000/api/wiadomosci/wyslij", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const wynik = await response.json();

      if (response.ok) {
        setKomunikat(wynik.message || "Wiadomość została wysłana.");
        setDane({
          imie: userData.loggedIn ? userData.userName || "" : "",
          email: userData.loggedIn ? userData.email || "" : "",
          telefon: userData.loggedIn ? userData.phoneNumber || "" : "",
          powodKontaktu: "",
          wiadomosc: "",
        });
        setDlugoscTextArea(0);
        setIsInputValid({
          imie: true,
          email: true,
          telefon: true,
          powodKontaktu: true,
          wiadomosc: true,
        });
      } else {
        setKomunikat(
          wynik.message || wynik.bledy
            ? Object.values(wynik.bledy).flat().join(", ")
            : "Błąd podczas wysyłania wiadomości."
        );
      }
    } catch (error) {
      setKomunikat("Błąd: " + error.message);
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
              <label htmlFor="imie">Imię</label>
              <input
                type="text"
                name="imie"
                value={dane.imie}
                onChange={handleChange}
                placeholder={!isInputValid.imie ? "Podaj imię" : ""}
                className={!isInputValid.imie ? "invalid" : ""}
              />
            </div>

            <div className="form-whole-line">
              <label htmlFor="email">Adres email</label>
              <input
                type="email"
                name="email"
                value={dane.email}
                onChange={handleChange}
                placeholder={!isInputValid.email ? "Podaj adres email" : ""}
                className={!isInputValid.email ? "invalid" : ""}
                disabled={userData.loggedIn}
              />
            </div>
            <div className="form-whole-line">
              <label htmlFor="telefon">Numer telefonu</label>
              <input
                type="tel"
                name="telefon"
                value={dane.telefon}
                onChange={handleChange}
                placeholder={
                  !isInputValid.telefon ? "Podaj numer telefonu" : ""
                }
                className={!isInputValid.telefon ? "invalid" : ""}
                disabled={userData.loggedIn}
              />
            </div>
            <div className="form-whole-line">
              <label htmlFor="powodKontaktu">Powód kontaktu</label>
              <select
                name="powodKontaktu"
                value={dane.powodKontaktu}
                onChange={handleChange}
                className={!isInputValid.powodKontaktu ? "invalid" : ""}
                onClick={() =>
                  setIsInputValid((prev) => ({ ...prev, powodKontaktu: true }))
                }
              >
                <option value="Wybierz">Wybierz...</option>
                <option value="Problem z logowaniem">
                  Problem z logowaniem
                </option>
                <option value="Założenie konta autora">
                  Założenie konta autora
                </option>
              </select>
            </div>
          </div>

          <div className="form-whole-line">
            <label>Treść wiadomości</label>
            <div className="text-area-wrapper">
              <textarea
                maxLength={1000}
                name="wiadomosc"
                value={dane.wiadomosc}
                onChange={handleChange}
                placeholder={
                  !isInputValid.wiadomosc ? "Podaj treść wiadomości" : ""
                }
                className={
                  !isInputValid.wiadomosc
                    ? "invalid contact-form-textarea"
                    : "contact-form-textarea"
                }
              ></textarea>
              <div className="text-area-word-counter">
                {dlugoscTextArea}/1000
              </div>
            </div>
          </div>
          <div className="contact-form-buttons-container">
            <button type="button" className="contact-form-cancel-button">
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
