import { useSelector } from "react-redux";
import "./PurchaseDetails.css";
//pobieram ze stora numer zamowienia ktory wybral uz i pobiera z backendu informacje na temat tego zamowienia

const ksiazki = [
  {
    id: 1,
    okladka: "okladka1.jpg",
    title: "Harry Potter i Kamień Filozoficzny",
    author: "J.K Rowling",
    price: "32.99zł",
    rating: 4.3,
  },
  {
    id: 2,
    title: "Harry Potter i Pan Tadeusz",
    okladka: "okladka2.jpg",
    author: "J.K Bowling",
    price: "49.99",
    rating: 5.0,
  },
  {
    id: 2,
    title: "Harry Potter i Pan Tadeusz",
    okladka: "okladka2.jpg",
    author: "J.K Bowling",
    price: "49.99",
    rating: 5.0,
  },
];

const PurchaseDetails = () => {
  let totalPrice = 0;
  ksiazki.forEach((ksiazka) => {
    totalPrice += parseFloat(ksiazka.price);
  });
  console.log(totalPrice);
  return (
    <div className="panel purchase-details-wrapper">
      <p>Informacje na temat zamówienia ABC123123</p>
      {ksiazki.map((ksiazka) => (
        <div className="purchase-details-book-container">
          <div style={{ display: "flex", gap: "10rem", alignItems: "center" }}>
            <div>
              <img
                src={ksiazka.okladka}
                alt="okladka ksiazki"
                className="purchase-details-img"
              />
            </div>
            <div className="purchase-details-book-info">
              <span>{ksiazka.title}</span>
              <span>{ksiazka.author}</span>
              <span>{ksiazka.price}</span>
            </div>
          </div>

          <div>
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M12 9L12 15M12 15L15 12M12 15L9 12"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
      ))}
      <p>Całkowita wartość zamówienia: {totalPrice}</p>
    </div>
  );
};

export default PurchaseDetails;
