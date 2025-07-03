import React from 'react';

const Sidebar = ({ activeView, setActiveView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Pulpit Główny', icon: 'fas fa-chart-pie' },
        { id: 'sales', label: 'Analiza Sprzedaży', icon: 'fas fa-chart-line' },
        { id: 'users', label: 'Analiza Użytkowników', icon: 'fas fa-users' },
        { id: 'products', label: 'Analiza Produktów', icon: 'fas fa-tags' },
        { id: 'reports', label: 'Raporty', icon: 'fas fa-file-download' },
    ];
    return (
        <aside className="panel-sidebar">
            <div className="sidebar-brand">
                <h3>Panel Właściciela</h3>
            </div>
            <nav>
                <ul>
                    {menuItems.map(item => (
                        <li
                            key={item.id}
                            className={activeView === item.id ? 'active' : ''}
                            onClick={() => setActiveView(item.id)}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;