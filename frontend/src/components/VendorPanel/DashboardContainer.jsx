// frontend/src/components/DashboardContainer.jsx
import React, { useEffect, useState } from 'react'; // Dodaj React, useEffect, useState
import { useSelector } from 'react-redux'; // Dodaj useSelector
import './Dashboard.css';
import DashboardSingleInfo from "./DashboardSingleInfo"; // Upewnij się, że ten import jest na miejscu

const DashboardContainer = () => {
    // Pobierz dane użytkownika (w tym token) z Redux store
    const userData = useSelector(state => state.userData); //

    // Stany do przechowywania danych statystycznych, statusu ładowania i błędów
    const [stats, setStats] = useState({
        publishedBooks: 'Ładowanie...', // Początkowe wartości
        soldThisMonth: 'Ładowanie...',
        profitThisMonth: 'Ładowanie...'
    });
    const [loading, setLoading] = useState(true); // Stan ładowania danych
    const [error, setError] = useState(null); // Stan błędu

    // useEffect do pobierania danych po zamontowaniu komponentu lub zmianie tokenu/statusu zalogowania
    useEffect(() => {
        const fetchStats = async () => {
            // Sprawdź, czy użytkownik jest zalogowany i czy ma token
            if (!userData.loggedIn || !userData.token) {
                setStats({
                    publishedBooks: 'Brak danych',
                    soldThisMonth: 'Brak danych',
                    profitThisMonth: 'Brak danych'
                });
                setLoading(false);
                console.warn("Użytkownik nie jest zalogowany lub brak tokenu. Nie można pobrać statystyk dashboardu.");
                return; // Zakończ funkcję, jeśli nie ma tokenu
            }

            try {
                // Wykonaj zapytanie do backendu
                const response = await fetch('http://localhost:8000/api/dostawca/dashboard-stats', {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`, // Dodaj token autoryzacyjny
                        'Content-Type': 'application/json'
                    }
                });

                // Sprawdź, czy odpowiedź jest poprawna
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Błąd HTTP: ${response.status} - ${errorData.message || response.statusText}`);
                }

                // Parsuj dane z odpowiedzi
                const data = await response.json();
                setStats({
                    publishedBooks: data.publishedBooks.toString(), // Upewnij się, że są to stringi
                    soldThisMonth: data.soldThisMonth.toString(),
                    profitThisMonth: data.profitThisMonth, // To już powinno być sformatowane jako string z PLN
                });
            } catch (err) {
                console.error("Błąd przy pobieraniu statystyk dashboardu:", err);
                setError(`Nie udało się załadować statystyk: ${err.message}`);
                setStats({
                    publishedBooks: 'Błąd',
                    soldThisMonth: 'Błąd',
                    profitThisMonth: 'Błąd'
                });
            } finally {
                setLoading(false); // Zawsze ustaw na false po zakończeniu (sukces lub błąd)
            }
        };

        fetchStats(); // Wywołaj funkcję pobierającą statystyki
    }, [userData.loggedIn, userData.token]); // Zależności useEffect - ponownie uruchomi się, gdy się zmienią

    // Renderowanie komponentu w zależności od stanu ładowania i błędu
    if (loading) {
        return (
            <div className="dashboard-container">
                <p>Ładowanie statystyk...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>
                <p>Upewnij się, że jesteś zalogowany jako dostawca/admin i backend działa poprawnie.</p>
            </div>
        );
    }

    // Jeśli dane zostały pomyślnie załadowane, wyświetl je
    return (
        <div className="dashboard-container">
            <DashboardSingleInfo name="Wystawione książki" value={stats.publishedBooks} />
            <DashboardSingleInfo name="Sprzedanych w tym miesiącu" value={stats.soldThisMonth} />
            <DashboardSingleInfo name="Zysk w tym miesiącu" value={stats.profitThisMonth} />
        </div>
    );
}

export default DashboardContainer;