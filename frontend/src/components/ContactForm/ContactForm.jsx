import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import "./ContactForm.css";
import Logo from "../Logo/Logo";

const ContactForm = () => {
  const userData = useSelector((state) => state.userData);
  console.log(userData);
  const [dane, setDane] = useState({
    email: "",
    telefon: "",
    powodKontaktu: "",
    wiadomosc: "",
  });
  const [isInputValid, setIsInputValid] = useState({
    email: true,
    telefon: true,
    powodKontaktu: true,
    wiadomosc: true,
  });
  useEffect(()=>{
    if(userData.loggedIn){
      setDane({...dane, email: userData.email, telefon: userData.phoneNumber})
    }
  },[userData]);
  const [komunikat, setKomunikat] = useState("");
  const [dlugoscTextArea, setDlugoscTextArea] = useState(0);
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
    setIsInputValid({ ...isInputValid, [e.target.name]: true });
    e.target.name === "wiadomosc" && setDlugoscTextArea(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    for (const element in dane) {
      if (dane[element] === "") {
        setIsInputValid((prevState) => ({
          ...prevState,
          [element]: false,
        }));
        isValid = false;
      }
    }

    if (dane.powodKontaktu === "Wybierz" || dane.powodKontaktu === "") {
      setIsInputValid((prevState) => ({
        ...prevState,
        ["powodKontaktu"]: false,
      }));
      isValid = false;
    }
    //TRZEBA DODAĆ CAŁĄ LOGIKE PRZESYŁANIA WIADOMOŚCI I WALIDACJI, CZY WIADOMOŚĆ WYSŁANA PRAWIDŁOWO

    // const response = await fetch("http://localhost:8000/api/rejestracja", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(dane),
    // });

    // const wynik = await response.json();

    // if (response.ok) {
    //   setKomunikat(wynik.komunikat);
    // } else {
    //   setKomunikat("Błąd: " + JSON.stringify(wynik.bledy));
    // }
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
                name="email"
                value={dane.email}
                onChange={handleChange}
                placeholder={!isInputValid["email"] ? "Podaj adres email" : ""}
                className={!isInputValid["email"] ? "invalid" : ""}
                disabled={userData.loggedIn}
              />
            </div>
            <div className="form-whole-line">
              <label for="nazwisko">Numer telefonu</label>
              <input
                type="tel"
                name="telefon"
                value={dane.telefon}
                onChange={handleChange}
                placeholder={
                  !isInputValid["telefon"] ? "Podaj numer telefonu" : ""
                }
                className={!isInputValid["telefon"] ? "invalid" : ""}
                disabled={userData.loggedIn}
              />
            </div>
            <div className="form-whole-line">
              <label for="email">Powód kontaktu</label>
              <select
                name="powodKontaktu"
                value={dane.powodKontaktu}
                onChange={handleChange}
                className={!isInputValid["powodKontaktu"] ? "invalid" : ""}
                onClick={
                  () =>
                    setIsInputValid((prevState) => ({
                      ...prevState,
                      ["powodKontaktu"]: true,
                    })) //wylaczenie czerwonego podswietlenia
                }
              >
                <option value="Wybierz">Wybierz...</option>
                <option value="Problem z logowaniem">
                  Problem z logowanie
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
                onChange={handleChange}
                placeholder={
                  !isInputValid["wiadomosc"] ? "Podaj treść wiadomości" : ""
                }
                className={!isInputValid["wiadomosc"] ? "invalid contact-form-textarea" : "contact-form-textarea"}
              ></textarea>
              <div className="text-area-word-counter">
                {dlugoscTextArea}/1000
              </div>
            </div>
          </div>
          <div className="contact-form-buttons-container">
            <button className="contact-form-cancel-button">Anuluj</button>
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

