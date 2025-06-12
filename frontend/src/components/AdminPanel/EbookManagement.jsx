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

const EbookManagement = () => {
  const token = useSelector((state) => state.userData.token);

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  const fetchEbooks = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    const params = new URLSearchParams({
      page: currentPage,
      szukaj: searchTerm,
      sortuj_wg: sortConfig.key,
      kierunek: sortConfig.direction,
    });
    const url = `http://localhost:8000/api/admin/ebooki?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEbooks(data.data);
      setLastPage(data.last_page);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Błąd pobierania e-booków:", error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, searchTerm, sortConfig]);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  const handleStatusChange = async (ebookId, newStatus) => {
    try {
      await fetch(`http://localhost:8000/api/admin/ebooki/${ebookId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEbooks();
    } catch (error) {
      console.error("Błąd zmiany statusu:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
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

  if (loading && ebooks.length === 0) return <p>Ładowanie e-booków...</p>;

  return (
    <div>
      <h1 className="management-title">Zarządzanie e-bookami</h1>

      <input
        type="search"
        className="search-input"
        placeholder="Szukaj po tytule, autorze, ISBN, kategorii..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div style={{overflowX: "auto"}}>
        <table className="management-table">
          <thead>
            <tr>
              {/* ZAKTUALIZOWANE NAGŁÓWKI TABELI */}
              <th className="sortable" onClick={() => handleSort("id")}>
                ID
              </th>
              <th className="sortable" onClick={() => handleSort("tytul")}>
                Tytuł
              </th>
              <th>Autor</th>
              <th className="sortable" onClick={() => handleSort("cena")}>
                Cena
              </th>
              <th className="sortable" onClick={() => handleSort("isbn")}>
                ISBN
              </th>
              <th className="sortable" onClick={() => handleSort("kategoria")}>
                Kategoria
              </th>
              <th className="sortable" onClick={() => handleSort("jezyk")}>
                Język
              </th>
              <th className="sortable" onClick={() => handleSort("format")}>
                Format
              </th>
              <th
                className="sortable"
                onClick={() => handleSort("data_wydania")}
              >
                Data wydania
              </th>
              <th className="sortable" onClick={() => handleSort("status")}>
                Status
              </th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="11">Odświeżanie...</td>
              </tr>
            )}
            {!loading && ebooks.length === 0 && (
              <tr>
                <td colSpan="11">
                  Nie znaleziono e-booków pasujących do kryteriów.
                </td>
              </tr>
            )}
            {!loading &&
              ebooks.map((ebook) => (
                <tr key={ebook.id}>
                  {/* ZAKTUALIZOWANE KOMÓRKI DANYCH */}
                  <td>{ebook.id}</td>
                  <td>{ebook.tytul}</td>
                  <td>
                    {ebook.uzytkownik?.imie} {ebook.uzytkownik?.nazwisko}
                  </td>
                  <td>{parseFloat(ebook.cena).toFixed(2)} zł</td>
                  <td>{ebook.isbn || "-"}</td>
                  <td>{ebook.kategoria || "-"}</td>
                  <td>{ebook.jezyk || "-"}</td>
                  <td>{ebook.format || "-"}</td>
                  <td>
                    {ebook.data_wydania
                      ? new Date(ebook.data_wydania).toLocaleDateString("pl-PL")
                      : "-"}
                  </td>
                  <td>
                    <span className={`status-badge status-${ebook.status}`}>
                      {ebook.status}
                    </span>
                  </td>
                  <td>
                    {ebook.status !== "aktywny" && (
                      <button
                        className="action-btn activate-btn"
                        onClick={() => handleStatusChange(ebook.id, "aktywny")}
                      >
                        Aktywuj
                      </button>
                    )}
                    {ebook.status === "aktywny" && (
                      <button
                        className="action-btn withdraw-btn"
                        onClick={() => handleStatusChange(ebook.id, "wycofany")}
                      >
                        Wycofaj
                      </button>
                    )}
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
    </div>
  );
};

export default EbookManagement;
