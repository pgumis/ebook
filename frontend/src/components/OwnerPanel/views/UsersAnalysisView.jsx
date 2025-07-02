// src/components/OwnerPanel/views/UsersAnalysisView.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import EnhancedDateRangePicker from '../shared/EnhancedDateRangePicker';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const UsersAnalysisView = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = useSelector(state => state.userData.token);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    // Połączony stan dla wszystkich opcji tabeli
    const [tableConfig, setTableConfig] = useState({
        sortBy: 'total_spent',
        direction: 'desc',
        limit: 10
    });

    useEffect(() => {
        if (!userToken || !dateRange.startDate || !dateRange.endDate) return;

        const fetchData = async () => {
            setLoading(true);
            const formattedStartDate = dateRange.startDate.toISOString().split('T')[0];
            const formattedEndDate = dateRange.endDate.toISOString().split('T')[0];
            try {
                // Budowanie URL z wszystkimi parametrami
                const params = new URLSearchParams({
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    sort_by: tableConfig.sortBy,
                    direction: tableConfig.direction,
                    limit: tableConfig.limit
                });
                const response = await fetch(`http://localhost:8000/api/wlasciciel/users-analysis?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                setAnalysisData(data);
            } catch (error) {
                console.error("Błąd analizy użytkowników:", error);
                setAnalysisData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userToken, dateRange, tableConfig]); // Efekt reaguje na wszystkie zmiany filtrów

    const handleDateChange = (start, end) => {
        setDateRange({ startDate: start, endDate: end });
    };

    // Jedna funkcja do obsługi wszystkich zmian w konfiguracji tabeli
    const handleTableConfigChange = (e) => {
        const { name, value } = e.target;
        setTableConfig(prev => ({ ...prev, [name]: value }));
    };

    const usersByRoleData = {
        labels: Object.keys(analysisData?.usersByRole || {}),
        datasets: [{
            label: 'Liczba użytkowników',
            data: Object.values(analysisData?.usersByRole || {}),
            backgroundColor: ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981'],
        }]
    };

    const registrationTrendData = {
        labels: analysisData?.registrationTrend?.map(d => d.date) || [],
        datasets: [{
            label: 'Nowi użytkownicy dziennie',
            data: analysisData?.registrationTrend?.map(d => d.count) || [],
            borderColor: '#10b981',
            tension: 0.2,
        }]
    };

    // --- KLUCZOWA POPRAWKA JEST TUTAJ ---
    return (
        <div className="analysis-view">
            <h2>Analiza Użytkowników</h2>
            <EnhancedDateRangePicker onDateChange={handleDateChange} />

            {loading ? (
                <LoadingSpinner />
            ) : !analysisData || analysisData.topCustomersBySpending.length === 0 ? (
                <EmptyState message="Brak danych do wyświetlenia dla wybranego okresu." />
            ) : (
                <>
                    <div className="charts-grid">
                        <div className="chart-container">
                            <h3>Podział na role (ogólnie)</h3>
                            <div className="chart-wrapper"><Bar data={usersByRoleData} /></div>
                            <div className="sub-stats-container">
                                <div className="sub-stat-card">
                                    <h4>Nowi klienci w okresie:</h4>
                                    <p>{analysisData.newUsersInPeriod.klient || 0}</p>
                                </div>
                                <div className="sub-stat-card">
                                    <h4>Nowi dostawcy w okresie:</h4>
                                    <p>{analysisData.newUsersInPeriod.dostawca || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="chart-container">
                            <h3>Trend rejestracji</h3>
                            <div className="chart-wrapper"><Line data={registrationTrendData} /></div>
                        </div>
                    </div>
                    <div className="table-container">
                        {/* Dynamiczny tytuł tabeli */}
                        <h3>TOP {tableConfig.limit} Klientów</h3>

                        {/* Połączone kontrolki do tabeli */}
                        <div className="table-controls">
                            <div className="filter-group">
                                <label htmlFor="limit">Pokaż TOP:</label>
                                <select name="limit" id="limit" value={tableConfig.limit} onChange={handleTableConfigChange}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label htmlFor="sortBy">Sortuj według:</label>
                                <select name="sortBy" id="sortBy" value={tableConfig.sortBy} onChange={handleTableConfigChange}>
                                    <option value="total_spent">Sumy wydatków</option>
                                    <option value="order_count">Liczby zamówień</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label htmlFor="direction">Kolejność:</label>
                                <select name="direction" id="direction" value={tableConfig.direction} onChange={handleTableConfigChange}>
                                    <option value="desc">Malejąco</option>
                                    <option value="asc">Rosnąco</option>
                                </select>
                            </div>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>Lp.</th>
                                <th>Klient</th>
                                <th>Email</th>
                                <th>Liczba zamówień</th>
                                <th>Suma wydatków</th>
                            </tr>
                            </thead>
                            <tbody>
                            {analysisData.topCustomersBySpending.map((customer, index) => (
                                <tr key={index}>
                                    <td>{index + 1}.</td>
                                    <td>{customer.imie} {customer.nazwisko}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.order_count}</td>
                                    <td>{parseFloat(customer.total_spent).toFixed(2)} zł</td>
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

export default UsersAnalysisView;