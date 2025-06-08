import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const AdminPanelManage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const view = useSelector((state) => state.view.selectedView);
  useEffect(() => {
    console.log(localStorage.getItem("token"));
    const fetchData = async () => {
      try {
        if (view === "adminPanelManageEbooks") {
          const response = await fetch("http://localhost:8000/api/ebooki");
          if (!response.ok) {
            throw new Error("Błąd podczas pobierania ebooków");
          }
          const dane = await response.json();
          console.log(dane);
          setData(
            dane.map((item) => ({
              id: item.id,
              tytuł: item.tytul,
              autor: item.autor,
              cena: item.cena_promocyjna || item.cena,
              'średnia ocena': item.srednia_ocena || 4, // na razie na sztywno ocena 4!
              cover: item.okladka_url || "",
            }))
          );
        } else if (view === "adminPanelManageRatings") {
        } else if (view === "adminPanelManageOrders") {
          const response = await fetch("http://localhost:8000/api/zamowienia", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!response.ok) {
            throw new Error("Błąd podczas pobierania zamówień");
          }
          const dane = await response.json();
          setData(
            dane.map((item) => ({
              id: item.id,
              status: item.status,
              total: item.cena_calkowita || item.kwota,
              date: item.data_zamowienia || item.created_at,
              items: item.elementy || [],
            }))
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleEdit = async (id, view) => {
    // Przykład: przekierowanie do formularza edycji lub otwarcie modala
    alert(`Edytuj rekord o ID: ${id} w widoku: ${view}`);
    // TODO: Zaimplementuj logikę edycji, np. przekierowanie do formularza lub otwarcie modala
    // Możesz użyć endpointu PUT /api/ebooki/{id} lub PUT /api/zamowienia/{id}
  };

  const handleDelete = async (id, view) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten rekord?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się.");
      }

      const endpoint =
        view === "adminPanelManageEbooks"
          ? `http://localhost:8000/api/ebooki/${id}`
          : `http://localhost:8000/api/zamowienia/${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania rekordu");
      }

      // Usuń rekord z lokalnego stanu
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };
  const renderCell = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0
        ? value.map((item) => item.name || item.title || item.id).join(", ")
        : "-";
    }
    return value || "-";
  };

  const headers =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "cover")
      : [];

  return (
    <div className="panel">
      <h2>
        {view === "adminPanelManageEbooks"
          ? "Zarządzanie ebookami"
          : view === "adminPanelManageOrders"
          ? "Zarządzanie zamówieniami"
          : "Panel administracyjny"}
      </h2>
      {loading && <p>Ładowanie...</p>}
      {error && <p>Błąd: {error}</p>}
      {!loading && !error && data.length === 0 && (
        <p>Brak danych do wyświetlenia.</p>
      )}
      {!loading && !error && data.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f4f4f4",
                    textAlign: "left",
                  }}
                >
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                  textAlign: "center",
                }}
              >
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td
                    key={header}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {renderCell(item[header])}
                  </td>
                ))}
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => handleEdit(item.id, view)}
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                    title="Edytuj"
                  >
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 6L16.2929 3.70711C16.6834 3.31658 17.3166 3.31658 17.7071 3.70711L20.2929 6.29289C20.6834 6.68342 20.6834 7.31658 20.2929 7.70711L18 10M14 6L4.29289 15.7071C4.10536 15.8946 4 16.149 4 16.4142V19C4 19.5523 4.44772 20 5 20H7.58579C7.851 20 8.10536 19.8946 8.29289 19.7071L18 10M14 6L18 10"
                        stroke="black"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, view)}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                    title="Usuń"
                  >
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 7V7C9 5.34315 10.3431 4 12 4V4C13.6569 4 15 5.34315 15 7V7M9 7H15M9 7H6M15 7H18M20 7H18M4 7H6M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7"
                        stroke="black"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default AdminPanelManage;
