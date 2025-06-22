import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewActions } from "../../store/view"; // Potrzebne do szczegółowych widoków
import "./ManagementTable.css";

// Mały komponent do paginacji
const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  if (lastPage <= 1) return null;
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  return (
    <div className="pagination-container">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const UserManagement = ({ onShowDetails }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userData.token);

  // --- NOWE STANY DO ZARZĄDZANIA WIDOKIEM ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [roleChanges, setRoleChanges] = useState({});
  // --- NOWA, ROZBUDOWANA FUNKCJA POBIERANIA DANYCH ---
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    // Budujemy URL z parametrami
    const params = new URLSearchParams({
      page: currentPage,
      szukaj: searchTerm,
      sortuj_wg: sortConfig.key,
      kierunek: sortConfig.direction,
    });
    const url = `http://localhost:8000/api/admin/uzytkownicy?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data.data);
      setLastPage(data.last_page);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Błąd pobierania użytkowników:", error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, searchTerm, sortConfig]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // useEffect reaguje teraz na wszystkie zmiany parametrów

  // --- FUNKCJE OBSŁUGI ---
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEditClick = (userId) => {
    // 1. Ustawiamy ID w Reduxie, żeby UserDetails wiedział kogo pobrać
    dispatch(viewActions.setSelectedItem(userId));
    // 2. Wywołujemy funkcję z AdminPanel, aby zmienić widok
    onShowDetails();
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!token) return;

    // Aktualizacja stanu lokalnego, aby wyświetlić nową wartość w <select>
    setRoleChanges(prev => ({ ...prev, [userId]: newRole }));

    try {
      const response = await fetch(`http://localhost:8000/api/admin/uzytkownicy/${userId}/zmien-role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ rola: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.komunikat || "Wystąpił błąd");
      }

      // Odśwież listę użytkowników, aby zobaczyć potwierdzone zmiany
      fetchUsers();

    } catch (error) {
      console.error("Błąd zmiany roli:", error);
      // Opcjonalnie: cofnij zmianę w UI w razie błędu
      setRoleChanges(prev => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div>
      <h1 className="management-title">Zarządzanie użytkownikami</h1>

      <input
        type="search"
        className="search-input"
        placeholder="Szukaj po imieniu, nazwisku lub emailu..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div style={{overflowX: "auto"}}>
        <table className="management-table">
          <thead>
            <tr>
              {/* Nagłówki są teraz przyciskami do sortowania */}
              <th className="sortable" onClick={() => handleSort("id")}>
                ID
              </th>
              <th className="sortable" onClick={() => handleSort("imie")}>
                Imię i Nazwisko
              </th>
              <th className="sortable" onClick={() => handleSort("email")}>
                Email
              </th>
              <th className="sortable" onClick={() => handleSort("rola")}>
                Rola
              </th>
              <th className="sortable" onClick={() => handleSort("status")}>
                Status
              </th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.imie} {user.nazwisko}
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                      className="filter-select" // Używamy istniejącej klasy dla spójności wyglądu
                      value={roleChanges[user.id] || user.rola}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="klient">Klient</option>
                    <option value="dostawca">Dostawca</option>
                    <option value="admin">Admin</option>
                    <option value="wlasciciel">Właściciel</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditClick(user.id)}
                  >
                    Szczegóły
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UserManagement;
