// src/components/OwnerPanel/shared/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css'; // Dedykowany plik CSS dla animacji

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
        </div>
    );
};

export default LoadingSpinner;