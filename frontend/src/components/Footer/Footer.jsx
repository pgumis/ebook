import React from 'react';
import { useDispatch } from 'react-redux';
import { viewActions } from '../../store/view';
import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();
    const dispatch = useDispatch();

    const handleLinkClick = (e, viewName) => {
        e.preventDefault();
        dispatch(viewActions.changeView(viewName));
    };

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h4>EBOOK NA WYNOS</h4>
                    <p className="footer-about">
                        Twoja cyfrowa biblioteka na wyciągnięcie ręki. Odkrywaj, czytaj i inspiruj się z najlepszymi e-bookami na rynku.
                    </p>
                </div>

                <div className="footer-column">
                    <h4>Szybkie Linki</h4>
                    <ul className="footer-links">
                        <li><a href="#" onClick={(e) => handleLinkClick(e, 'about')}>O nas</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Regulamin</a></li>
                        <li><a href="#">Polityka Prywatności</a></li>
                        <li><a href="#">Kontakt</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Znajdź nas w sieci</h4>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>EBOOK NA WYNOS &copy; {year}. Wszelkie prawa zastrzeżone.</p>
            </div>
        </footer>
    );
};

export default Footer;