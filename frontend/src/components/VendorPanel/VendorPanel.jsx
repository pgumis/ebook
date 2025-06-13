// src/components/VendorPanel/VendorPanel.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import "./VendorPanel.css";
import Sidebar from "./Sidebar";
import DashboardView from "./DashboardView";
import VendorsBookList from "./VendorsBookList";
import FinanceView from "./FinanceView"; // <-- NOWY IMPORT
import ReviewsView from "./ReviewsView"; // <-- NOWY IMPORT

const VendorPanel = () => {
    const userData = useSelector((state) => state.userData);
    const [activeView, setActiveView] = useState('dashboard');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView />;
            case 'books':
                return <VendorsBookList />;
            case 'finance':
                return <FinanceView />;
            case 'reviews':
                return <ReviewsView />;
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
                </header>
                {renderView()}
            </main>
        </div>
    );
}

export default VendorPanel;