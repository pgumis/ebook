// CheckoutPage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { viewActions } from '../../store/view';
import { cartActions } from '../../store/cart'; // Importujemy akcje koszyka
import './CheckoutPage.css';

const CheckoutPage = () => {
    // === KROK 1: Pobieramy dane bezpośrednio z Reduxa ===
    const { items: koszykItems, totalAmount: sumaKoszyka } = useSelector((state) => state.cart);
    const token = useSelector(state => state.userData.token);

    const [paymentMethod, setPaymentMethod] = useState('karta');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleFinalizeOrder = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8000/api/zamowienia/finalizuj', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.komunikat || 'Nie udało się złożyć zamówienia.');
            }

            alert('Dziękujemy za zakup! Twoje e-booki są już dostępne na Twojej półce.');

            // Po udanym zakupie czyścimy koszyk w Reduxie
            dispatch(cartActions.clearCart());

            // I przechodzimy do profilu, aby zobaczyć "Moją półkę"
            dispatch(viewActions.changeView('profileDetails'));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Zabezpieczenie na wypadek, gdyby ktoś dotarł tu z pustym koszykiem
    if (koszykItems.length === 0 && !loading) {
        return (
            <div className="checkout-container">
                <div className="checkout-card">
                    <h2>Twój koszyk jest pusty</h2>
                    <p>Dodaj produkty do koszyka, aby móc sfinalizować zamówienie.</p>
                    <button className="buy-button" onClick={() => dispatch(viewActions.changeView('home'))}>
                        Wróć do sklepu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <h2>Podsumowanie zamówienia</h2>
                <div className="order-summary">
                    {koszykItems.map(item => (
                        <div key={item.id} className="summary-item">
                            <span>{item.title}</span>
                            <strong>{item.price.toFixed(2)} zł</strong>
                        </div>
                    ))}
                    <div className="summary-total">
                        <span>Suma:</span>
                        <strong>{sumaKoszyka.toFixed(2)} zł</strong>
                    </div>
                </div>

                <h2 className="payment-title">Wybierz metodę płatności</h2>
                <div className="payment-options">
                    <label><input type="radio" name="payment" value="karta" checked={paymentMethod === 'karta'} onChange={() => setPaymentMethod('karta')} /> Karta płatnicza</label>
                    <label><input type="radio" name="payment" value="blik" checked={paymentMethod === 'blik'} onChange={() => setPaymentMethod('blik')} /> BLIK</label>
                    <label><input type="radio" name="payment" value="przelew" checked={paymentMethod === 'przelew'} onChange={() => setPaymentMethod('przelew')} /> Szybki przelew</label>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button className="buy-button" onClick={handleFinalizeOrder} disabled={loading}>
                    {loading ? 'Przetwarzanie...' : 'Kupuję i płacę'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;