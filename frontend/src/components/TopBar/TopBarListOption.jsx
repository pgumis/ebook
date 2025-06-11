import "./TopBarListOption.css";

// Komponent teraz przyjmuje 'icon' jako prop
const TopBarListOption = ({ icon, children, onClick, last }) => {
    const style = last ? { borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px" } : {};

    return (
        // Dodajemy klasę 'last' dla ostatniego elementu, aby dodać obramowanie
        <div className={`list-option ${last ? 'last' : ''}`} style={style} onClick={onClick}>
            {icon} {/* Renderujemy przekazaną ikonę */}
            <span>{children}</span>
        </div>
    );
};

export default TopBarListOption;