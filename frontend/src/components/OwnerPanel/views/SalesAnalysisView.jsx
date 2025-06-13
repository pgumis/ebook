// Plik: src/components/OwnerPanel/views/SalesAnalysisView.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Line, Bar } from 'react-chartjs-2';
import '../OwnerPanel.css';
import { format, subDays, startOfYear } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AnalysisCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-info"><h4>{title}</h4><p>{value}</p></div>
        <div className="stat-icon"><i className={icon}></i></div>
    </div>
);

const SalesAnalysisView = () => {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 29)));
    const [endDate, setEndDate] = useState(new Date());
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = useSelector(state => state.userData.token);

    useEffect(() => {
        if (!userToken) return;
        const fetchData = async () => {
            setLoading(true);
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
            try {
                const response = await fetch(`http://localhost:8000/api/wlasciciel/sales-analysis?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                if (!response.ok) throw new Error(`Błąd pobierania danych: ${response.statusText}`);
                const data = await response.json();
                setAnalysisData(data);
            } catch (error) {
                console.error("Błąd analizy sprzedaży:", error);
                setAnalysisData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [startDate, endDate, userToken]);

    const chartOptions = { responsive: true, maintainAspectRatio: false };
    const daysOfWeekLabels = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

    const salesOverTimeData = {
        labels: analysisData?.salesOverTime?.labels || [],
        datasets: [{
            label: 'Przychód dzienny',
            data: analysisData?.salesOverTime?.data || [],
            borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true,
        }]
    };

    const salesByDayData = {
        labels: daysOfWeekLabels,
        datasets: [{
            label: 'Przychód w dni tygodnia',
            data: daysOfWeekLabels.map((_, i) => analysisData?.salesByDayOfWeek[i + 1] || 0),
            backgroundColor: '#8b5cf6',
        }]
    };

    return (
        <div className="analysis-view">
            <h2>Analiza Sprzedaży</h2>
            <div className="date-picker-controls">
                <div><label>Od:</label><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd.MM.yyyy" locale="pl"/></div>
                <div><label>Do:</label><DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd.MM.yyyy" locale="pl"/></div>
            </div>
            {loading ? <p>Analizowanie danych...</p> : !analysisData ? <p>Brak danych do wyświetlenia dla wybranego okresu.</p> : (
                <>
                    <div className="stats-grid">
                        <AnalysisCard title="Całkowity przychód" value={`${(analysisData.kpi.totalRevenue || 0).toFixed(2)} zł`} icon="fas fa-coins" />
                        <AnalysisCard title="Liczba zamówień" value={analysisData.kpi.totalOrders} icon="fas fa-receipt" />
                        <AnalysisCard title="Sprzedane e-booki" value={analysisData.kpi.totalEbooksSold} icon="fas fa-book" />
                        <AnalysisCard title="Śr. wartość zamówienia" value={`${(analysisData.kpi.averageOrderValue || 0).toFixed(2)} zł`} icon="fas fa-calculator" />
                    </div>
                    <div className="charts-grid">
                        <div className="chart-container"><h3>Sprzedaż w czasie</h3><p className="chart-subtitle">Dzienny przychód w wybranym zakresie dat.</p><div className="chart-wrapper"><Line options={chartOptions} data={salesOverTimeData} /></div></div>
                        <div className="chart-container"><h3>Sprzedaż wg. dnia tygodnia</h3><p className="chart-subtitle">Zsumowany przychód dla każdego dnia tygodnia.</p><div className="chart-wrapper"><Bar options={chartOptions} data={salesByDayData} /></div></div>
                    </div>
                    <div className="table-container">
                        <h3>Bestsellery w wybranym okresie</h3>
                        <table>
                            <thead><tr><th>Lp.</th><th>Tytuł e-booka</th><th>Sprzedanych sztuk</th></tr></thead>
                            <tbody>
                            {analysisData.topSellingEbooks.map((ebook, index) => (
                                <tr key={index}><td>{index + 1}</td><td>{ebook.tytul}</td><td>{ebook.total_sold}</td></tr>
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