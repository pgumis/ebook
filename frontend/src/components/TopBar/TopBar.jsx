import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewActions } from "../../store/view";
import { userDataActions } from "../../store/userData";
import TopBarListOption from "./TopBarListOption";
import "./TopBar.css";
import { cartActions } from "../../store/cart";

// Definicje ikon SVG jako komponenty lub stałe dla czystości kodu
const ProfileIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M17 17C17 14.7909 14.7614 13 12 13C9.23858 13 7 14.7909 7 17M12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const HistoryIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M12 6.60324C13.6667 5.33178 17.5 3.74246 21 6.60324V19C17.5 16.1392 13.6667 17.7285 12 19M12 6.60324C10.3333 5.33178 6.5 3.74246 3 6.60324V19C6.5 16.1392 10.3333 17.7285 12 19M12 6.60324V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const LogoutIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M8 17L12 12M12 12L8 7M12 12H3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TopBar = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const cartItems = useSelector((state) => state.cart.items); // Pobieramy dane koszyka
  const currView = useSelector((state) => state.view.selectedView);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize); // nasłuchuj zmiany rozmiaru
    return () => window.removeEventListener("resize", handleResize); // usuń nasłuchiwacz przy unmount
  }, [windowWidth]);

  // Zamykanie menu profilu po kliknięciu na zewnątrz
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    console.log(`Wyszukiwanie frazy: ${searchTerm}`);
    // TODO: Dodać logikę zmiany widoku na stronę z wynikami wyszukiwania
    // dispatch(viewActions.changeView("searchResults"));
    // dispatch(viewActions.setSearchTerm(searchTerm));
  };

  const handleSignOut = () => {
    dispatch(userDataActions.clearData());
    dispatch(cartActions.clearCart());
    localStorage.clear();
    dispatch(viewActions.changeView("home"));
  };
  const isSearchBarVisible = userData.role === "" || userData.role === "klient";

  const handleMenuOpenning = () => {
    setIsMobileMenuOpen(true);
    document.body.classList.add("no-scroll");
  };
  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove("no-scroll");
  };
  return (
    <>
      {isMobileMenuOpen && (
        <div className="top-bar-menu-open">
          <button className="close-menu-button" onClick={handleMenuClose}>
            ✕
          </button>
          <div className="mobile-nav-menu-options">
            {!userData.loggedIn && (
              <>
                <a
                  onClick={() => {
                    handleMenuClose();
                    dispatch(viewActions.changeView("signIn"));
                  }}
                >
                  Zaloguj się
                </a>
                <a
                  onClick={() => {
                    handleMenuClose();
                    dispatch(viewActions.changeView("signUp"));
                  }}
                >
                  Zarejestruj się
                </a>
              </>
            )}
            <a
              onClick={() => {
                handleMenuClose();
                dispatch(viewActions.changeView("profileDetails"));
              }}
            >
              Zarządzaj profilem
            </a>
            <a
              onClick={() => {
                handleMenuClose();
                dispatch(viewActions.changeView("cart"));
              }}
            >
              Koszyk
            </a>

            <a
              onClick={() => {
                handleMenuClose();
                dispatch(viewActions.changeView("purchaseHistory"));
              }}
            >
              Historia zamówień
            </a>
            <a
              onClick={() => {
                handleMenuClose();
                dispatch(viewActions.changeView("contact"));
              }}
            >
              Kontakt
            </a>

            <a
              onClick={() => {
                handleMenuClose();
                handleSignOut();
              }}
            >
              Wyloguj się
            </a>
          </div>
        </div>
      )}
      <nav className="top-bar">
        <img
          className="top-bar-logo"
          src="/e-book na wynos logo.png"
          alt="Logo E-book na wynos"
          onClick={() => dispatch(viewActions.changeView("home"))}
        />

        {isSearchBarVisible && (
          <form className="search-bar-form" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder={
                windowWidth > 824 ? "Wyszukaj tytuł lub autora..." : "Szukaj"
              }
              className="nav-search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {
              <button
                type="submit"
                className="search-icon-btn"
                aria-label="Szukaj"
              >
                <i className="fas fa-search"></i>
              </button>
            }
          </form>
        )}

        {windowWidth > 768 && (
          <div className="nav-right-side">
            <button
              className="nav-icon-btn"
              onClick={() => dispatch(viewActions.changeView("contact"))}
              title="Kontakt"
            >
              <i className="fas fa-envelope"></i>
            </button>

            {userData.loggedIn ? (
              <>
                <button
                  className="nav-icon-btn cart-btn"
                  onClick={() => dispatch(viewActions.changeView("cart"))}
                  title="Koszyk"
                >
                  <i className="fas fa-shopping-cart"></i>
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
                </button>

                <div className="profile-section" ref={profileMenuRef}>
                  <div
                    className="profile-activator"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <span className="profile-greeting">
                      Witaj, {userData.imie}
                    </span>
                    <img
                      src={userData.zdjecie_profilowe || "/default-avatar.png"}
                      className="top-bar-profile-picture"
                      alt="Avatar"
                    />
                  </div>
                  {showProfileMenu && (
                    <div className="profile-dropdown-menu">
                      <TopBarListOption
                        icon={<ProfileIcon />}
                        onClick={() =>
                          dispatch(viewActions.changeView("profileDetails"))
                        }
                      >
                        Zarządzaj profilem
                      </TopBarListOption>
                      <TopBarListOption
                        icon={<HistoryIcon />}
                        onClick={() =>
                          dispatch(viewActions.changeView("purchaseHistory"))
                        }
                      >
                        Historia zamówień
                      </TopBarListOption>
                      <TopBarListOption
                        icon={<LogoutIcon />}
                        onClick={handleSignOut}
                        last
                      >
                        Wyloguj
                      </TopBarListOption>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="logged-out-buttons">
                <button
                  className="sign-in-btn"
                  onClick={() => dispatch(viewActions.changeView("signIn"))}
                >
                  Zaloguj się
                </button>
                <button
                  className="sign-up-btn"
                  onClick={() => dispatch(viewActions.changeView("signUp"))}
                >
                  Zarejestruj się
                </button>
              </div>
            )}
          </div>
        )}
        {windowWidth < 768 && (
          <button
            className="top-bar-burger"
            aria-label="Otwórz menu kategorii"
            onClick={handleMenuOpenning}
          >
            <i className="fas fa-bars"></i>
          </button>
        )}
      </nav>
    </>
  );
};

export default TopBar;
