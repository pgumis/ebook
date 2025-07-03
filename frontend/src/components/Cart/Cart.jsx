import "./Cart.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cart";
import CartItem from "./CartItem";
import { viewActions } from '../../store/view';
const Cart = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const { items, totalAmount, status } = useSelector((state) => state.cart);

  const handleDelete = (id) => {
    dispatch(cartActions.removeItemFromCart({ token: userData.token, itemId: id }));
  };


  const handleGoToCheckout = () => {
    dispatch(viewActions.changeView('checkout'));
  };

  if (status === 'loading') {
    return <div className="panel"><p>Ładowanie koszyka...</p></div>;
  }

  return (
      <div className="panel cart-page">
        <h2>Twój koszyk</h2>
        {items.length > 0 ? (
            <div className="cart-content">
              <div className="cart-items-list">
                {items.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onDelete={handleDelete}
                    />
                ))}
              </div>
              <div className="cart-summary">
                <h3>Podsumowanie</h3>
                <div className="summary-row">
                  <span>Suma częściowa:</span>
                  <span>{totalAmount.toFixed(2)} zł</span>
                </div>
                <div className="summary-row total">
                  <span>Do zapłaty:</span>
                  <span>{totalAmount.toFixed(2)} zł</span>
                </div>
                <button className="cart-checkout-btn" onClick={handleGoToCheckout}>
                  Przejdź do płatności
                </button>
              </div>
            </div>
        ) : (
            <p className="empty-cart-message">Twój koszyk jest pusty.</p>
        )}
      </div>
  );
};

export default Cart;