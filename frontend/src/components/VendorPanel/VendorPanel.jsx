// frontend/src/components/VendorPanel/VendorPanel.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import "./VendorPanel.css"; // Nowy plik CSS dla layoutu
import Sidebar from "./Sidebar"; // Nowy komponent Sidebar
import DashboardView from "./DashboardView"; // Nowy komponent dla widoku pulpitu
import VendorsBookList from "./VendorsBookList"; // Istniejący komponent

const VendorPanel = () => {
    const userData = useSelector((state) => state.userData);
    const [activeView, setActiveView] = useState('dashboard'); // Domyślny widok

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView />;
            case 'books':
                return <VendorsBookList />;
            case 'finance':
                return <div>Widok Finansów (w budowie)</div>; // Placeholder
            case 'reviews':
                return <div>Widok Recenzji (w budowie)</div>; // Placeholder
            default:
                return <DashboardView />;
        }
    }

    return (
        <div className="vendor-panel-layout">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="panel-main-content">
                <header className="panel-header">
                    <h2>Witaj, {userData.imie} 👋</h2>
                    {/* Tutaj można dodać np. przycisk wylogowania, profilu etc. */}
                </header>
                {renderView()}
            </main>
        </div>
    );
}

export default VendorPanel;