// src/components/OwnerPanel/views/ProductsAnalysisView.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';

const ProductsAnalysisView = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = useSelector(state => state.userData.token);

    useEffect(() => {
        if (!userToken) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                // Pamiętaj, aby dodać tę trasę w routes/api.php
                const response = await fetch('http://localhost:8000/api/wlasciciel/products-analysis', {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                setAnalysisData(data);
            } catch (error) {
                console.error("Błąd analizy produktów:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userToken]);

    if (loading) return <p>Analizowanie danych o produktach...</p>;
    if (!analysisData) return <p>Brak danych.</p>;

    const topCategoriesData = {
        labels: analysisData.topCategories.map(c => c.nazwa),
        datasets: [{
            label: 'Przychód z kategorii',
            data: analysisData.topCategories.map(c => c.total_revenue),
            backgroundColor: '#22c55e',
        }]
    };

    const topVendorsData = {
        labels: analysisData.topVendors.map(v => `${v.imie} ${v.nazwisko}`),
        datasets: [{
            label: 'Przychód od dostawcy',
            data: analysisData.topVendors.map(v => v.total_revenue),
            backgroundColor: '#f97316',
        }]
    };

    return (
        <div className="analysis-view">
            <h2>Analiza Produktów</h2>
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>TOP 10 Kategorii (wg. przychodu)</h3>
                    <div className="chart-wrapper"><Bar data={topCategoriesData} options={{ indexAxis: 'y' }} /></div>
                </div>
                <div className="chart-container">
                    <h3>TOP 10 Dostawców (wg. przychodu)</h3>
                    <div className="chart-wrapper"><Bar data={topVendorsData} options={{ indexAxis: 'y' }} /></div>
                </div>
            </div>

            <div className="table-grid">
                <div className="table-container">
                    <h3>TOP 10 Bestsellerów</h3>
                    <table>
                        <thead><tr><th>Tytuł</th><th>Sprzedano</th></tr></thead>
                        <tbody>
                        {analysisData.bestSellingEbooks.map((ebook, i) => <tr key={i}><td>{ebook.tytul}</td><td>{ebook.total_sold || 0}</td></tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="table-container">
                    <h3>TOP 10 Najsłabiej sprzedających się</h3>
                    <table>
                        <thead><tr><th>Tytuł</th><th>Sprzedano</th></tr></thead>
                        <tbody>
                        {analysisData.worstSellingEbooks.map((ebook, i) => <tr key={i}><td>{ebook.tytul}</td><td>{ebook.total_sold}</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductsAnalysisView;