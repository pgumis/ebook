import "./Rating.css";
const Rating = ({ ratingObj, index }) => {
  const style = index % 2 === 0 ? "rating rating-even" : "rating rating-odd";
  return (
    <div className={style}>
      <div className="rating-author-container">
        <img src={ratingObj.authorImg} />
        <span>{ratingObj.author}</span>
      </div>
      <div className="rating-rating-container">
        <span style={{ color: "orange" }}>★</span>
        <span>{ratingObj.rating}</span>
      </div>
      <div className="rating-details">
        <span className="rating-date">{ratingObj.date}</span>
        <span>{ratingObj.text}</span>
      </div>
    </div>
  );
};
export default Rating;
