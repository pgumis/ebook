// src/components/VendorPanel/FinanceView.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './Dashboard.css'; // Ponownie używamy tych samych stylów co dashboard

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const FinanceView = () => {
    const userData = useSelector(state => state.userData);
    const [chartData, setChartData] = useState(null);
    const [topEbooks, setTopEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFinanceData = async () => {
            if (!userData.loggedIn) return;
            try {
                // Używamy tego samego endpointu, ale wykorzystamy inne dane
                const response = await fetch('http://localhost:8000/api/dostawca/dashboard-stats', {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                });
                if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`);
                const data = await response.json();
                setChartData({
                    labels: data.salesChart.labels,
                    datasets: [{
                        label: 'Zysk dzienny (zł)',
                        data: data.salesChart.data,
                        borderColor: '#4C7766',
                        backgroundColor: 'rgba(76, 119, 102, 0.15)',
                        tension: 0.3,
                        fill: true,
                    }],
                });
                setTopEbooks(data.topEbooks);
            } catch (err) {
                setError("Nie udało się załadować danych finansowych.");
            } finally {
                setLoading(false);
            }
        };
        fetchFinanceData();
    }, [userData.loggedIn, userData.token]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: (value) => value + ' zł' } } }
    };

    if (loading) return <div className="loading-spinner">Ładowanie...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        // Używamy siatki, ale tylko dla dwóch głównych elementów
        <div className="dashboard-grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
            {/* WYKRES */}
            {chartData && (
                <div className="dashboard-card" style={{ gridColumn: '1 / 2' }}>
                    <h4>Analiza sprzedaży w ostatnim miesiącu</h4>
                    <div className="chart-wrapper">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>
            )}

            {/* TOP EBOOKS */}
            {topEbooks.length > 0 && (
                <div className="dashboard-card" style={{ gridColumn: '2 / 3' }}>
                    <h4>Najpopularniejsze w tym miesiącu</h4>
                    <ol className="top-ebooks-list">
                        {topEbooks.map((ebook, index) => (
                            <li key={index}>
                                <span className="ebook-title">{ebook.tytul}</span>
                                <span className="ebook-sales"><strong>{ebook.total_sold}</strong> szt.</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default FinanceView;