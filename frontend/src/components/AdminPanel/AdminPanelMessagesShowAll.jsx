import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";

const AdminPanelMessagesShowAll = () => {
    const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/wiadomosci");
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania ebooków");
        }
        const dane = await response.json();
        setData(
          dane.map((item) => ({
            id: item.id,
            temat: item.temat,
            od: item.email,
            data: item.created_at,
          }))
        );
      } catch {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    if (data.length > 0) {
    }
  }, []);

  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Skrzynka wiadomości</h3>
      <table className="admin-panel-messages-list">
        <thead>
          <tr>
            <th>ID</th>
            <th>Temat</th>
            <th>Od</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {data.map((wiadomosc) => (
            <tr onClick={()=>{
                dispatch(viewActions.setSelectedMessage(wiadomosc));
                dispatch(viewActions.changeView("adminPanelMessageDetails"));
            }}>
              <td>{wiadomosc.id}</td>
              <td>{wiadomosc.temat}</td>
              <td>{wiadomosc.od}</td>
              <td>
                {new Date(wiadomosc.data).toLocaleString("pl-PL", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminPanelMessagesShowAll;
