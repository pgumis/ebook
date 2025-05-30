import "./BookDetails.css";
import Rating from "../Rating/Rating";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import { cartActions } from "../../store/cart";
import generateStars from "../../utils/generateStars";

const BookDetails = () => {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.view);
  const userData = useSelector((state) => state.userData);
  const cart = useSelector((state) => state.cart);

  const selectedBook = view.bookDetailsObj;
  const isInCart = cart.items.find((item) => item.id === selectedBook.id);
  const [message, setMessage] = useState("");
  const [addedNow, setAddedNow] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const [mouseOverValue, setMouseOverValue] = useState(0);
  const [rating, setRating] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(0);

  const [dane, setDane] = useState({
    recenzja: "",
    opinia: 0,
  });

  useEffect(() => {
    if (openRating && contentRef.current) {
      requestAnimationFrame(() => {
        const scrollHeight = contentRef.current.scrollHeight;
        setHeight(`${scrollHeight + 32}px`);
      });
    } else {
      setHeight("0px");
    }
  }, [openRating]);

  useEffect(() => {
    if (isInCart && !addedNow) {
      setMessage("Produkt jest już w Twoim koszyku");
    }
  }, [isInCart, addedNow]);

  const handleAdd = async () => {
    setMessage("Dodano produkt do koszyka!");
    setAddedNow(true);
    try {
      const response = await fetch("http://localhost:8000/api/koszyk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ ebook_id: selectedBook.id }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.komunikat || "Błąd dodawania do koszyka");
      }
      const data = await response.json();
      dispatch(cartActions.addItem({ ...selectedBook }));
    } catch (error) {
      console.error("Błąd dodawania do koszyka:", error.message);
    }
    //dispatch(cartActions.addItem({ id: data.id}));
  };
  const handleOpenRating = () => {
    setOpenRating(!openRating);
  };
  const handleRating = (rating) => {
    setRating(rating);
    setConfirmedRating(rating);
    console.log(rating);
  };
  const handleChange = (e) => {
    setDane({ ...dane, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.id || !selectedBook.id) {
      alert("Błąd: Brak ID użytkownika lub książki.");
      return;
    }
    if (dane.opinia < 1 || dane.opinia > 5) {
      alert("Proszę wybrać ocenę od 1 do 5.");
      return;
    }

    const payload = {
      uzytkownik_id: userData.id,
      ebook_id: selectedBook.id,
      ocena: dane.opinia,
      tresc: dane.recenzja || null,
    };
    console.log("Token:", userData.token);
    console.log("Payload:", payload);

    try {
      const response = await fetch("http://localhost:8000/api/recenzje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Błąd zapisu recenzji");
      }

      const result = await response.json();
      console.log("Sukces:", result);
      setOpenRating(false);
      setConfirmedRating(0);
      setDane({ recenzja: "", opinia: 0 });
    } catch (error) {
      console.error("Błąd:", error.message);
      alert(`Nie udało się zapisać recenzji: ${error.message}`);
    }
  };

  const [recenzje, setRecenzje] = useState([]);

  useEffect(() => {
    const fetchRecenzje = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/ebooki/${selectedBook.id}/recenzje`
        );
        if (!response.ok) throw new Error("Błąd podczas pobierania recenzji");

        const data = await response.json();
        setRecenzje(data); // zakładamy, że API zwraca tablicę recenzji
      } catch (error) {
        console.error("Błąd:", error.message);
      }
    };

    if (selectedBook?.id) fetchRecenzje();
  }, [selectedBook?.id]);

  return (
    <div className="book-details-wrapper panel">
      <div className="book-details-main-info">
        <div className="book-details-img-container">
          <img
            src={selectedBook.okladka}
            alt="okładka"
            className="book-details-img"
          />
        </div>
        <div className="book-details-rigt-panel">
          <div className="book-details-info-container">
            <p className="book-details-title">{selectedBook.title}</p>
            <p className="book-details-author">{selectedBook.author}</p>
            <p className="book-details-price">{selectedBook.price}</p>
            <div className="book-details-rating">
              {generateStars(selectedBook.rating)}
            </div>
          </div>
          {userData.role !== "dostawca" && (
            <div style={{ width: "100%" }}>
              <p hidden={userData.loggedIn}>
                Aby dodać produkt do koszyka musisz być{" "}
                <a
                  href="#"
                  onClick={() => {
                    dispatch(viewActions.changeView("signIn"));
                  }}
                >
                  zalogowany
                </a>
              </p>
              {message && <p>{message}</p>}
              <button
                className="book-details-add-book"
                disabled={!userData.loggedIn || isInCart}
                onClick={() => {
                  handleAdd();
                }}
              >
                Dodaj do koszyka
              </button>
            </div>
          )}
          {userData.role === "dostawca" && (
            <button
              className="book-details-add-book"
              disabled={!userData.loggedIn || isInCart}
              onClick={() => {
                dispatch(viewActions.changeView("editBookDetails"));
              }}
            >
              Edytuj informacje
            </button>
          )}
        </div>
      </div>

      <div className="book-details-ratings-container">
        <div className="book-details-rating-top-section">
          <h3>Opinie użytkowników</h3>
          {userData.loggedIn && userData.role !== "dostawca" && (
            <button onClick={handleOpenRating}>+ Napisz recenzję</button>
          )}
        </div>
        <div
          style={{
            maxHeight: height,
            overflow: "hidden",
            transition: "max-height 0.5s ease",
          }}
        >
          <div
            ref={contentRef}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <form onSubmit={handleSubmit}>
              <div
                style={{ color: "lightgray", fontSize: "2rem" }}
                className="book-details-rating-stars"
              >
                <span
                  onMouseOver={() => {
                    setMouseOverValue(1);
                    setRating(0);
                  }}
                  onMouseOut={() => {
                    setMouseOverValue(0);
                    setRating(confirmedRating);
                  }}
                  onClick={() => {
                    handleRating(1);
                    setDane({ ...dane, opinia: 1 });
                  }}
                  style={{
                    color:
                      rating > 0
                        ? "orange"
                        : mouseOverValue > 0
                        ? "orange"
                        : "lightgray",
                  }}
                >
                  ★
                </span>
                <span
                  onMouseOver={() => {
                    setMouseOverValue(2);
                    setRating(0);
                  }}
                  onMouseOut={() => {
                    setMouseOverValue(0);
                    setRating(confirmedRating);
                  }}
                  onClick={() => {
                    handleRating(2);
                    setDane({ ...dane, opinia: 2 });
                  }}
                  style={{
                    color:
                      rating > 1
                        ? "orange"
                        : mouseOverValue > 1
                        ? "orange"
                        : "lightgray",
                  }}
                >
                  ★
                </span>
                <span
                  onMouseOver={() => {
                    setMouseOverValue(3);
                    setRating(0);
                  }}
                  onMouseOut={() => {
                    setMouseOverValue(0);
                    setRating(confirmedRating);
                  }}
                  onClick={() => {
                    handleRating(3);
                    setDane({ ...dane, opinia: 3 });
                  }}
                  style={{
                    color:
                      rating > 2
                        ? "orange"
                        : mouseOverValue > 2
                        ? "orange"
                        : "lightgray",
                  }}
                >
                  ★
                </span>
                <span
                  onMouseOver={() => {
                    setMouseOverValue(4);
                    setRating(0);
                  }}
                  onMouseOut={() => {
                    setMouseOverValue(0);
                    setRating(confirmedRating);
                  }}
                  onClick={() => {
                    handleRating(4);
                    setDane({ ...dane, opinia: 4 });
                  }}
                  style={{
                    color:
                      rating > 3
                        ? "orange"
                        : mouseOverValue > 3
                        ? "orange"
                        : "lightgray",
                  }}
                >
                  ★
                </span>
                <span
                  onMouseOver={() => {
                    setMouseOverValue(5);
                    setRating(0);
                  }}
                  onMouseOut={() => {
                    setMouseOverValue(0);
                    setRating(confirmedRating);
                  }}
                  onClick={() => {
                    handleRating(5);
                    setDane({ ...dane, opinia: 5 });
                  }}
                  style={{
                    color:
                      rating > 4
                        ? "orange"
                        : mouseOverValue > 4
                        ? "orange"
                        : "lightgray",
                  }}
                >
                  ★
                </span>
              </div>
              <textarea
                name="recenzja"
                onChange={handleChange}
                placeholder="Wpisz swoją opinię..."
                style={{
                  width: "100%",
                  height: "100px",
                  resize: "vertical",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  marginBottom: "1rem",
                  resize: "none",
                }}
              />
              <div className="rating-btns-container">
                <button
                  className="contact-form-cancel-button"
                  onClick={() => setOpenRating(false)}
                >
                  Anuluj
                </button>
                <button className="form-submit contact-form-send" type="submit">
                  Wyślij
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="book-details-raiting">
          <span style={{ fontSize: "1rem", fontWeight: "normal" }}>
            średnia ocen użytkowników
          </span>
          <span>{selectedBook.rating}</span>
          <div>{generateStars(selectedBook.rating)}</div>
        </div>
        <div className="book-details-users-rating-wrapper">
          {recenzje.length > 0 ? (
            recenzje.map((recenzja, index) => (
              <Rating
                key={index}
                ratingObj={{
                  author: recenzja.uzytkownik?.nazwa || "Anonim",
                  authorImg:
                    recenzja.uzytkownik?.avatar || "default-avatar.png",
                  rating: recenzja.ocena,
                  date: new Date(recenzja.created_at).toLocaleDateString(
                    "pl-PL"
                  ),
                  text: recenzja.tresc,
                }}
                index={index}
              />
            ))
          ) : (
            <p>Brak recenzji dla tej książki.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default BookDetails;
