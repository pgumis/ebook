import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";
import AdminPanelButton from "./AdminPanelButton";
import AdminPanelMessagesList from "./AdminPanelMessagesList";
import "./AdminPanel.css";

const handleButtonClick = (type, index, dispatch) => {
  console.log('halo')
  if (type === "tile") {
    if (index === 0) {
      dispatch(viewActions.changeView("adminPanelManageUsers"))
    } else if (index === 1) {
      dispatch(viewActions.changeView("adminPanelManageEbooks"))
    } else if (index === 2) {
      dispatch(viewActions.changeView("adminPanelManageRatings"))
    } else {
      dispatch(viewActions.changeView("adminPanelManageOrders"))
    }
  } else {
    return;
  }
};

const AdminPanel = () => {
  const dispatch = useDispatch();

  return (
    <div className="panel admin-panel">
      <div className="admin-panel-buttons-container">
        <div className="admin-panel-buttons-row">
          <AdminPanelButton index={0} onClick = {()=>{handleButtonClick('tile', 0, dispatch)}}>
            Zarządzanie użytkownikami
          </AdminPanelButton>
          <AdminPanelButton index={1} onClick = {()=>{handleButtonClick('tile', 1, dispatch)}}>Zarządzanie e-bookami</AdminPanelButton>
        </div>
        <div className="admin-panel-buttons-row">
          <AdminPanelButton index={2} onClick = {()=>{handleButtonClick('tile', 2, dispatch)}}>Zarządzanie recenzjami</AdminPanelButton>
          <AdminPanelButton index={3} onClick = {()=>{handleButtonClick('tile', 3, dispatch)}}>
            Zarządzanie zamówieniami
          </AdminPanelButton>
        </div>
      </div>
      <div className="admin-panel-messages-container">
        <AdminPanelMessagesList onClick/>
      </div>
    </div>
  );
};
export default AdminPanel;
