import { useDispatch, useSelector } from "react-redux";
import { viewActions } from "../../store/view";
import "./TopBar.css";
import Logo from "../Logo/Logo";
import { useState, useRef, useEffect } from "react";
import TopBarListOption from "./TopBarListOption";
import { userDataActions } from "../../store/userData";

const TopBar = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const profileDetailsRef = useRef(null);
  const profilePictureRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDetailsRef.current &&
        !profileDetailsRef.current.contains(event.target) &&
        profilePictureRef.current &&
        !profilePictureRef.current.contains(event.target)
      ) {
        setShowProfileDetails(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSignOut = async () => {
   
      dispatch(userDataActions.clearData());

      localStorage.removeItem("userData");

      dispatch(viewActions.changeView("home"));
  };

    const handleSearch = () => {
        console.log("Przycisk Szukaj kliknięty! (funkcjonalność do zaimplementowania)");
    };

    const handleAdvancedSearchClick = (e) => {
        e.preventDefault();
        console.log("Przycisk Szukanie zaawansowane kliknięty! (funkcjonalność do zaimplementowania)");
    };

  return (
    <nav>
      <Logo
        onClick={() => {
          dispatch(viewActions.changeView("home"));
        }}
      />
        <div className="search-bar-and-button">
            <input type="search" placeholder="Szukaj ebooka..." className="nav-search-bar" />
            <button className="search-button" onClick={handleSearch}>
                Szukaj
            </button>
            <button className="advanced-search-button" onClick={handleAdvancedSearchClick}>
                Szukanie zaawansowane
            </button>
        </div>
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
          className="nav-icon-btn"
          onClick={() => {
            dispatch(viewActions.changeView("cart"));
          }}
          hidden={!userData.loggedIn}
        >
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3H5L5.5 6M5.5 6L7 15H18L21 6H5.5Z"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
            <circle
              cx="8"
              cy="20"
              r="1"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
            <circle
              cx="17"
              cy="20"
              r="1"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>
        <div
          style={{ cursor: "pointer", position: "relative" }}
          hidden={!userData.loggedIn}
        >
          <img
            ref={profilePictureRef}
            src={userData.profilePic}
            className="top-bar-profile-picture"
            onClick={() => {
              setShowProfileDetails(!showProfileDetails);
            }}
          />
          <div
            ref={profileDetailsRef}
            hidden={!showProfileDetails}
            style={{
              position: "absolute",
              top: 32,
              right: 0,
              minWidth: "max-content",
              backgroundColor: "#fff",
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              borderRadius: "10px",
            }}
          >
            <TopBarListOption
              first
              onClick={() => {
                dispatch(viewActions.changeView("profileDetails"));
                setShowProfileDetails(false);
              }}
            >
              Zarządzaj profilem
            </TopBarListOption>
            <TopBarListOption
              onClick={() => {
                dispatch(viewActions.changeView("purchaseHistory"));
                setShowProfileDetails(false);
              }}
            >
              Historia zamówień
            </TopBarListOption>
            <TopBarListOption
              last
              onClick={() => {
                dispatch(viewActions.changeView("settings"));
                setShowProfileDetails(false);
              }}
            >
              Ustawienia
            </TopBarListOption>
            <TopBarListOption
              last
              onClick={() => {
                handleSignOut();
              }}
            >
              Wyloguj
            </TopBarListOption>
          </div>
        </div>

        <button
          className="sign-in nav-buttons"
          onClick={() => {
            dispatch(viewActions.changeView("signIn"));
          }}
          hidden={userData.loggedIn}
        >
          Zaloguj się
        </button>
        <button
          className="sign-up nav-buttons"
          onClick={() => {
            dispatch(viewActions.changeView("signUp"));
          }}
          hidden={userData.loggedIn}
        >
          Zarejestruj się
        </button>
        
      </div>
    </nav>
  );
};
export default TopBar;
