// frontend/src/components/HomePageContent/HomePageContent.jsx
import React, { useState } from 'react';
// Upewnij się, że ścieżki importu są poprawne
import BooksListFilterPanel from '../BooksList/BooksListFilterPanel/BooksListFilterPanel';
import BooksListMainPanel from '../BooksList/BooksListMainPanel/BooksListMainPanel';

function HomePageContent() {
    // Stan do przechowywania aktualnie wybranej kategorii
    // `null` oznacza, że żadna kategoria nie jest wybrana (wyświetlaj wszystkie ebooki)
    const [selectedKategoria, setSelectedKategoria] = useState(null);

    // Funkcja, która będzie przekazana do BooksListFilterPanel.
    const obsluzWyborKategorii = (kategoria) => {
        console.log("Wybrano kategorię w HomePageContent:", kategoria);
        setSelectedKategoria(kategoria); // Aktualizuje stan, co spowoduje ponowne renderowanie
    };

    return (
        <div style={{ display: 'flex', gap: '20px', padding: '0px' }}>
            {/* Panel boczny z filtrem kategorii */}
            <BooksListFilterPanel
                onSelectCategory={obsluzWyborKategorii}
                selectedKategoria={selectedKategoria}
            />

            {/* Główny panel z listą ebooków (nowości, bestsellery, promocje) */}
            <BooksListMainPanel
                selectedKategoria={selectedKategoria}
            />
        </div>
    );
}

export default HomePageContent;