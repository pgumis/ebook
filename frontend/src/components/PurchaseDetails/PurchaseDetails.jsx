// PurchaseDetails.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { viewActions } from '../../store/view';
import "./PurchaseDetails.css";

const PurchaseDetails = () => {
  const [zamowienie, setZamowienie] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Pobieramy ID wybranego zamówienia ze stanu Reduxa
  const { selectedItemId: orderId, selectedView } = useSelector(state => state.view);
  const token = useSelector(state => state.userData.token);

  useEffect(() => {
    if (!orderId || selectedView !== 'purchaseDetails') return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/zamowienia/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Nie udało się pobrać szczegółów zamówienia.');
        const data = await response.json();
        setZamowienie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId, token, selectedView]);

  if (loading) return <div className="panel"><p>Ładowanie szczegółów zamówienia...</p></div>;
  if (!zamowienie) return <div className="panel"><p>Nie znaleziono zamówienia.</p></div>;

  const formattedDate = new Date(zamowienie.created_at).toLocaleString('pl-PL');

  return (
      <div className="panel purchase-details-wrapper">
        <div className="details-header">
          <div>
            <h2>Szczegóły zamówienia #{zamowienie.id}</h2>
            <p>Złożono: {formattedDate}</p>
          </div>
          <button
              className="btn-primary-action"
              onClick={() => dispatch(viewActions.changeView('purchaseHistory'))}
          >
            <i className="fas fa-arrow-left"></i> Wróć do historii
          </button>
        </div>

        <div className="details-content">
          <div className="items-list">
            <h4>Zakupione produkty</h4>
            {zamowienie.ebooki.map((ebook) => (
                <div key={ebook.id} className="details-book-container">
                  <img src={ebook.okladka} alt={ebook.tytul} className="details-img" />
                  <div className="details-book-info">
                    <span className="book-title">{ebook.tytul}</span>
                    <span className="book-author">{ebook.autor}</span>
                  </div>
                  <span className="book-price">
                                {parseFloat(ebook.pivot.cena_jednostkowa).toFixed(2)} zł
                            </span>
                </div>
            ))}
          </div>
          <div className="summary-section">
            <h4>Podsumowanie</h4>
            <div className="summary-line">
              <span>Status zamówienia:</span>
              <span className={`status-badge status-${zamowienie.status}`}>{zamowienie.status}</span>
            </div>
            <div className="summary-line">
              <span>Ilość produktów:</span>
              <span>{zamowienie.ebooki.length}</span>
            </div>

            <hr/>
            <div className="summary-line total">
              <span>Suma:</span>
              <span>{parseFloat(zamowienie.suma).toFixed(2)} zł</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PurchaseDetails;