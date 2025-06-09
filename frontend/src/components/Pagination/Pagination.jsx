// frontend/src/components/Pagination/Pagination.jsx
import React from 'react';
import './Pagination.css'; // Stwórz plik CSS dla paginacji

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= lastPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="pagination-nav">
            <ul className="pagination-list">
                <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Poprzednia
                    </button>
                </li>

                {/* Możesz dodać logikę do wyświetlania tylko kilku stron wokół bieżącej */}
                {pageNumbers.map(number => (
                    <li key={number} className={`pagination-item ${number === currentPage ? 'active' : ''}`}>
                        <button
                            onClick={() => onPageChange(number)}
                            className="pagination-button"
                        >
                            {number}
                        </button>
                    </li>
                ))}

                <li className={`pagination-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className="pagination-button"
                    >
                        Następna
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;