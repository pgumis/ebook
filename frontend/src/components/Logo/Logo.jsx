import "./Logo.css"
const Logo = (props) => {
    const {onClick} = props;
  return (
    <>
      <div
        className="logo"
        style={onClick && { cursor: "pointer" }}
        onClick={onClick}
      >
        <img src="./logo.png" alt="małsz" />
        <div className="logo-txt">
          <span style={{ fontSize: 24 }}>E-BOOK</span>
          <span style={{ fontSize: 16 }}>na wynos</span>
        </div>
      </div>
    </>
  );
};
export default Logo;
