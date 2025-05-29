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
    <span style={{ fontWeight: "bold", letterSpacing: "5px", color: "orange" }}>
      {orangeStars}
      <span style={{ color: "lightgray" }}>{greyStars}</span>
    </span>
  );
};

export default generateStars;