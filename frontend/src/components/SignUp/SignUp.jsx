import { useState } from "react";
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import "./SignUp.css"; // Użyjemy nowego pliku CSS

const SignUp = () => {
  const dispatch = useDispatch();
  const [dane, setDane] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    potwierdzEmail: "",
    haslo: "",
    potwierdzHaslo: "",
  });

  const [komunikat, setKomunikat] = useState({ text: "", type: "" }); // Zmieniamy komunikat na obiekt
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Funkcja `handleChange` pozostaje bez zmian
  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  // Funkcja `validateForm` pozostaje bez zmian
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!dane.imie.trim() || dane.imie.trim().length < 2 || !/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+$/.test(dane.imie.trim())) {
      newErrors.imie = "Wprowadź poprawne imię (min. 2 litery).";
      isValid = false;
    }
    if (!dane.nazwisko.trim() || dane.nazwisko.trim().length < 2 || !/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s-]+$/.test(dane.nazwisko.trim())) {
      newErrors.nazwisko = "Wprowadź poprawne nazwisko (min. 2 litery).";
      isValid = false;
    }
    if (!dane.email.trim() || !/\S+@\S+\.\S+/.test(dane.email)) {
      newErrors.email = "Wprowadź poprawny format emaila.";
      isValid = false;
    }
    if (dane.email !== dane.potwierdzEmail) {
      newErrors.potwierdzEmail = "Adresy e-mail nie są zgodne.";
      isValid = false;
    }
    if (!dane.haslo || dane.haslo.length < 6) {
      newErrors.haslo = "Hasło musi mieć co najmniej 6 znaków.";
      isValid = false;
    }
    if (dane.haslo !== dane.potwierdzHaslo) {
      newErrors.potwierdzHaslo = "Hasła nie są zgodne.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Funkcja `handleSubmit` z drobnymi modyfikacjami komunikatów
  const handleSubmit = async (e) => {
    e.preventDefault();
    setKomunikat({ text: "", type: "" });
    setErrors({});

    if (!validateForm()) {
      setKomunikat({ text: "Proszę poprawić błędy w formularzu.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const dataToSend = { imie: dane.imie, nazwisko: dane.nazwisko, email: dane.email, haslo: dane.haslo };
      const response = await fetch("http://localhost:8000/api/rejestracja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const wynik = await response.json();

      if (response.ok) {
        setKomunikat({ text: "Rejestracja zakończona sukcesem! Przekierowanie...", type: "success" });
        setTimeout(() => dispatch(viewActions.changeView("signIn")), 1500);
      } else {
        if (wynik.bledy) {
          const backendErrors = {};
          for (const key in wynik.bledy) {
            backendErrors[key] = wynik.bledy[key][0];
          }
          setErrors((prev) => ({ ...prev, ...backendErrors }));
          setKomunikat({ text: "Wystąpiły błędy walidacji.", type: "error" });
        } else {
          setKomunikat({ text: `Błąd: ${wynik.komunikat || "Nieznany błąd."}`, type: "error" });
        }
      }
    } catch (error) {
      setKomunikat({ text: "Błąd połączenia z serwerem.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
      // Nowa struktura JSX, wzorowana na SignIn.jsx
      <div className="signup-page-container">
        <div className="signup-card">
          <img src="/e-book na wynos logo.png" alt="Logo" className="signup-logo" />
          <h2>Stwórz konto</h2>
          <p className="signup-subtitle">Dołącz do nas i odkrywaj nowe książki!</p>

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            {/* Rząd dla imienia i nazwiska */}
            <div className="signup-name-row">
              <div className="input-group">
                <label htmlFor="imie">Imię</label>
                <input id="imie" type="text" name="imie" value={dane.imie} onChange={handleChange} required disabled={loading} />
                {errors.imie && <p className="error-text">{errors.imie}</p>}
              </div>
              <div className="input-group">
                <label htmlFor="nazwisko">Nazwisko</label>
                <input id="nazwisko" type="text" name="nazwisko" value={dane.nazwisko} onChange={handleChange} required disabled={loading} />
                {errors.nazwisko && <p className="error-text">{errors.nazwisko}</p>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Adres e-mail</label>
              <input id="email" type="email" name="email" value={dane.email} onChange={handleChange} required disabled={loading} />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="potwierdzEmail">Potwierdź adres e-mail</label>
              <input id="potwierdzEmail" type="email" name="potwierdzEmail" value={dane.potwierdzEmail} onChange={handleChange} required disabled={loading} />
              {errors.potwierdzEmail && <p className="error-text">{errors.potwierdzEmail}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="haslo">Hasło</label>
              <input id="haslo" type="password" name="haslo" value={dane.haslo} onChange={handleChange} required disabled={loading} />
              {errors.haslo && <p className="error-text">{errors.haslo}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="potwierdzHaslo">Potwierdź hasło</label>
              <input id="potwierdzHaslo" type="password" name="potwierdzHaslo" value={dane.potwierdzHaslo} onChange={handleChange} required disabled={loading} />
              {errors.potwierdzHaslo && <p className="error-text">{errors.potwierdzHaslo}</p>}
            </div>

            {/* Główny komunikat o błędzie/sukcesie */}
            {komunikat.text && <p className={`signup-main-message ${komunikat.type}`}>{komunikat.text}</p>}

            <button type="submit" className="signup-submit-btn" disabled={loading}>
              {loading ? "Rejestrowanie..." : "Zarejestruj się"}
            </button>
          </form>

          <div className="signup-helper-links">
            <p>Masz już konto? <a href="#" onClick={() => dispatch(viewActions.changeView("signIn"))}>Zaloguj się</a></p>
            <p className="author-info">Jesteś autorem? <a href="#" onClick={() => dispatch(viewActions.changeView("contact"))}>Skontaktuj się z nami</a></p>
          </div>
        </div>
      </div>
  );
};

export default SignUp;