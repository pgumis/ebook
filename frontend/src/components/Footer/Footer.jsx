const Footer = () => {
    const year = new Date().getFullYear();
    return  <div style={{width: '100%', height: '4rem', display: 'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#fff', fontWeight:'bold'}}>
            <span>EBOOK NA WYNOS © {year}</span>
    </div>
}
export default Footer;