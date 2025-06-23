// src/components/OwnerPanel/shared/EnhancedDateRangePicker.jsx
import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import pl from 'date-fns/locale/pl';
import { startOfDay, endOfDay, subDays, startOfMonth, startOfYear } from 'date-fns';

registerLocale('pl', pl);

const EnhancedDateRangePicker = ({ onDateChange }) => {
    // 'month' będzie naszym domyślnym wyborem
    const [activePreset, setActivePreset] = useState('month');

    // Te stany będą przechowywać aktualnie wybrane daty
    const [startDate, setStartDate] = useState(startOfMonth(new Date()));
    const [endDate, setEndDate] = useState(new Date());

    // Ta funkcja jest sercem komponentu. Ustawia daty na podstawie wybranego presetu.
    const handlePresetClick = (preset) => {
        setActivePreset(preset);

        // Jeśli użytkownik wybrał "Niestandardowy", po prostu pokazujemy DatePickery i nic nie zmieniamy
        if (preset === 'custom') {
            return;
        }

        let newStart;
        const newEnd = endOfDay(new Date()); // Gotowe presety zawsze kończą się "dzisiaj"

        switch (preset) {
            case 'today':
                newStart = startOfDay(new Date());
                break;
            case 'week':
                newStart = startOfDay(subDays(new Date(), 6));
                break;
            case 'month':
                newStart = startOfMonth(new Date());
                break;
            case 'year':
                newStart = startOfYear(new Date());
                break;
            default:
                newStart = startOfMonth(new Date());
        }

        setStartDate(newStart);
        setEndDate(newEnd);
        onDateChange(newStart, newEnd); // Informujemy komponent nadrzędny o zmianie
    };

    // Funkcje do obsługi ręcznej zmiany dat w trybie niestandardowym
    const handleCustomStartDateChange = (date) => {
        setStartDate(date);
        onDateChange(date, endDate);
    };

    const handleCustomEndDateChange = (date) => {
        setEndDate(date);
        onDateChange(startDate, date);
    };

    // Efekt, który ustawi domyślny zakres dat (ten miesiąc) przy pierwszym renderowaniu
    useEffect(() => {
        handlePresetClick('month');
    }, []); // Pusta tablica zależności sprawia, że wykona się to tylko raz

    return (
        <div className="enhanced-date-picker-container">
            <div className="presets-toolbar">
                <button onClick={() => handlePresetClick('today')} className={activePreset === 'today' ? 'active' : ''}>Dziś</button>
                <button onClick={() => handlePresetClick('week')} className={activePreset === 'week' ? 'active' : ''}>Ostatnie 7 dni</button>
                <button onClick={() => handlePresetClick('month')} className={activePreset === 'month' ? 'active' : ''}>Ten miesiąc</button>
                <button onClick={() => handlePresetClick('year')} className={activePreset === 'year' ? 'active' : ''}>Ten rok</button>
                <button onClick={() => handlePresetClick('custom')} className={activePreset === 'custom' ? 'active' : ''}>Niestandardowy</button>
            </div>

            {/* Pokazujemy DatePickery tylko, gdy wybrany jest tryb niestandardowy */}
            {activePreset === 'custom' && (
                <div className="custom-range-picker">
                    <div>
                        <label>Od:</label>
                        <DatePicker selected={startDate} onChange={handleCustomStartDateChange} dateFormat="dd.MM.yyyy" locale="pl" />
                    </div>
                    <div>
                        <label>Do:</label>
                        <DatePicker selected={endDate} onChange={handleCustomEndDateChange} dateFormat="dd.MM.yyyy" locale="pl" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedDateRangePicker;