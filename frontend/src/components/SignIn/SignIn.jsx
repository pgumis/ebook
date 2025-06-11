import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userDataActions } from "../../store/userData";
import { viewActions } from "../../store/view";
import "./SignIn.css";

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [haslo, setHaslo] = useState(""); // Zostajemy przy 'haslo' zgodnie z poprzednią poprawką
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/logowanie", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, haslo }),
      });

      const data = await response.json(); // 'data' to obiekt z API, który mi wkleiłeś

      if (!response.ok) {
        throw new Error(data.message || data.error || "Nie udało się zalogować.");
      }

      // --- KLUCZOWA ZMIANA JEST TUTAJ ---
      // Zamiast wysyłać 'data' bezpośrednio, tworzymy nowy, czysty obiekt.
      const userDataToStore = {
        loggedIn: true, // <-- NAJWAŻNIEJSZE: Ustawiamy stan zalogowania na TRUE!
        id: data.user.id, // Bierzemy dane z zagnieżdżonego obiektu 'user'
        imie: data.user.imie,
        nazwisko: data.user.nazwisko,
        email: data.user.email,
        role: data.user.rola,
        numer_telefonu: data.user.numer_telefonu,
        zdjecie_profilowe: data.user.zdjecie_profilowe,
        token: data.token // Bierzemy token z głównego obiektu
      };

      // Zapisujemy i wysyłamy do Redux nasz nowy, poprawny obiekt
      localStorage.setItem("userData", JSON.stringify(userDataToStore));
      dispatch(userDataActions.setData(userDataToStore));
      dispatch(viewActions.changeView("home"));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // ... reszta kodu (część JSX) pozostaje bez zmian ...
  return (
      <div className="login-page-container">
        <div className="login-card">
          <img src="/e-book%20na%20wynos%20logo.png" alt="Logo" className="login-logo" />
          <h2>Zaloguj się</h2>
          <p className="login-subtitle">Witaj ponownie! Cieszymy się, że jesteś.</p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Adres e-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Wpisz swój email" required disabled={loading} />
            </div>
            <div className="input-group">
              <label htmlFor="password">Hasło</label>
              <div className="password-input-wrapper">
                <input id="password" type={isPasswordVisible ? "text" : "password"} value={haslo} onChange={(e) => setHaslo(e.target.value)} placeholder="Wpisz swoje hasło" required disabled={loading} />
                <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                  <i className={isPasswordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>
            {error && <p className="login-error-message">{error}</p>}
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>
          <div className="login-helper-links">
            <a href="#" onClick={() => dispatch(viewActions.changeView("resetPassword"))}>Nie pamiętasz hasła?</a>
            <p>Nie masz konta?{" "}<a href="#" onClick={() => dispatch(viewActions.changeView("signUp"))}>Zarejestruj się</a></p>
          </div>
        </div>
      </div>
  );
};

export default SignIn;