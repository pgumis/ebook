import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { viewActions } from '../../store/view';
import '../Profile/Profile.css';
import './ManagementTable.css';

const UserDetails = ({ onGoBack }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.userData.token);
    const userId = useSelector(state => state.view.selectedItemId);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        }
    };


    const fetchUserDetails = useCallback(async () => {
        if (!userId || !token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/admin/uzytkownicy/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUser(data);
            setFormData({
                imie: data.imie || '',
                nazwisko: data.nazwisko || '',
                email: data.email || '',
                numer_telefonu: data.numer_telefonu || '',
                rola: data.rola || 'klient',
                status: data.status || 'aktywny',
            });
        } catch (error) {
            console.error("Błąd pobierania szczegółów:", error);
            setMessage({ type: 'error', text: 'Nie udało się załadować danych.' });
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleEditMode = () => {
        setIsEditing(prev => !prev);
        setMessage(null);
        if (!isEditing) {
            setFormData({
                imie: user.imie, nazwisko: user.nazwisko, email: user.email,
                numer_telefonu: user.numer_telefonu || '', rola: user.rola, status: user.status
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`http://localhost:8000/api/admin/uzytkownicy/${userId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: result.message });
                setUser(result.user);
                setIsEditing(false);
            } else {
                const errorText = result.message + (result.errors ? `: ${Object.values(result.errors).join(', ')}` : '');
                setMessage({ type: 'error', text: errorText });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Nie udało się połączyć z serwerem.' });
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <p>Ładowanie szczegółów...</p>;
    if (!user && !loading) return <p>Nie znaleziono użytkownika.</p>;

    return (
        <div>
            <button className="action-btn withdraw-btn" onClick={handleGoBack} style={{marginBottom: '20px'}}>
                &larr; Wróć do listy
            </button>

            <div className="profile-section-card">
                <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-user-edit"></i>
                        <h2>Dane użytkownika: {user.imie} {user.nazwisko}</h2>
                    </div>
                    {!isEditing && (
                        <button className="profile-edit-main-btn" onClick={toggleEditMode}>
                            <i className="fas fa-pencil-alt"></i> Edytuj
                        </button>
                    )}
                </div>

                {message && (
                    <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                        {message.text}
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-row"><label>Imię</label><input type="text" name="imie" value={formData.imie} onChange={handleInputChange} required /></div>
                        <div className="form-row"><label>Nazwisko</label><input type="text" name="nazwisko" value={formData.nazwisko} onChange={handleInputChange} required /></div>
                        <div className="form-row"><label>E-mail</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                        <div className="form-row"><label>Numer telefonu</label><input type="text" name="numer_telefonu" value={formData.numer_telefonu} onChange={handleInputChange} /></div>
                        <div className="form-row">
                            <label>Rola</label>
                            <select name="rola" value={formData.rola} onChange={handleInputChange} className="filter-select">
                                <option value="klient">Klient</option><option value="dostawca">Dostawca</option><option value="admin">Admin</option><option value="wlasciciel">Właściciel</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="filter-select">
                                <option value="aktywny">Aktywny</option><option value="nieaktywny">Nieaktywny</option><option value="zablokowany">Zablokowany</option>
                            </select>
                        </div>
                        <div className="form-actions-edit">
                            <button type="button" className="btn-cancel" onClick={toggleEditMode} disabled={formLoading}>Anuluj</button>
                            <button type="submit" className="btn-save" disabled={formLoading}>{formLoading ? "Zapisywanie..." : "Zapisz zmiany"}</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-data-view">
                        <div className="data-row"><span>ID</span><span>{user.id}</span></div>
                        <div className="data-row"><span>Imię</span><span>{user.imie}</span></div>
                        <div className="data-row"><span>Nazwisko</span><span>{user.nazwisko}</span></div>
                        <div className="data-row"><span>E-mail</span><span>{user.email}</span></div>
                        <div className="data-row"><span>Numer telefonu</span><span>{user.numer_telefonu || '-'}</span></div>
                        <div className="data-row"><span>Rola</span><span>{user.rola}</span></div>
                        <div className="data-row"><span>Status</span><span>{user.status}</span></div>
                        <div className="data-row"><span>Data dołączenia</span><span>{new Date(user.created_at).toLocaleString('pl-PL')}</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;