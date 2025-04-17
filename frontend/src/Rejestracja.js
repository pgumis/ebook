import React, { useState } from 'react';

const Rejestracja = () => {
    const [dane, setDane] = useState({
        imie: '',
        nazwisko: '',
        email: '',
        haslo: '',
    });

    const [komunikat, setKomunikat] = useState('');

    const handleChange = (e) => {
        setDane({ ...dane, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/rejestracja', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dane),
        });

        const wynik = await response.json();

        if (response.ok) {
            setKomunikat(wynik.komunikat);
        } else {
            setKomunikat('Błąd: ' + JSON.stringify(wynik.bledy));
        }
    };

    return (
        <div>
            <h2>Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="imie" placeholder="Imię" value={dane.imie} onChange={handleChange} required />
                <br />
                <input type="text" name="nazwisko" placeholder="Nazwisko" value={dane.nazwisko} onChange={handleChange} required />
                <br />
                <input type="email" name="email" placeholder="Email" value={dane.email} onChange={handleChange} required />
                <br />
                <input type="password" name="haslo" placeholder="Hasło" value={dane.haslo} onChange={handleChange} required />
                <br />
                <button type="submit">Zarejestruj się</button>
            </form>
            <p>{komunikat}</p>
        </div>
    );
};

export default Rejestracja;
