// src/components/OwnerPanel/views/SalesAnalysisView.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Line, Bar } from 'react-chartjs-2';

// Importujemy wszystkie potrzebne elementy z chart.js - mieliśmy je już wcześniej
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);


// Mały komponent pomocniczy
const AnalysisCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-info">
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
        <div className="stat-icon"><i className={icon}></i></div>
    </div>
);


const SalesAnalysisView = () => {
    // Domyślnie ustawiamy ostatnie 30 dni
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = useSelector(state => state.userData.token);

    // Efekt do pobierania danych, uruchamiany przy zmianie dat
    useEffect(() => {
        if (!userToken) return;

        const fetchData = async () => {
            setLoading(true);
            // Formatowanie dat do stringa YYYY-MM-DD
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            try {
                const response = await fetch(`http://localhost:8000/api/wlasciciel/sales-analysis?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                if (!response.ok) throw new Error('Błąd pobierania danych');
                const data = await response.json();
                setAnalysisData(data);
            } catch (error) {
                console.error("Błąd analizy sprzedaży:", error);
                setAnalysisData(null); // Wyczyść dane w razie błędu
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, userToken]);

    // --- Przygotowanie danych do wykresów ---
    const chartOptions = { responsive: true, maintainAspectRatio: false };
    const daysOfWeekLabels = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

    const salesOverTimeData = {
        labels: analysisData?.salesOverTime.map(d => d.date) || [],
        datasets: [{
            label: 'Przychód dzienny',
            data: analysisData?.salesOverTime.map(d => d.total) || [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
        }]
    };

    const salesByDayData = {
        labels: daysOfWeekLabels,
        datasets: [{
            label: 'Przychód w dni tygodnia',
            data: daysOfWeekLabels.map((_, i) => analysisData?.salesByDayOfWeek[i + 1] || 0), // Mapujemy 1-7 na 0-6
            backgroundColor: '#8b5cf6',
        }]
    };

    return (
        <div className="analysis-view">
            <h2>Analiza Sprzedaży</h2>

            {/* Kontrolki do wyboru dat */}
            <div className="date-picker-controls">
                <div>
                    <label>Od:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div>
                    <label>Do:</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
            </div>

            {loading ? <p>Analizowanie danych...</p> : !analysisData ? <p>Brak danych do wyświetlenia dla wybranego okresu.</p> : (
                <>
                    {/* Sekcja z kartami KPI */}
                    <div className="stats-grid">
                        <AnalysisCard title="Całkowity przychód" value={`${analysisData.kpi.totalRevenue.toFixed(2)} zł`} icon="fas fa-coins" />
                        <AnalysisCard title="Liczba zamówień" value={analysisData.kpi.totalOrders} icon="fas fa-receipt" />
                        <AnalysisCard title="Śr. wartość zamówienia" value={`${analysisData.kpi.averageOrderValue.toFixed(2)} zł`} icon="fas fa-calculator" />
                    </div>

                    {/* Sekcja z wykresami */}
                    <div className="charts-grid">
                        <div className="chart-container">
                            <h3>Sprzedaż w czasie</h3>
                            <div className="chart-wrapper"><Line options={chartOptions} data={salesOverTimeData} /></div>
                        </div>
                        <div className="chart-container">
                            <h3>Sprzedaż wg. dnia tygodnia</h3>
                            <div className="chart-wrapper"><Bar options={chartOptions} data={salesByDayData} /></div>
                        </div>
                    </div>

                    {/* Sekcja z tabelą bestsellerów */}
                    <div className="table-container">
                        <h3>Bestsellery w wybranym okresie</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Lp.</th>
                                <th>Tytuł e-booka</th>
                                <th>Sprzedanych sztuk</th>
                            </tr>
                            </thead>
                            <tbody>
                            {analysisData.topSellingEbooks.map((ebook, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{ebook.tytul}</td>
                                    <td>{ebook.total_sold}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default SalesAnalysisView;