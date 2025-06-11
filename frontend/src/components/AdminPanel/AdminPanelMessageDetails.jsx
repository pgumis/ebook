import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const AdminPanelMessageDetails = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const message = useSelector((state) => state.view.selectedMessage);
    console.log(message);
  return (
    <div className="panel">
      <h2>Wiadomość od użytkownika</h2>
      <p><strong>ID:</strong> {message.id}</p>
      <p><strong>Imię:</strong> {message.imie}</p>
      <p><strong>Email:</strong> {message.email}</p>
      <p><strong>Temat:</strong> {message.temat}</p>
      <p><strong>Treść:</strong></p>
      <p style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "10px", borderRadius: "4px" }}>{message.tresc}</p>
      <p><strong>Data utworzenia:</strong> {new Date(message.created_at).toLocaleString("pl-PL")}</p>
      <p><strong>Status:</strong> {message.przeczytana ? "Przeczytana" : "Nieprzeczytana"}</p>
    </div>
  );
};
export default AdminPanelMessageDetails;
