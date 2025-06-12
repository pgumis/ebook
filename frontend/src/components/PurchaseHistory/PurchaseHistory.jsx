// PurchaseHistory.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import SinglePurchase from "./SinglePurchase";
import "./PurchaseHistory.css";

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector(state => state.userData.token);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/historia-zamowien', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setPurchases(data);
            } catch (error) {
                console.error("Błąd pobierania historii zamówień:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    if (loading) return <div className="panel"><p>Ładowanie historii zamówień...</p></div>;

    return (
        <div className="panel purchase-history-container">
            <h3>Historia zamówień</h3>
            {purchases.length > 0 ? (
                purchases.map((purchase) => (
                    <SinglePurchase key={purchase.id} purchaseObj={purchase} />
                ))
            ) : (
                <p>Nie masz jeszcze żadnych zamówień.</p>
            )}
        </div>
    );
};

export default PurchaseHistory;