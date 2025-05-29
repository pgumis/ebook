import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";


const SinglePurchase = ({purchaseObj, first}) => {
    const dispatch = useDispatch();
    let style = first ? {borderTop: "1px solid green"} : {};
    console.log(purchaseObj);
    const {purchaseNumber, items} = purchaseObj; 
    return <div className="single-purchase" style={style} onClick={()=>{dispatch(viewActions.changeView("purchaseDetails"));}}>
    <div>
        <h5>{purchaseNumber}</h5>
        {items.map((item, index) => (
                <p>{item.name}</p>
            ))}
    </div>
       <svg height="24px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="24px" xmlns="http://www.w3.org/2000/svg"><polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "/></svg>
    </div>
}
export default SinglePurchase;