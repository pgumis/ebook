import { useState } from "react";
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import "./ResetPasswordForm.css";

const ResetPasswordForm = () => {
  const dispatch = useDispatch();


  const [emailSent, setEmailSent] = useState(false);

  const [dane, setDane] = useState({
    email: "",
    haslo: "",
    powtorzHaslo: "",
    kod: "",
  });

  const [komunikat, setKomunikat] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setKomunikat({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8000/api/haslo/wyslij-kod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: dane.email }),
      });
      const wynik = await response.json();

      if (response.ok) {
        setKomunikat({ text: wynik.message, type: "success" });
        setEmailSent(true);
      } else {
        setKomunikat({ text: wynik.message || "Wystąpił błąd.", type: "error" });
      }
    } catch (err) {
      setKomunikat({ text: "Błąd połączenia z serwerem.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (dane.haslo !== dane.powtorzHaslo || dane.haslo.length < 6) {
      setKomunikat({ text: "Hasła muszą być identyczne i mieć co najmniej 6 znaków.", type: "error" });
      return;
    }
    setLoading(true);
    setKomunikat({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8000/api/haslo/resetuj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: dane.email,
          kod: dane.kod,
          haslo: dane.haslo,
          haslo_confirmation: dane.powtorzHaslo,
        }),
      });
      const wynik = await response.json();

      if (response.ok) {
        setKomunikat({ text: "Hasło zostało zmienione! Możesz się teraz zalogować.", type: "success" });
        setTimeout(() => dispatch(viewActions.changeView("signIn")), 2000);
      } else {
        setKomunikat({ text: `Błąd: ${wynik.message || "Wystąpił błąd."}`, type: "error" });
      }
    } catch (err) {
      setKomunikat({ text: "Błąd połączenia z serwerem.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="reset-password-page-container">
        <div className="reset-password-card">
          <img src="/e-book na wynos logo.png" alt="Logo" className="reset-password-logo" />
          <h2>Zresetuj hasło</h2>
          <p className="reset-password-subtitle">
            {!emailSent
                ? "Wpisz swój e-mail, aby otrzymać kod resetujący."
                : "Sprawdź skrzynkę, wpisz otrzymany kod i ustaw nowe hasło."}
          </p>

          <form onSubmit={emailSent ? handlePasswordResetSubmit : handleEmailSubmit} className="reset-password-form" noValidate>

            <div className="input-group">
              <label htmlFor="email">Adres e-mail</label>
              <input id="email" type="email" name="email" value={dane.email} onChange={handleChange} required disabled={loading || emailSent}/>
            </div>

            {emailSent && (
                <>
                  <div className="input-group">
                    <label htmlFor="kod">Kod z e-maila</label>
                    <input id="kod" type="text" name="kod" value={dane.kod} onChange={handleChange} required disabled={loading}/>
                  </div>
                  <div className="input-group">
                    <label htmlFor="haslo">Nowe hasło</label>
                    <input id="haslo" type="password" name="haslo" value={dane.haslo} onChange={handleChange} required disabled={loading}/>
                  </div>
                  <div className="input-group">
                    <label htmlFor="powtorzHaslo">Powtórz nowe hasło</label>
                    <input id="powtorzHaslo" type="password" name="powtorzHaslo" value={dane.powtorzHaslo} onChange={handleChange} required disabled={loading}/>
                  </div>
                </>
            )}

            {komunikat.text && <p className={`reset-password-main-message ${komunikat.type}`}>{komunikat.text}</p>}

            <button type="submit" className="reset-password-submit-btn" disabled={loading}>
              {loading ? "Przetwarzanie..." : (emailSent ? "Zmień hasło" : "Wyślij kod")}
            </button>
          </form>

          <div className="reset-password-helper-links">
            <p>Pamiętasz hasło? <a href="#" onClick={() => dispatch(viewActions.changeView("signIn"))}>Wróć do logowania</a></p>
          </div>
        </div>
      </div>
  );
};

export default ResetPasswordForm;