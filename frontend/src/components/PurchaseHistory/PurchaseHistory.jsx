import "./PurchaseHistory.css";
import { useDispatch, useSelector } from "react-redux";
import SinglePurchase from "./SinglePurchase";
//pobieramy wszystkie zamowienia uzytkownika i wszystkie produkty ktore byly zamawiane
const purchases = [{purchaseNumber: 'ABC123123', items: [{name:'item1'}, {name:'item2'}]},{purchaseNumber: 'XYZ999999', items: [{name:'item3'}, {name:'item4'}, {name: 'item5'}]}];
const PurchaseHistory = () => {
  return (
    <div className="panel purchase-history-container">
      <h3>Historia zamówień</h3>
      {purchases.map((purchase, index) => (
        <SinglePurchase
          key={purchase.id}
          purchaseObj={purchase}
          first={index === 0}
        />
      ))}
    </div>
  );
};
export default PurchaseHistory;
