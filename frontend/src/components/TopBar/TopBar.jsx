import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewActions } from "../../store/view";
import { userDataActions } from "../../store/userData";
import TopBarListOption from "./TopBarListOption";
import "./TopBar.css";
import { cartActions } from "../../store/cart";

const slogans = [
  "Twoja biblioteka w kieszeni",
  "Odkryj nową historię",
  "Książki zawsze pod ręką",
];

const typingSpeed = 120;
const sloganPause = 6000;
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
  const cartItems = useSelector((state) => state.cart.items);
  const currView = useSelector((state) => state.view.selectedView);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [displayedSlogan, setDisplayedSlogan] = useState("");
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const currentSlogan = slogans[sloganIndex];
      let charIndex = 0;
      setDisplayedSlogan("");

      const typingInterval = setInterval(() => {
        if (charIndex < currentSlogan.length) {
          setDisplayedSlogan((prev) =>
            currentSlogan.substring(0, charIndex + 1)
          );
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setSloganIndex((prev) => (prev + 1) % slogans.length);
          }, sloganPause);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    };

    const cleanup = handleTyping();
    return cleanup;
  }, [sloganIndex]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    console.log(windowWidth);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

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

  const handleSignOut = () => {
    dispatch(userDataActions.clearData());
    dispatch(cartActions.clearCart());
    localStorage.clear();
    setShowProfileMenu(false);
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
  const isCustomerView = !userData.role || userData.role === "klient";
  const isPrivilegedUser = ["dostawca", "admin", "wlasciciel"].includes(
    userData.role
  );

  return (
    <>
      {isMobileMenuOpen && (
        <div className="top-bar-menu-open">
          <button className="close-menu-button" onClick={handleMenuClose}>
            ✕
          </button>
          <div className="mobile-nav-menu-options">
            {userData.role !== "admin" && (
              <>
                {(userData.role === "klient" || userData.role === "")&&<div
                  className="search-bar-trigger"
                  onClick={() => {
                    handleMenuClose();
                    dispatch(viewActions.toggleSearchOverlay(true));
                  }}
                >
                  <i className="fas fa-search"></i>
                  <span>Wyszukaj tytuł lub autora...</span>
                </div>}
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
                {userData.loggedIn && (
                  <>
                    <a
                      onClick={() => {
                        handleMenuClose();
                        dispatch(viewActions.changeView("profileDetails"));
                      }}
                    >
                      Zarządzaj profilem
                    </a>
                    {userData.role === "klient" && (
                      <>
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
                      </>
                    )}
                  </>
                )}
                {userData.role !== "admin" && <a
                  onClick={() => {
                    handleMenuClose();
                    dispatch(viewActions.changeView("contact"));
                  }}
                >
                  Kontakt
                </a>}
              </>
            )}
            {userData.loggedIn === true && (
              <a
                onClick={() => {
                  handleMenuClose();
                  handleSignOut();
                }}
              >
                Wyloguj się
              </a>
            )}
          </div>
        </div>
      )}
      <nav className="top-bar">
        <div className="top-bar-left-section">
          <div
            className="logo-group"
            onClick={() => dispatch(viewActions.changeView("home"))}
          >
            <img src="/logo.png" alt="Logo - ikona" className="top-bar-logo" />
            <img
              src="/logo napis.png"
              alt="E-book na wynos - napis"
              className="top-bar-logo-napis"
            />
          </div>
          {windowWidth > 600 && (
            <div className="slogan-container">
              <span className="logo-slogan">{displayedSlogan}</span>
              {displayedSlogan.length < slogans[sloganIndex].length && (
                <span className="typing-cursor">|</span>
              )}
            </div>
          )}
        </div>

        {isSearchBarVisible && windowWidth > 900 && (
          <div
            className="search-bar-trigger"
            onClick={() => dispatch(viewActions.toggleSearchOverlay(true))}
          >
            <i className="fas fa-search"></i>
            <span>Wyszukaj tytuł lub autora...</span>
          </div>
        )}

        {(isSearchBarVisible ? windowWidth > 1200 : windowWidth > 834) && (
          <div className="nav-right-side">
            {userData.role !== "admin" && (
              <button
                className="nav-icon-btn"
                onClick={() => dispatch(viewActions.changeView("contact"))}
                title="Kontakt"
              >
                <i className="fas fa-envelope"></i>
              </button>
            )}

            {userData.loggedIn ? (
              <>
                {userData.role === "klient" && (
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
                )}

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
                      {userData.role !== "admin" && (
                        <>
                          <TopBarListOption
                            icon={<ProfileIcon />}
                            onClick={() =>
                              dispatch(viewActions.changeView("profileDetails"))
                            }
                          >
                            Zarządzaj profilem
                          </TopBarListOption>
                          {userData.role === "klient" && (
                            <TopBarListOption
                              icon={<HistoryIcon />}
                              onClick={() =>
                                dispatch(
                                  viewActions.changeView("purchaseHistory")
                                )
                              }
                            >
                              Historia zamówień
                            </TopBarListOption>
                          )}
                        </>
                      )}
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
        {(isSearchBarVisible ? windowWidth < 1200 : windowWidth < 834) && (
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
