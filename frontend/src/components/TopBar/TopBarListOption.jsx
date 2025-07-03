import "./TopBarListOption.css";

const TopBarListOption = ({ icon, children, onClick, last }) => {
    const style = last ? { borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px" } : {};

    return (
        <div className={`list-option ${last ? 'last' : ''}`} style={style} onClick={onClick}>
            {icon}
            <span>{children}</span>
        </div>
    );
};

export default TopBarListOption;