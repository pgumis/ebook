import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cart";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const items = cart.items || [];
  console.log(cart);
  const handleDelete = (id) => {
    dispatch(cartActions.removeItem(id))
  }
  return (
    <>
      {items.length > 0 ? (
        <div className="panel">
          <h2>Twój koszyk</h2>
          <button
            className="cart-btn"
            onClick={() => {
              alert("Płatność zrealizowana");
            }}
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
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <img
                    src="okladka2.jpg"
                    alt="okladka ksiazki"
                    className="cart-img"
                  />
                </div>
                <div className="cart-book-info">
                  <span>{item.title}</span>
                  <span>{item.author}</span>
                   <span>{item.id}</span>
                  <span>Kategoria książki</span>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'flex-end'}}>
                <button className="cart-delete-element-btn" onClick={()=>{handleDelete(item.id)}}>
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
                <span style={{fontSize: '1.3rem'}}>{item.price} PLN</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="panel"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Twój koszyk jest pusty.
          </p>
        </div>
      )}
    </>
  );
};
export default Cart;
