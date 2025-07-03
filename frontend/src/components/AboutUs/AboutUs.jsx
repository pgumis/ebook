import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us-container screen-center">
            <div className="about-us-card">
                <h1>O Projekcie "E-BOOK NA WYNOS"</h1>
                <p className="subtitle">
                    Platforma e-commerce stworzona w ramach projektu uczelnianego.
                </p>

                <div className="info-section">
                    <h2>Uczelnia</h2>
                    <p>Wyższa Szkoła Przedsiębiorczości i Administracji w Lublinie</p>
                </div>

                <div className="info-section">
                    <h2>Przedmiot</h2>
                    <p>Zaawansowany projekt zespołowy cz. 2 projekt 24/25 gr. 1</p>
                </div>

                <div className="info-section">
                    <h2>Autorzy</h2>
                    <p>Michał Boguszko</p>
                    <p>Paweł Gumiela</p>
                </div>

                <div className="info-section">
                    <h2>Prowadzący zajęcia</h2>
                    <p>dr inż. Tomasz Szymczyk</p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;