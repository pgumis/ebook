// src/components/OwnerPanel/views/ReportsView.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';

const ReportsView = () => {
    const [reportType, setReportType] = useState('sales');
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const userToken = useSelector(state => state.userData.token);

    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/wlasciciel/generate-report', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportType,
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                }),
            });

            if (!response.ok) throw new Error('Błąd generowania raportu');

            // Pobranie nazwy pliku z nagłówka odpowiedzi
            const disposition = response.headers.get('content-disposition');
            let fileName = `raport-${reportType}.csv`;
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }

            // Utworzenie obiektu Blob i linku do pobrania
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a); // Wymagane w Firefox
            a.click();
            a.remove();

        } catch (error) {
            console.error(error);
            alert('Wystąpił błąd podczas generowania raportu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analysis-view">
            <h2>Generowanie Raportów</h2>
            <div className="report-generator-form">
                <div className="report-filter-group">
                    <label>Typ raportu:</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)}>
                        <option value="sales">Raport Sprzedaży</option>
                        <option value="users">Raport Użytkowników</option>
                        <option value="products">Raport Produktów</option>
                    </select>
                </div>
                <div className="report-filter-group">
                    <label>Od:</label>
                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="dd.MM.yyyy" locale="pl" />
                </div>
                <div className="report-filter-group">
                    <label>Do:</label>
                    <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="dd.MM.yyyy" locale="pl" />
                </div>
                <button onClick={handleGenerateReport} disabled={loading} className="report-generate-btn">
                    {loading ? 'Generowanie...' : 'Pobierz Raport'}
                </button>
            </div>
        </div>
    );
};

export default ReportsView;