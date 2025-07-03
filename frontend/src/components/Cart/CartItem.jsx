import React from 'react';
import './Cart.css';
const CartItem = ({ item, onDelete }) => {

    const priceAsNumber = parseFloat(item.price) || 0;

    return (
        <div className="cart-item-container">
            <div className="cart-item-left">
                <img
                    src={item.okladka}
                    alt={`Okładka ${item.title}`}
                    className="cart-img"
                />
                <div className="cart-book-info">
                    <span className="cart-item-title">{item.title}</span>
                    <span className="cart-item-author">{item.author}</span>
                    <span className="cart-item-format">Format: {item.format}</span>
                </div>
            </div>
            <div className="cart-item-right">
                <span className="cart-item-price">{priceAsNumber.toFixed(2)} PLN</span>
                <button
                    className="cart-delete-element-btn"
                    onClick={() => onDelete(item.id)}
                    title="Usuń z koszyka"
                >
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    );
};

export default CartItem;