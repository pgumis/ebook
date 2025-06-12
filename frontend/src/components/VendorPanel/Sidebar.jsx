// src/components/VendorPanel/Sidebar.jsx
import React from 'react';

const Sidebar = ({ activeView, setActiveView }) => {
    // Menu wzorowane na AdminPanel.jsx, z odpowiednimi ikonami Font Awesome
    const menuItems = [
        { id: 'dashboard', label: 'Pulpit', icon: 'fas fa-tachometer-alt' },
        { id: 'books', label: 'Moje książki', icon: 'fas fa-book-open' },
        { id: 'finance', label: 'Finanse', icon: 'fas fa-wallet' },
        { id: 'reviews', label: 'Recenzje', icon: 'fas fa-star' }
    ];

    return (
        <div className="panel vendor-panel-layout">
            <aside className="panel-sidebar"> {/* Używamy klasy z VendorPanel.css, ale style będą jak w AdminPanel.css */}
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
        </div>
    );
};

export default Sidebar;