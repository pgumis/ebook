import { useSelector } from "react-redux";
import DashboardContainer from "./DashboardContainer";
import VendorsBookList from "./VendorsBookList";
const VendorPanel = () => {
    const userData = useSelector((state) => state.userData);
    console.log(userData);
    return <div className="panel">
        <h2>
            Witaj, {userData.imie} {userData.nazwisko} 👋
        </h2>
        <DashboardContainer />
        <VendorsBookList />
        
    </div>
}

export default VendorPanel;