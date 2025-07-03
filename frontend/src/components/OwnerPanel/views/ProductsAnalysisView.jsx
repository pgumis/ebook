import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import EnhancedDateRangePicker from '../shared/EnhancedDateRangePicker';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TableControls = ({ config, onConfigChange, showSort = true }) => (
    <div className="table-controls">
        {showSort && (
            <div className="filter-group">
                <label>Kolejność:</label>
                <select name="direction" value={config.direction} onChange={(e) => onConfigChange(e.target.name, e.target.value)}>
                    <option value="desc">Najwyższe wyniki</option>
                    <option value="asc">Najniższe wyniki</option>
                </select>
            </div>
        )}
        <div className="filter-group">
            <label>Pokaż:</label>
            <select name="limit" value={config.limit} onChange={(e) => onConfigChange(e.target.name, e.target.value)}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
        </div>
    </div>
);
const ProductsAnalysisView = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = useSelector(state => state.userData.token);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const [sectionConfigs, setSectionConfigs] = useState({
        bestsellers: { limit: 10 },
        worstSellers: { limit: 10 },
        categories: { limit: 10, direction: 'desc' },
        vendors: { limit: 10, direction: 'desc' }
    });

    useEffect(() => {
        if (!userToken || !dateRange.startDate || !dateRange.endDate) return;

        const fetchData = async () => {
            setLoading(true);
            const formattedStartDate = dateRange.startDate.toISOString().split('T')[0];
            const formattedEndDate = dateRange.endDate.toISOString().split('T')[0];
            try {
                const params = new URLSearchParams({
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    limit_bestsellers: sectionConfigs.bestsellers.limit,
                    limit_worst_sellers: sectionConfigs.worstSellers.limit,
                    limit_categories: sectionConfigs.categories.limit,
                    direction_categories: sectionConfigs.categories.direction,
                    limit_vendors: sectionConfigs.vendors.limit,
                    direction_vendors: sectionConfigs.vendors.direction,
                });
                const response = await fetch(`http://localhost:8000/api/wlasciciel/products-analysis?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                setAnalysisData(data);
            } catch (error) {
                console.error("Błąd analizy produktów:", error);
                setAnalysisData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userToken, dateRange, sectionConfigs]);

    const handleDateChange = (start, end) => {
        setDateRange({ startDate: start, endDate: end });
    };

    const handleConfigChange = (section, key, value) => {
        setSectionConfigs(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: value }
        }));
    };

    const topCategoriesData = {
        labels: analysisData?.topCategories.map(c => c.kategoria) || [],
        datasets: [{
            label: 'Przychód z kategorii',
            data: analysisData?.topCategories.map(c => c.total_revenue) || [],
            backgroundColor: '#22c55e',
        }]
    };

    const topVendorsData = {
        labels: analysisData?.topVendors.map(v => `${v.imie} ${v.nazwisko}`) || [],
        datasets: [{
            label: 'Przychód od dostawcy',
            data: analysisData?.topVendors.map(v => v.total_revenue) || [],
            backgroundColor: '#f97316',
        }]
    };

    return (
        <div className="analysis-view">
            <h2>Analiza Produktów</h2>
            <EnhancedDateRangePicker onDateChange={handleDateChange} />

            {loading ? <LoadingSpinner /> : !analysisData ? <EmptyState message="Brak danych do wyświetlenia dla wybranego okresu." /> : (
                <>
                    <div className="charts-grid">
                        <div className="chart-container">
                            <TableControls
                                config={sectionConfigs.categories}
                                onConfigChange={(key, value) => handleConfigChange('categories', key, value)}
                            />
                            <h3>{sectionConfigs.categories.direction === 'desc' ? 'TOP' : 'Najsłabsze'} {sectionConfigs.categories.limit} Kategorie</h3>
                            <div className="chart-wrapper"><Bar data={topCategoriesData} options={{ indexAxis: 'y' }} /></div>
                        </div>
                        <div className="chart-container">
                            <TableControls
                                config={sectionConfigs.vendors}
                                onConfigChange={(key, value) => handleConfigChange('vendors', key, value)}
                            />
                            <h3>{sectionConfigs.vendors.direction === 'desc' ? 'TOP' : 'Najsłabsi'} {sectionConfigs.vendors.limit} Dostawcy</h3>
                            <div className="chart-wrapper"><Bar data={topVendorsData} options={{ indexAxis: 'y' }} /></div>
                        </div>
                    </div>

                    <div className="table-grid">
                        <div className="table-container">
                            <TableControls
                                config={sectionConfigs.bestsellers}
                                onConfigChange={(key, value) => handleConfigChange('bestsellers', key, value)}
                                showSort={false}
                            />
                            <h3>TOP {sectionConfigs.bestsellers.limit} Bestsellerów</h3>
                            <table>
                                <thead><tr><th>Lp.</th><th>Tytuł</th><th>Sprzedano</th></tr></thead>
                                <tbody>
                                {analysisData.bestSellingEbooks.map((ebook, i) => <tr key={i}><td>{i + 1}.</td><td>{ebook.tytul}</td><td>{ebook.total_sold || 0}</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-container">
                            <TableControls
                                config={sectionConfigs.worstSellers}
                                onConfigChange={(key, value) => handleConfigChange('worstSellers', key, value)}
                                showSort={false}
                            />
                            <h3>TOP {sectionConfigs.worstSellers.limit} Najsłabiej sprzedających się</h3>
                            <table>
                                <thead><tr><th>Lp.</th><th>Tytuł</th><th>Sprzedano</th></tr></thead>
                                <tbody>
                                {analysisData.worstSellingEbooks.map((ebook, i) => <tr key={i}><td>{i + 1}.</td><td>{ebook.tytul}</td><td>{ebook.total_sold || 0}</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductsAnalysisView;