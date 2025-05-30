import "./Cart.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cart";

const Cart = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const cart = useSelector((state) => state.cart);
  const items = cart.items || [];
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/koszyk", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.komunikat || "Błąd pobierania koszyka");
        }

        const data = await response.json();
        console.log(data); // POBIERAM SAMO ID KSIAZKI ALE NIE INFO NA JEJ TEMAT
        const newItems = data.pozycje.map((pozycja) => ({
          id: pozycja.ebook_id,
          title: pozycja.ebook.tytul,
          author: pozycja.ebook.autor,
          price: parseFloat(pozycja.ebook.cena),
          okladka: pozycja.ebook.okladka,
        }));
        dispatch(
          cartActions.setCart({
            items: newItems,
            suma: 0, // Ignorujemy data.suma z backendu
          })
        );
        const calculatedTotal = newItems.reduce((sum, item) => sum + item.price, 0);
        setTotal(calculatedTotal);
      } catch (error) {
        console.error("Błąd pobierania koszyka:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData.token) {
      fetchCart();
    }
  }, [userData.token, dispatch]);
  const handleDelete = (id) => {
    dispatch(cartActions.removeItem(id));
  };
  return (
    <div className="panel">
      {isLoading ? (
        <p
          style={{
            fontSize: "1.1rem",
            textAlign: "center",
          }}
        >
          Pobieranie koszyka
        </p>
      ) : items.length > 0 ? (
        <>
          <h2>Twój koszyk</h2>
          <button
            className="cart-btn"
            onClick={() => alert("Płatność zrealizowana")}
          >
            Przejdź do płatności
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M15 8H12M9 16H12M12 16H13C14.1046 16 15 15.1046 15 14V14C15 12.8954 14.1046 12 13 12H11C9.89543 12 9 11.1046 9 10V10C9 8.89543 9.89543 8 11 8H12M12 16V18M12 8V6"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={item.okladka}
                  alt="okładka książki"
                  className="cart-img"
                />
                <div className="cart-book-info">
                  <span>{item.title}</span>
                  <span>{item.author}</span>
                  <span>ID: {item.id}</span>
                  <span>Kategoria: {item.kategoria || "Brak kategorii"}</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <button
                  className="cart-delete-element-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 7V7C9 5.34315 10.3431 4 12 4V4C13.6569 4 15 5.34315 15 7V7M9 7H15M9 7H6M15 7H18M20 7H18M4 7H6M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7"
                      stroke="#6a6a6a"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </button>
                <span style={{ fontSize: "1.3rem" }}>{item.price.toFixed(2)} PLN</span>
              </div>
            </div>
          ))}
          <div>
            <strong>Suma: {(typeof(total) === "Number" && total.toFixed(2)) || 0} PLN</strong>
          </div>
        </>
      ) : (
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Twój koszyk jest pusty.
        </p>
      )}
    </div>
  );
};
export default Cart;
