// src/components/OwnerPanel/views/MainDashboardView.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Możesz stworzyć reużywalny komponent StatCard
const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-icon">
            <i className={icon}></i>
        </div>
        <div className="stat-info">
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    </div>
);

const MainDashboardView = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = useSelector(state => state.userData.token);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/wlasciciel/main-dashboard', {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Błąd pobierania statystyk dla właściciela:", error);
            } finally {
                setLoading(false);
            }
        };

        if(userToken) {
            fetchStats();
        }
    }, [userToken]);

    if (loading) return <p>Ładowanie danych...</p>;
    if (!stats) return <p>Nie udało się załadować danych.</p>;

    const { kpi, usersByRole } = stats;

    return (
        <div>
            <h2>Pulpit Główny</h2>
            <div className="stats-grid">
                <StatCard title="Przychód w tym miesiącu" value={kpi.monthlyRevenue} icon="fas fa-cash-register" />
                <StatCard title="Całkowity przychód" value={kpi.totalRevenue} icon="fas fa-landmark" />
                <StatCard title="Nowi użytkownicy (miesiąc)" value={kpi.newUsersThisMonth} icon="fas fa-user-plus" />
                <StatCard title="Wszystkich użytkowników" value={kpi.totalUsers} icon="fas fa-users" />
                <StatCard title="Zamówienia dzisiaj" value={kpi.ordersToday} icon="fas fa-receipt" />
                <StatCard title="Wszystkie e-booki" value={kpi.totalEbooks} icon="fas fa-book" />
            </div>
            {/* Tutaj można dodać wykresy, np. podział użytkowników na role */}
        </div>
    );
};

export default MainDashboardView;