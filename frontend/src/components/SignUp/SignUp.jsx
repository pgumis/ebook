import { useState } from "react";
import "./SignUp.css";
import Logo from "../Logo/Logo";
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";

const SignUp = () => {
  const dispatch = useDispatch();
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
      <div className="form-wrapper">
        <Logo />
        <form onSubmit={handleSubmit}>
          <div className="form-single-line-input-container">
            <div>
              <label for="nazwisko">Imie</label>
              <input
                type="text"
                name="imie"
                value={dane.imie}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label for="nazwisko">Nazwisko</label>
              <input
                type="text"
                name="nazwisko"
                value={dane.nazwisko}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-whole-line">
            <label for="email">Adres email</label>
            <input
              type="email"
              name="email"
              value={dane.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-whole-line">
            <label for="email">Potwierdź adres email</label>
            <input
              type="email"
              name="email"
              value={dane.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-whole-line" style={{ marginTop: "0.5rem" }}>
            <label for="email">Hasło</label>
            <input
              type="password"
              name="haslo"
              value={dane.haslo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-whole-line">
            <label for="email">Potwierdź hasło</label>
            <input
              type="password"
              name="haslo"
              value={dane.haslo}
              onChange={handleChange}
              required
            />
          </div>
          <p className="form-info">
            ⓘJeśli jesteś autorem książek i chcesz założyć konto autora,
            <br />
            skontaktuj się z nami za pomocą{" "}
            <a
              href="#"
              onClick={() => {
                dispatch(viewActions.changeView("contact"));
              }}
            >
              formularza
            </a>
          </p>
          <button type="submit" className="form-submit">
            Zarejestruj się
          </button>
        </form>
        {komunikat && <p>{komunikat}</p>}
      </div>
    </div>
  );
};

export default SignUp;
