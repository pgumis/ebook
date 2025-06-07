import AdminPanelButton from "./AdminPanelButton";
import AdminPanelMessagesList from "./AdminPanelMessagesList";
import "./AdminPanel.css";
const AdminPanel = () => {
  return (
    <div className="panel admin-panel">
      <div className="admin-panel-buttons-container">
        <div className="admin-panel-buttons-row">
          <AdminPanelButton index={0}>
            Zarządzanie użytkownikami
          </AdminPanelButton>
          <AdminPanelButton index={1}>Zarządzanie e-bookami</AdminPanelButton>
        </div>
        <div className="admin-panel-buttons-row">
          <AdminPanelButton index={2}>Zarządzanie recenzjami</AdminPanelButton>
          <AdminPanelButton index={3}>
            Zarządzanie zamówieniami
          </AdminPanelButton>
        </div>
      </div>
      <div className="admin-panel-messages-container">
        <AdminPanelMessagesList />
      </div>
    </div>
  );
};
export default AdminPanel;
