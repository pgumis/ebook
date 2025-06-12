// frontend/src/components/DashboardContainer.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Dashboard.css';
import DashboardSingleInfo from "./DashboardSingleInfo";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DashboardContainer = () => {
    // ... (cała logika useEffect do pobierania danych pozostaje bez zmian) ...
    const userData = useSelector(state => state.userData);
    const [stats, setStats] = useState({ publishedBooks: '...', soldThisMonth: '...', profitThisMonth: '...' });
    const [chartData, setChartData] = useState(null);
    const [topEbooks, setTopEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!userData.loggedIn || !userData.token) {
                setLoading(false);
                return;
            }
            try {
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
                console.error("Błąd przy pobieraniu statystyk dashboardu:", err);
                setError(`Nie udało się załadować statystyk.`);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [userData.loggedIn, userData.token]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: (value) => value + ' zł' } } }
    };

    if (loading) return <div className="loading-spinner">Ładowanie...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-grid-layout">
            {/* STATS CARDS - zajmują całą górną szerokość */}
            <div className="stat-card-main"><DashboardSingleInfo name="Zysk w tym miesiącu" value={stats.profitThisMonth} /></div>
            <div className="stat-card"><DashboardSingleInfo name="Sprzedanych w tym miesiącu" value={stats.soldThisMonth} /></div>
            <div className="stat-card"><DashboardSingleInfo name="Wystawione książki" value={stats.publishedBooks} /></div>

            {/* WYKRES - lewa, większa kolumna */}
            {chartData && (
                <div className="dashboard-card chart-card">
                    <h4>Analiza sprzedaży</h4>
                    <div className="chart-wrapper">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>
            )}

            {/* TOP EBOOKS - prawa, mniejsza kolumna */}
            {topEbooks.length > 0 && (
                <div className="dashboard-card top-ebooks-card">
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
}

export default DashboardContainer;