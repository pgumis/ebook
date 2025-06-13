// src/components/VendorPanel/DashboardContainer.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Dashboard.css';
import DashboardSingleInfo from "./DashboardSingleInfo";

const DashboardContainer = () => {
    const userData = useSelector(state => state.userData);
    const [stats, setStats] = useState({ publishedBooks: '...', soldThisMonth: '...', profitThisMonth: '...' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!userData.loggedIn) return;
            try {
                // Używamy tego samego endpointu, ale wykorzystamy tylko część danych
                const response = await fetch('http://localhost:8000/api/dostawca/dashboard-stats', {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                });
                if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
                const data = await response.json();
                setStats({
                    publishedBooks: data.publishedBooks.toString(),
                    soldThisMonth: data.soldThisMonth.toString(),
                    profitThisMonth: data.profitThisMonth,
                });
            } catch (err) {
                setError("Nie udało się załadować statystyk.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [userData.loggedIn, userData.token]);

    if (loading) return <div className="loading-spinner">Ładowanie...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-grid-layout">
            <div className="stat-card-main"><DashboardSingleInfo name="Zysk w tym miesiącu" value={stats.profitThisMonth} /></div>
            <div className="stat-card"><DashboardSingleInfo name="Sprzedanych w tym miesiącu" value={stats.soldThisMonth} /></div>
            <div className="stat-card"><DashboardSingleInfo name="Wystawione książki" value={stats.publishedBooks} /></div>

            {/* Można tu w przyszłości dodać np. listę ostatnich 5 recenzji lub zamówień */}
            <div className="dashboard-card placeholder-card" style={{gridColumn: '1 / -1'}}>
                <h4>Ostatnia aktywność</h4>
                <p>Wkrótce tutaj pojawią się ostatnie zamówienia i recenzje.</p>
            </div>
        </div>
    );
}

export default DashboardContainer;