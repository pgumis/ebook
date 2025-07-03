import React from 'react';

const EmptyState = ({ message, icon = "fas fa-info-circle" }) => {

    return (
        <div className="empty-state-container">
            <i className={icon}></i>
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;