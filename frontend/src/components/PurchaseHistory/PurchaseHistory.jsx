import "./PurchaseHistory.css";
import { useDispatch, useSelector } from "react-redux";
import SinglePurchase from "./SinglePurchase";
//pobieramy wszystkie zamowienia uzytkownika i wszystkie produkty ktore byly zamawiane
const purchases = [
  {
    purchaseNumber: "ABC123123",
    items: [{ name: "item1" }, { name: "item2" }],
  },
  {
    purchaseNumber: "XYZ999999",
    items: [{ name: "item3" }, { name: "item4" }, { name: "item5" }],
  },
];
const PurchaseHistory = () => {
  return (
    <div className="panel purchase-history-container">
      <h3>Historia zamówień</h3>
      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Cena</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>123123</td>
            <td>20-05-2025</td>
            <td>123,00</td>
            <td>Zrealizowano</td>
            <td>
              <div className="purchase-history-open-details-btn" >
                <svg
                  height="24px"
                  id="Layer_1"
                  version="1.1"
                  viewBox="0 0 512 512"
                  width="24px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 " />
                </svg>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default PurchaseHistory;
