import React from 'react';

const Sidebar = ({ activeView, setActiveView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Pulpit', icon: 'fas fa-tachometer-alt' },
        { id: 'books', label: 'Moje książki', icon: 'fas fa-book-open' },
        { id: 'finance', label: 'Finanse', icon: 'fas fa-wallet' },
        { id: 'reviews', label: 'Recenzje', icon: 'fas fa-star' }
    ];
    return (
        <aside className="panel-sidebar">
            <div className="sidebar-brand">
                <h3>Panel Dostawcy</h3>
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