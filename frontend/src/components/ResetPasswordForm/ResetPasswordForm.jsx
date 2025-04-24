import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewActions } from "../../store/view";
import Logo from "../Logo/Logo";

const ResetPasswordEmailForm = () => {
  const dispatch = useDispatch();
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [dane, setDane] = useState({
    email: "",
    haslo: "",
    powtorzHaslo: "",
    token: "",
  });

  const [komunikat, setKomunikat] = useState("");

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/zapomniane-haslo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: dane.email }),
    });

    const wynik = await response.json();

    if (response.ok) {
      setKomunikat(wynik.komunikat);
      console.log(wynik.token);
      setDane((prev) => ({ ...prev, token: wynik.token }));
      setDane({ ...dane, ["token"]: wynik.token });
      console.log(dane);
      setEmailConfirmed(true);
    } else {
      setKomunikat("Błąd: " + JSON.stringify(wynik.bledy));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/reset-hasla", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: dane.email,
        token: dane.token,
        haslo: dane.haslo,
        haslo_confirmation: dane.powtorzHaslo,
      }),
    });

    const wynik = await response.json();

    if (response.ok) {
      setKomunikat(wynik.komunikat);
    } else {
      setKomunikat("Błąd: " + JSON.stringify(wynik.bledy));
    }
  };
  return (
    <>
      {!emailConfirmed && (
        <div className="screen-center">
          <div className="form-wrapper">
            <Logo />
            <form onSubmit={handleEmailSubmit} style={{ marginTop: 0 }}>
              <div className="form-whole-line">
                <label for="email">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={dane.email}
                  required
                />
              </div>

              <p className="form-info">
                ⓘ Na podany przez Ciebie adres email wyślemy link do <br />
                zresetowania hasła
              </p>
              <button
                type="submit"
                className="form-submit"
                onClick={() => {
                  dispatch(viewActions.changeView("resetPassword"));
                }}
              >
                Zresetuj hasło
              </button>
            </form>
            {komunikat && <p>{komunikat}</p>}
          </div>
        </div>
      )}
      {emailConfirmed && (
        <div className="screen-center">
          <div className="form-wrapper">
            <Logo />
            <form onSubmit={handleSubmit} style={{ marginTop: 0 }}>
              <div className="form-whole-line">
                <label for="email">Nowe hasło</label>
                <input
                  type="password"
                  name="haslo"
                  value={dane.haslo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-whole-line">
                <label for="email">Powtórz nowe hasło</label>
                <input
                  type="password"
                  name="powtorzHaslo"
                  value={dane.powtorzHaslo}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="form-submit">
                Zresetuj hasło
              </button>
            </form>
            {komunikat && <p>{komunikat}</p>}
          </div>
        </div>
      )}
    </>
  );
};
export default ResetPasswordEmailForm;
