import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './ManagementTable.css';

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    if (lastPage <= 1) return null;
    const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
    return (
        <div className="pagination-container">
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={page === currentPage ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

const OrderManagement = () => {
    const token = useSelector(state => state.userData.token);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [statusFilter, setStatusFilter] = useState(''); // Stan dla filtra statusu

    const fetchOrders = useCallback(async () => {
        if (!token) return;
        setLoading(true);

        const params = new URLSearchParams({
            page: currentPage,
            szukaj: searchTerm,
            sortuj_wg: sortConfig.key,
            kierunek: sortConfig.direction,
            filtruj_status: statusFilter,
        });
        const url = `http://localhost:8000/api/admin/zamowienia?${params.toString()}`;

        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            setOrders(data.data);
            setLastPage(data.last_page);
            setCurrentPage(data.current_page);
        } catch (error) {
            console.error("Błąd pobierania zamówień:", error);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage, searchTerm, sortConfig, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await fetch(`http://localhost:8000/api/admin/zamowienia/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            fetchOrders(); // Odśwież listę, aby pokazać zmianę
        } catch (error) {
            console.error("Błąd aktualizacji statusu:", error);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    if (loading && orders.length === 0) return <p>Ładowanie zamówień...</p>;

    return (
        <div>
            <h1>Zarządzanie zamówieniami</h1>

            <div className="filters-container">
                <input
                    type="search"
                    className="search-input"
                    placeholder="Szukaj po ID zamówienia, emailu, kliencie..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select className="filter-select" value={statusFilter} onChange={handleFilterChange}>
                    <option value="">Wszystkie statusy</option>
                    <option value="oczekujące">Oczekujące</option>
                    <option value="zrealizowane">Zrealizowane</option>
                    <option value="anulowane">Anulowane</option>
                </select>
            </div>

            <table className="management-table">
                <thead>
                <tr>
                    <th className="sortable" onClick={() => handleSort('id')}>ID Zamówienia</th>
                    <th>Klient</th>
                    <th>E-mail</th>
                    <th className="sortable" onClick={() => handleSort('created_at')}>Data</th>
                    <th className="sortable" onClick={() => handleSort('suma')}>Suma</th>
                    <th className="sortable" onClick={() => handleSort('status')}>Status</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {loading && <tr><td colSpan="6">Odświeżanie...</td></tr>}
                {!loading && orders.length === 0 && (
                    <tr><td colSpan="6">Nie znaleziono zamówień pasujących do kryteriów.</td></tr>
                )}
                {!loading && orders.map((order) => (
                    <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.email}</td>
                        <td>{order.uzytkownik ? `${order.uzytkownik.imie} ${order.uzytkownik.nazwisko}` : 'Użytkownik usunięty'}</td>
                        <td>{new Date(order.created_at).toLocaleString('pl-PL')}</td>
                        <td>{parseFloat(order.suma).toFixed(2)} zł</td>
                        <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                        <td className="action-cell">
                            <select
                                className="status-select"
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                value={order.status}
                            >
                                <option value="oczekujące">Oczekujące</option>
                                <option value="zrealizowane">Zrealizowane</option>
                                <option value="anulowane">Anulowane</option>
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default OrderManagement;