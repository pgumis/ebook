// src/components/OwnerPanel/views/UsersAnalysisView.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bar, Line } from 'react-chartjs-2';

const UsersAnalysisView = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = useSelector(state => state.userData.token);

    useEffect(() => {
        if (!userToken) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/wlasciciel/users-analysis', {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                setAnalysisData(data);
            } catch (error) {
                console.error("Błąd analizy użytkowników:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userToken]);

    // Przygotowanie danych do wykresów
    const usersByRoleData = {
        labels: Object.keys(analysisData?.usersByRole || {}),
        datasets: [{
            label: 'Liczba użytkowników',
            data: Object.values(analysisData?.usersByRole || {}),
            backgroundColor: ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981'],
        }]
    };

    const registrationTrendData = {
        labels: analysisData?.registrationTrend.map(d => d.date) || [],
        datasets: [{
            label: 'Nowi użytkownicy dziennie',
            data: analysisData?.registrationTrend.map(d => d.count) || [],
            borderColor: '#10b981',
            tension: 0.2,
        }]
    };

    if (loading) return <p>Analizowanie danych o użytkownikach...</p>;
    if (!analysisData) return <p>Brak danych.</p>;

    return (
        <div className="analysis-view">
            <h2>Analiza Użytkowników</h2>
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Podział na role</h3>
                    <div className="chart-wrapper"><Bar data={usersByRoleData} /></div>
                </div>
                <div className="chart-container">
                    <h3>Trend rejestracji (ost. 30 dni)</h3>
                    <div className="chart-wrapper"><Line data={registrationTrendData} /></div>
                </div>
            </div>

            <div className="table-container">
                <h3>TOP 10 Klientów (wg. wydatków)</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Klient</th>
                        <th>Email</th>
                        <th>Liczba zamówień</th>
                        <th>Suma wydatków</th>
                    </tr>
                    </thead>
                    <tbody>
                    {analysisData.topCustomersBySpending.map((customer, index) => (
                        <tr key={index}>
                            <td>{customer.imie} {customer.nazwisko}</td>
                            <td>{customer.email}</td>
                            <td>{customer.order_count}</td>
                            <td>{customer.total_spent.toFixed(2)} zł</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersAnalysisView;