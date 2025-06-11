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
    potwierdzEmail: "",
    haslo: "",
    potwierdzHaslo: "",
  });

  const [komunikat, setKomunikat] = useState("");
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Walidacja imienia
    if (!dane.imie.trim()) {
      newErrors.imie = "Imię jest wymagane.";
      isValid = false;
    } else if (dane.imie.trim().length < 2) {
      newErrors.imie = "Imię musi mieć co najmniej 2 znaki.";
      isValid = false;
    }
     else if (!/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+$/.test(dane.imie.trim())) {
      newErrors.imie = "Wprowadź prawidłowe imię";
      isValid = false;
    }

    // Walidacja nazwiska
    if (!dane.nazwisko.trim()) {
      newErrors.nazwisko = "Nazwisko jest wymagane.";
      isValid = false;
    } else if (dane.nazwisko.trim().length < 2) {
      newErrors.nazwisko = "Nazwisko musi mieć co najmniej 2 znaki.";
      isValid = false;
    }
    else if (!/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s-]+$/.test(dane.imie.trim())) {
      newErrors.nazwisko = "Nazwisko może zawierać tylko litery, spacje i myślniki.";
      isValid = false;
    }

    // Walidacja emaila
    if (!dane.email.trim()) {
      newErrors.email = "Email jest wymagany.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(dane.email)) {
      newErrors.email = "Wprowadź poprawny format emaila.";
      isValid = false;
    }

    // Walidacja potweirdzenia emaila
    if (!dane.potwierdzEmail.trim()) {
      newErrors.potwierdzEmail = "Potwierdź e-mail.";
      isValid = false;
    } else if (dane.email !== dane.potwierdzEmail) {
      newErrors.potwierdzEmail = "Adresy e-mail nie są zgodne.";
      isValid = false;
    }

    // Walidacja hasła
    if (!dane.haslo) {
      newErrors.haslo = "Hasło jest wymagane.";
      isValid = false;
    } else if (dane.haslo.length < 6) { // Minimalna długość hasła
      newErrors.haslo = "Hasło musi mieć co najmniej 6 znaków.";
      isValid = false;
    }

    // Walidacja potwierdzenia hasła
    if (!dane.potwierdzHaslo) {
      newErrors.potwierdzHaslo = "Potwierdź hasło.";
      isValid = false;
    } else if (dane.haslo !== dane.potwierdzHaslo) {
      newErrors.potwierdzHaslo = "Hasła nie są zgodne.";
      isValid = false;
    }

    setErrors(newErrors); // Ustaw nowe błędy
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setKomunikat(""); // Wyczyść ogólny komunikat
    setErrors({}); // Wyczyść błędy pól przed ponowną walidacją

    // <-- KLUCZOWA ZMIANA: Wywołanie walidacji po stronie klienta
    if (!validateForm()) {
      setKomunikat("Proszę poprawić błędy w formularzu.");
      return; // Zatrzymaj wysyłkę, jeśli walidacja nie przeszła
    }

    try {
      // Przygotuj dane do wysłania (bez potwierdzenia hasła)
      const dataToSend = {
        imie: dane.imie,
        nazwisko: dane.nazwisko,
        email: dane.email,
        haslo: dane.haslo,
      };

      const response = await fetch("http://localhost:8000/api/rejestracja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend), // Wysyłamy tylko właściwe dane
      });

      const wynik = await response.json();

      if (response.ok) {
        setKomunikat("Rejestracja zakończona sukcesem!");
        setTimeout(() => {
          dispatch(viewActions.changeView("signIn")); // Przekierowanie do logowania
        }, 1500); // 1.5 sekundy
      } else {
        // <-- KLUCZOWA ZMIANA: Obsługa błędów z backendu
        // Zakładamy, że backend zwraca błędy w obiekcie `wynik.bledy` (tak jak w poprzedniej odpowiedzi)
        if (wynik.bledy) {
          const backendErrors = {};
          for (const key in wynik.bledy) {
            backendErrors[key] = wynik.bledy[key][0]; // Bierzemy pierwszą wiadomość dla danego pola
          }
          setErrors((prevErrors) => ({ ...prevErrors, ...backendErrors })); // Połącz błędy z frontendu i backendu
          setKomunikat("Wystąpiły błędy walidacji. Proszę poprawić formularz.");
        } else {
          // Obsługa ogólnego błędu z backendu, jeśli nie ma szczegółowych błędów walidacji
          setKomunikat("Błąd rejestracji: " + (wynik.komunikat || "Nieznany błąd serwera."));
        }
      }
    } catch (error) {
      console.error("Błąd sieci:", error);
      setKomunikat("Nie udało się połączyć z serwerem.");
    }
  };

  return (
    <div className="screen-center">
      <div className="form-wrapper">
        <img className="signup-logo" src={"e-book na wynos logo.png"}/>
        <form onSubmit={handleSubmit}>
          <div className="form-single-line-input-container">
            <div>
              <label for="nazwisko">Imię</label>
              <input
                type="text"
                name="imie"
                value={dane.imie}
                onChange={handleChange}
                required
              />
              {errors.imie && <p className="error-text">{errors.imie}</p>}
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
              {errors.nazwisko && <p className="error-text">{errors.nazwisko}</p>}
            </div>
          </div>
          <div className="form-whole-line">
            <label for="email">Adres e-mail</label>
            <input
              type="email"
              name="email"
              value={dane.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-whole-line">
            <label for="email">Potwierdź adres e-mail</label>
            <input
              type="email"
              name="potwierdzEmail"
              value={dane.potwierdzEmail}
              onChange={handleChange}
              required
            />
            {errors.potwierdzEmail && <p className="error-text">{errors.potwierdzEmail}</p>}
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
            {errors.haslo && <p className="error-text">{errors.haslo}</p>}
          </div>
          <div className="form-whole-line">
            <label for="email">Potwierdź hasło</label>
            <input
              type="password"
              name="potwierdzHaslo"
              value={dane.potwierdzHaslo}
              onChange={handleChange}
              required
            />
            {errors.potwierdzHaslo && <p className="error-text">{errors.potwierdzHaslo}</p>}
          </div>
          <p className="form-info">
            ⓘ Jeśli jesteś autorem książek i chcesz założyć konto autora,
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
      </div>
    </div>
  );
};

export default SignUp;
