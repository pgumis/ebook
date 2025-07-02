// src/components/OwnerPanel/shared/EnhancedDateRangePicker.jsx
import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import pl from 'date-fns/locale/pl';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subQuarters } from 'date-fns';

registerLocale('pl', pl);

const EnhancedDateRangePicker = ({ onDateChange }) => {
    const [activePreset, setActivePreset] = useState('month');
    const [startDate, setStartDate] = useState(startOfMonth(new Date()));
    const [endDate, setEndDate] = useState(new Date());
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());

    // --- NOWA ZMIANA: Dodajemy stan, który "pamięta" ostatnio wybrany kwartał ---
    const [selectedQuarter, setSelectedQuarter] = useState(1);

    const handlePresetClick = (preset, quarter = null) => {
        setActivePreset(preset);

        // --- NOWA ZMIANA: Jeśli kliknięto kwartał, zapisujemy jego numer ---
        if (preset === 'quarter' && quarter) {
            setSelectedQuarter(quarter);
        }

        if (preset === 'custom') {
            return;
        }

        let newStart, newEnd = endOfDay(new Date());
        const yearForStepper = new Date(displayYear, 0, 1);

        switch (preset) {
            case 'today':
            case 'week':
            case 'month':
                // Logika dla tych presetów jest prosta i nie zależy od displayYear
                newStart = preset === 'today' ? startOfDay(new Date()) :
                    preset === 'week' ? startOfDay(subDays(new Date(), 6)) :
                        startOfMonth(new Date());
                newEnd = endOfDay(new Date());
                break;
            case 'yearStepper':
                newStart = startOfYear(yearForStepper);
                newEnd = endOfYear(yearForStepper);
                break;
            case 'quarter':
                const quarterDate = new Date(displayYear, (quarter - 1) * 3, 1);
                newStart = startOfQuarter(quarterDate);
                newEnd = endOfQuarter(quarterDate);
                break;
            default:
                newStart = startOfMonth(new Date());
        }

        setStartDate(newStart);
        setEndDate(newEnd);
        onDateChange(newStart, newEnd);
    };

    // --- POPRAWIONY EFEKT ---
    useEffect(() => {
        // Gdy zmienia się rok, ponownie wywołujemy logikę dla aktywnego presetu
        if (activePreset === 'yearStepper') {
            handlePresetClick('yearStepper');
        } else if (activePreset === 'quarter') {
            // Używamy zapamiętanego numeru kwartału
            handlePresetClick('quarter', selectedQuarter);
        }
    }, [displayYear]);


    useEffect(() => {
        handlePresetClick('month');
    }, []);

    const handleCustomStartDateChange = (date) => { /* ... bez zmian ... */ };
    const handleCustomEndDateChange = (date) => { /* ... bez zmian ... */ };

    return (
        <div className="enhanced-date-picker-container">
            <div className="presets-toolbar">
                {/* Przyciski kwartałów teraz przekazują swój numer */}
                <button onClick={() => handlePresetClick('today')} className={activePreset === 'today' ? 'active' : ''}>Dziś</button>
                <button onClick={() => handlePresetClick('week')} className={activePreset === 'week' ? 'active' : ''}>Ostatnie 7 dni</button>
                <button onClick={() => handlePresetClick('month')} className={activePreset === 'month' ? 'active' : ''}>Bieżący miesiąc</button>
                <button onClick={() => handlePresetClick('quarter', 1)} className={activePreset === 'quarter' && selectedQuarter === 1 ? 'active' : ''}>I kw.</button>
                <button onClick={() => handlePresetClick('quarter', 2)} className={activePreset === 'quarter' && selectedQuarter === 2 ? 'active' : ''}>II kw.</button>
                <button onClick={() => handlePresetClick('quarter', 3)} className={activePreset === 'quarter' && selectedQuarter === 3 ? 'active' : ''}>III kw.</button>
                <button onClick={() => handlePresetClick('quarter', 4)} className={activePreset === 'quarter' && selectedQuarter === 4 ? 'active' : ''}>IV kw.</button>

                <div className="year-stepper">
                    <button onClick={() => setDisplayYear(y => y - 1)}>-</button>
                    <button onClick={() => handlePresetClick('yearStepper')} className={activePreset === 'yearStepper' ? 'active' : ''}>
                        Rok {displayYear}
                    </button>
                    <button onClick={() => setDisplayYear(y => y + 1)}>+</button>
                </div>

                <button onClick={() => handlePresetClick('custom')} className={activePreset === 'custom' ? 'active' : ''}>Niestandardowy</button>
            </div>

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