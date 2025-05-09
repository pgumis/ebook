import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import "./TopBar.css";
import Logo from "../Logo/Logo";

const TopBar = () => {
  const dispatch = useDispatch();

  return (
    <nav>
      <Logo
        onClick={() => {
          dispatch(viewActions.changeView("home"));
        }}
      />
      <input type="text" className="nav-search-bar"/>
      <div className="nav-right-side">
        <button
          className="nav-icon-btn"
          onClick={() => {
            dispatch(viewActions.changeView("home"));
          }}
        >
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 19V10.5C20 10.1852 19.8518 9.88885 19.6 9.7L12.6 4.45C12.2444 4.18333 11.7556 4.18333 11.4 4.45L4.4 9.7C4.14819 9.88885 4 10.1852 4 10.5V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V19C14 19.5523 14.4477 20 15 20H19C19.5523 20 20 19.5523 20 19Z"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>
        <button
          className="nav-icon-btn"
          onClick={() => {
            dispatch(viewActions.changeView("contact"));
          }}
        >
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 9H16M8 12H16M8 15H11M21 12C21 16.9706 16.9706 21 12 21C10.2289 21 8.57736 20.4884 7.18497 19.605L3 21L4.39499 16.815C3.51156 15.4226 3 13.7711 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>

        <button
          className="sign-in nav-buttons"
          onClick={() => {
            dispatch(viewActions.changeView("signIn"));
          }}
        >
          Zaloguj się
        </button>
        <button
          className="sign-up nav-buttons"
          onClick={() => {
            dispatch(viewActions.changeView("signUp"));
          }}
        >
          Zarejestruj się
        </button>
      </div>
    </nav>
  );
};
export default TopBar;
