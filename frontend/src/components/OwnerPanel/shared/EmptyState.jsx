// src/components/OwnerPanel/shared/EmptyState.jsx
import React from 'react';

const EmptyState = ({ message, icon = "fas fa-info-circle" }) => {
    // Użyjemy stylów z OwnerPanel.css, więc nie potrzebujemy osobnego pliku CSS
    return (
        <div className="empty-state-container">
            <i className={icon}></i>
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;