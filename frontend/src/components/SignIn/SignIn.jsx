import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { viewActions } from "../../store/view";
import { userDataActions } from "../../store/userData";

import Logo from "../Logo/Logo";
const SignIn = () => {
  const dispatch = useDispatch();
  const [dane, setDane] = useState({
    email: "",
    haslo: "",
  });

  const [komunikat, setKomunikat] = useState("");

  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/logowanie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dane),
    });

    const wynik = await response.json();

    if (response.ok) {
      //powinno zwracac info z backendu
      const userData = {
        loggedIn: true,
        id: wynik.user?.id || 1, 
        userName: wynik.user?.imie || "test",
        email: wynik.user?.email || dane.email,
        phoneNumber: wynik.user?.numer_telefonu || "123456789",
        role: wynik.user?.rola || "user",
        profilePic: wynik.user?.zdjecie_profilowe || "profile.jpg",
        token: wynik.token,
      };
      setKomunikat(wynik.komunikat);
      //API POWINNO ZWRACAĆ INFO NA TEMAT ROLI. NA RAZIE RĘCZNIE ZMIENIAMY ROLE NA  'klient', 'dostawca', 'admin'
      dispatch(userDataActions.setData({loggedIn: true, id: 1, userName: 'test', email: 'test@gmail.com', imie:'Jan', nazwisko: 'Kowalski', phoneNumber: '123456789', role: 'admin', profilePic: "profile.jpg", token: wynik.token}));
      dispatch(viewActions.changeView('home'))
      localStorage.setItem("token", wynik.token);
      localStorage.setItem("userData", JSON.stringify(userData));

    } else {
      console.log(wynik.bledy);
      if(wynik.bledy)
      {
        const problemPassword = wynik.bledy['haslo'];
        console.log(JSON.stringify(wynik.bledy));
        if(problemPassword[0]==="The haslo field must be at least 6 characters.")
        {
          setKomunikat("Hasło zbyt krótkie");
        }

      }
      else{
        setKomunikat("Nieprawidłowe dane!");
      }
     
    }
  };

  return (
    <div className="screen-center">
      <div className="form-wrapper">
        <Logo />
        <h3>Witamy!</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: 0 }}>
          <div className="form-whole-line">
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              value={dane.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-whole-line">
            <label for="email">Hasło</label>
            <input
              type="password"
              name="haslo"
              value={dane.password}
              onChange={handleChange}
              required
            />
          </div>
          <span
            className="form-info"
            style={{ fontSize: "1rem", marginBottom: "0.8rem" }}
          >
            <a href="#" onClick={() => {
              dispatch(viewActions.changeView("resetPassword"));
            }}>Przypomnij hasło</a>
          </span>
          <button type="submit" className="form-submit">
            Zaloguj się
          </button>
          <button
            className="form-submit form-second-button"
            onClick={() => {
              dispatch(viewActions.changeView("signUp"));
            }}
          >
            Nie masz konta?
          </button>
        </form>
        {komunikat && <p>{komunikat}</p>}
      </div>
    </div>
  );
};
export default SignIn;
