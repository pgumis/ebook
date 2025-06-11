import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { viewActions } from '../../store/view';
import './ManagementTable.css'; // Możemy użyć tych samych stylów dla przycisku

const UserDetails = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.userData.token);
    const userId = useSelector(state => state.view.selectedItemId);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !token) return;
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/admin/uzytkownicy/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Błąd pobierania szczegółów:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [userId, token]);

    const handleGoBack = () => {
        dispatch(viewActions.changeView('users'));
    };

    if (loading) return <p>Ładowanie szczegółów...</p>;
    if (!user) return <p>Nie znaleziono użytkownika.</p>;

    return (
        <div>
            <button className="action-btn withdraw-btn" onClick={handleGoBack} style={{marginBottom: '20px'}}>
                &larr; Wróć do listy
            </button>
            <h1>Szczegóły użytkownika: {user.imie} {user.nazwisko}</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rola:</strong> {user.rola}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Numer telefonu:</strong> {user.numer_telefonu || 'Brak'}</p>
            <p><strong>Data dołączenia:</strong> {new Date(user.created_at).toLocaleString('pl-PL')}</p>
        </div>
    );
};

export default UserDetails;