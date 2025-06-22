import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import "./ManagementTable.css";

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

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{message.temat}</h2>
        <div className="message-meta">
          <strong>Od:</strong> {message.imie} ({message.email})<br />
          <strong>Data:</strong>{" "}
          {new Date(message.created_at).toLocaleString("pl-PL")}
        </div>
        <div className="message-body">
          <p>{message.tresc}</p>
        </div>
        <button className="modal-close-btn" onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  );
};

const MessageInbox = () => {
  const token = useSelector((state) => state.userData.token);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [readFilter, setReadFilter] = useState("0");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      szukaj: searchTerm,
      sortuj_wg: sortConfig.key,
      kierunek: sortConfig.direction,
      filtruj_przeczytana: readFilter,
    });
    const url = `http://localhost:8000/api/admin/wiadomosci?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data.data);
      setLastPage(data.last_page);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Błąd pobierania wiadomości:", error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, searchTerm, sortConfig, readFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // --- POCZĄTEK POPRAWIONEJ LOGIKI ---
  const openMessage = async (message) => {
    setSelectedMessage(message); // Otwórz modal

    // Jeśli wiadomość jest nieprzeczytana, wykonaj zapytanie i zaktualizuj stan
    if (message.przeczytana === 0) {
      try {
        // Wyślij żądanie do API, aby zaktualizować status w bazie danych
        await fetch(
          `http://localhost:8000/api/admin/wiadomosci/${message.id}/przeczytaj`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Zaktualizuj stan lokalnie - to jest kluczowa poprawka.
        // Zamiast polegać na odpowiedzi z serwera, od razu zmieniamy stan wiadomości w tablicy.
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m.id === message.id ? { ...m, przeczytana: 1 } : m
          )
        );
      } catch (error) {
        console.error("Błąd oznaczania wiadomości:", error);
      }
    }
  };
  // --- KONIEC POPRAWIONEJ LOGIKI ---

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę wiadomość?")) return;
    try {
      await fetch(`http://localhost:8000/api/admin/wiadomosci/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMessages();
    } catch (error) {
      console.error("Błąd usuwania wiadomości:", error);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleFilterChange = (e) => {
    setReadFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading && messages.length === 0) return <p>Ładowanie wiadomości...</p>;

  // Liczba porządkowa musi uwzględniać paginację
  const itemsPerPage = 15; // Tyle ile ustawiliśmy w paginacji w Laravelu
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div>
      <h1 className="management-title">Skrzynka odbiorcza</h1>
      <div className="filters-container">
        <input
          type="search"
          className="search-input"
          placeholder="Szukaj po nadawcy, emailu, temacie..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          className="filter-select"
          value={readFilter}
          onChange={handleFilterChange}
        >
          <option value="">Wszystkie</option>
          <option value="0">Nieprzeczytane</option>
          <option value="1">Przeczytane</option>
        </select>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="management-table">
          <thead>
            <tr>
              {/* --- DODANA KOLUMNA LP. --- */}
              <th>Lp.</th>
              <th className="sortable" onClick={() => handleSort("imie")}>
                Nadawca
              </th>
              <th className="sortable" onClick={() => handleSort("email")}>
                Email
              </th>
              <th className="sortable" onClick={() => handleSort("temat")}>
                Temat
              </th>
              <th className="sortable" onClick={() => handleSort("created_at")}>
                Data
              </th>
              <th
                className="sortable"
                onClick={() => handleSort("przeczytana")}
              >
                Status
              </th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7">Odświeżanie...</td>
              </tr>
            )}
            {!loading && messages.length === 0 && (
              <tr>
                <td colSpan="7">Brak wiadomości pasujących do kryteriów.</td>
              </tr>
            )}
            {!loading &&
              messages.map((message, index) => (
                <tr
                  key={message.id}
                  className={
                    message.przeczytana === 0
                      ? "message-unread"
                      : "message-read"
                  }
                >
                  {/* --- DODANA KOMÓRKA Z NUMEREM --- */}
                  <td>{startIndex + index + 1}</td>
                  <td>{message.imie}</td>
                  <td>{message.email}</td>
                  <td>{message.temat}</td>
                  <td>
                    {new Date(message.created_at).toLocaleString("pl-PL")}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        message.przeczytana === 0
                          ? "status-nieprzeczytane"
                          : "status-przeczytane"
                      }`}
                    >
                      {message.przeczytana === 0
                        ? "Nieprzeczytane"
                        : "Przeczytane"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn btn-view"
                      onClick={() => openMessage(message)}
                    >
                      Zobacz
                    </button>
                    <button
                      className="action-btn btn-delete"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      Usuń
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
        onPageChange={handlePageChange}
      />
      <MessageModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </div>
  );
};

export default MessageInbox;
