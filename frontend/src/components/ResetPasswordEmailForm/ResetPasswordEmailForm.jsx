import { useState } from "react";
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import Logo from "../Logo/Logo";

const ResetPasswordForm = () => {
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
  };

  return (
    <div className="screen-center">
      <div className="form-wrapper">
        <Logo />
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
          
          <p className="form-info">
            ⓘ Na podany przez Ciebie adres email wyślemy link do <br />zresetowania hasła
          </p>
          <button type="submit" className="form-submit"  onClick={()=>{dispatch(viewActions.changeView('resetPassword'))}}>
            Zresetuj hasło
          </button>
        </form>
        {komunikat && <p>{komunikat}</p>}
      </div>
    </div>
  );
};
export default ResetPasswordForm;