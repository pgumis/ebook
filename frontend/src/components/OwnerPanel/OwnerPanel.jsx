import React, { useState } from 'react';
import './OwnerPanel.css';
import Sidebar from './Sidebar';
import MainDashboardView from './views/MainDashboardView';

import SalesAnalysisView from './views/SalesAnalysisView';
import UsersAnalysisView from "./views/UsersAnalysisView";
import ProductsAnalysisView from "./views/ProductsAnalysisView";
import ReportsView from "./views/ReportsView";

const OwnerPanel = () => {
    const [activeView, setActiveView] = useState('dashboard');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <MainDashboardView />;
            case 'sales':
                 return <SalesAnalysisView />;
            case 'users':
                return <UsersAnalysisView />;
            case 'products':
                return <ProductsAnalysisView />;
            case 'reports':
                return <ReportsView />;
            default:
                return <MainDashboardView />;
        }
    };

    return (
        <div className="owner-panel-layout">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="panel-main-content">
                {renderView()}
            </main>
        </div>
    );
};

export default OwnerPanel;