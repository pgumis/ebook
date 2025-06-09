import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const AdminPanelMessageDetails = () => {

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
            ...item
          }))
        );
      } catch {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const selectedMessageId = useSelector((state) => state.view.selectedMessage.id);
  const message = data.find((item) => item.id === selectedMessageId);
    console.log(message);
  return (
    <div className="panel">

    </div>
  );
};
export default AdminPanelMessageDetails;
