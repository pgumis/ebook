// frontend/src/components/BooksListFilterPanel/BooksListFilterPanel.jsx
import React, { useState, useEffect } from 'react';

// Ten komponent przyjmuje dwie właściwości (props):
// - onSelectCategory: Funkcja, która zostanie wywołana, gdy użytkownik wybierze kategorię.
// - selectedKategoria: Aktualnie wybrana kategoria, służy do podświetlania aktywnego elementu.
const BooksListFilterPanel = ({ onSelectCategory, selectedKategoria }) => {
    const [kategorie, setKategorie] = useState([]); // Stan do przechowywania listy kategorii
    const [loading, setLoading] = useState(true);   // Stan do zarządzania ładowaniem
    const [error, setError] = useState(null);       // Stan do obsługi błędów

    // useEffect uruchomi się tylko raz po pierwszym renderowaniu komponentu,
    // aby pobrać listę kategorii z API.
    useEffect(() => {
        const pobierzKategorie = async () => {
            setLoading(true); // Ustaw, że ładowanie się rozpoczęło
            setError(null);   // Wyczyść ewentualne poprzednie błędy

            try {
                // Wykonaj zapytanie do endpointu API Laravela dla kategorii
                const response = await fetch('http://localhost:8000/api/kategorie');

                if (!response.ok) {
                    // Jeśli odpowiedź HTTP nie jest OK (np. status 404, 500), rzuć błąd
                    throw new Error(`Błąd HTTP: ${response.status} - ${response.statusText}`);
                }

                const dane = await response.json(); // Parsuj odpowiedź JSON na tablicę stringów
                setKategorie(dane); // Zapisz pobrane kategorie w stanie
            } catch (blad) {
                console.error("Błąd przy pobieraniu kategorii:", blad);
                setError(blad); // Zapisz błąd w stanie
            } finally {
                setLoading(false); // Zakończ ładowanie, niezależnie od wyniku
            }
        };

        pobierzKategorie(); // Wywołaj funkcję pobierającą kategorie
    }, []); // Pusta tablica zależności oznacza, że efekt uruchomi się tylko raz

    // Warunkowe renderowanie w zależności od stanu ładowania i błędów
    if (loading) {
        return <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>Ładowanie kategorii...</div>;
    }

    if (error) {
        return <div className="panel" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Błąd: {error.message}</div>;
    }

    // Renderowanie listy kategorii
    return (
        <div className="panel">
            <h3 style={{marginBottom: '0'}}>Kategorie</h3>
            <br />
            <ul style={{listStyle: "none", padding: 0, margin: 0}}>
                {/* Opcja "Wszystkie Ebooki" - resetuje filtr, pokazując wszystkie książki */}
                <li
                    // Dodaj klasę 'active-category' (lub inną, którą masz w CSS), jeśli aktualnie wybrana kategoria to 'null'
                    className={selectedKategoria === null ? 'active-category' : ''}
                    onClick={() => onSelectCategory(null)} // Wywołaj funkcję z null, aby usunąć filtr
                    style={{ cursor: 'pointer', fontWeight: selectedKategoria === null ? 'bold' : 'normal' }}
                >
                    Wszystkie Ebooki
                </li>
                {/* Mapowanie po pobranych kategoriach i renderowanie ich */}
                {kategorie.map((kategoria, index) => (
                    <li
                        key={index} // Klucz jest ważny w listach Reacta
                        // Dodaj klasę 'active', jeśli ta kategoria jest aktualnie wybrana
                        className={selectedKategoria === kategoria ? 'active-category' : ''}
                        onClick={() => onSelectCategory(kategoria)} // Wywołaj funkcję z nazwą kategorii
                        style={{ cursor: 'pointer', fontWeight: selectedKategoria === kategoria ? 'bold' : 'normal' }}
                    >
                        {kategoria}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BooksListFilterPanel;