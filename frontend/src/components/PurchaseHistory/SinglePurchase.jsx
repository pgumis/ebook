// SinglePurchase.jsx
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";

const SinglePurchase = ({ purchaseObj }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        // Przekazujemy obiekt z nazwą widoku i ID zamówienia
        dispatch(viewActions.changeView({
            view: "purchaseDetails",
            itemId: purchaseObj.id
        }));
    };

    // Formatowanie daty
    const formattedDate = new Date(purchaseObj.created_at).toLocaleDateString('pl-PL', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="single-purchase" onClick={handleClick}>
            <div className="purchase-info">
                <span className="purchase-id">Zamówienie #{purchaseObj.id}</span>
                <span className="purchase-date">{formattedDate}</span>
                <span className={`purchase-status status-${purchaseObj.status}`}>{purchaseObj.status}</span>
            </div>
            <div className="purchase-summary">
                <span className="purchase-total">{parseFloat(purchaseObj.suma).toFixed(2)} zł</span>
                <svg height="24px" viewBox="0 0 512 512" width="24px"><polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "/></svg>
            </div>
        </div>
    );
};

export default SinglePurchase;