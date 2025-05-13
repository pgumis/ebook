import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();
    return  <div className="footer">
            <span>EBOOK NA WYNOS © {year}</span>
    </div>
}
export default Footer;