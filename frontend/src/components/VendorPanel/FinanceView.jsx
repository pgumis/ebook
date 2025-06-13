// src/components/VendorPanel/FinanceView.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format, subDays, startOfYear } from 'date-fns';
import './Dashboard.css';
import './FinanceView.css'; // Dedykowany plik stylów

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const FinanceView = () => {
    const userToken = useSelector(state => state.userData.token);

    // Stan dla danych, ładowania i błędów
    const [financeData, setFinanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stan dla zakresu dat
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 29), // Domyślnie ostatnie 30 dni
        to: new Date()
    });
    const [activeFilter, setActiveFilter] = useState('30d');

    useEffect(() => {
        const fetchFinanceData = async () => {
            if (!userToken) return;
            setLoading(true);

            const from_date = format(dateRange.from, 'yyyy-MM-dd');
            const to_date = format(dateRange.to, 'yyyy-MM-dd');

            try {
                const response = await fetch(`http://localhost:8000/api/dostawca/dashboard-stats?start_date=${from_date}&end_date=${to_date}`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                if (!response.ok) throw new Error('Błąd pobierania danych finansowych.');

                const data = await response.json();
                setFinanceData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, [userToken, dateRange]); // Efekt uruchamia się ponownie przy zmianie zakresu dat

    const handleFilterChange = (period) => {
        setActiveFilter(period);
        const today = new Date();
        if (period === '7d') {
            setDateRange({ from: subDays(today, 6), to: today });
        } else if (period === '30d') {
            setDateRange({ from: subDays(today, 29), to: today });
        } else if (period === 'year') {
            setDateRange({ from: startOfYear(today), to: today });
        }
    };

    const chartOptions = { /* ... bez zmian ... */ };

    const chartComponentData = {
        labels: financeData?.salesChart?.labels || [],
        datasets: [{
            label: 'Zysk dzienny (zł)',
            data: financeData?.salesChart?.data || [],
            borderColor: '#4C7766',
            backgroundColor: 'rgba(76, 119, 102, 0.15)',
            tension: 0.3,
            fill: true,
        }],
    };

    return (
        <div className="finance-view-container">
            <div className="finance-header">
                <h2>Analiza Finansowa</h2>
                <div className="date-filter-controls">
                    <button onClick={() => handleFilterChange('7d')} className={activeFilter === '7d' ? 'active' : ''}>7 Dni</button>
                    <button onClick={() => handleFilterChange('30d')} className={activeFilter === '30d' ? 'active' : ''}>30 Dni</button>
                    <button onClick={() => handleFilterChange('year')} className={activeFilter === 'year' ? 'active' : ''}>Ten Rok</button>
                    {/* Tutaj w przyszłości można dodać Date Range Picker */}
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Aktualizowanie danych...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    <div className="finance-kpi-grid">
                        <div className="dashboard-card kpi-card"><h4>Zysk w okresie</h4><p>{financeData?.profitInRange} zł</p></div>
                        <div className="dashboard-card kpi-card"><h4>Sprzedane sztuki</h4><p>{financeData?.soldInRange}</p></div>
                    </div>
                    <div className="finance-main-grid">
                        <div className="dashboard-card chart-card-finance">
                            <h4>Wykres sprzedaży</h4>
                            <div className="chart-wrapper"><Line options={chartOptions} data={chartComponentData} /></div>
                        </div>
                        <div className="dashboard-card top-ebooks-card-finance">
                            <h4>Bestsellery w okresie</h4>
                            {financeData?.topEbooks?.length > 0 ? (
                                <ol className="top-ebooks-list">
                                    {financeData.topEbooks.map((ebook, i) => <li key={i}><span>{ebook.tytul}</span><strong>{ebook.total_sold} szt.</strong></li>)}
                                </ol>
                            ) : <p>Brak sprzedaży w tym okresie.</p>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FinanceView;