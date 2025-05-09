import "./Book.css";
const generateStars = (rating) => {
  let orangeStars = "";
  let greyStars = "";
  for (let i = rating; i > 0; i--) {
    if (i < 1) {
      orangeStars += "⯪";
    } else {
      orangeStars += "★";
    }
  }
  for (let i = 5 - orangeStars.length; i > 0; i--) {
    greyStars += "★";
  }
  return (
    <p style={{ fontWeight: "bold", letterSpacing: "5px", color: "orange" }}>
      {orangeStars}
      <span style={{ color: "lightgray" }}>{greyStars}</span>
    </p>
  );
};
const Book = ({ bookObj }) => {
  const rating = generateStars(3.2);
  return (
    <div className="book-wrapper">
      <div className="book-img-wrapper">
        <img src="okladka1.jpg" />
      </div>
      <div className="book-txt-content">
        <p>32.99 zł</p>
        {rating}
        <p>{bookObj.title}</p>
        <p>{bookObj.author}</p>
      </div>
    </div>
  );
};
export default Book;
