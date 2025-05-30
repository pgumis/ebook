import './Dashboard.css'
import DashboardSingleInfo from "./DashboardSingleInfo"

const DashboardContainer = () => {
    return <div className="dashboard-container">
        <DashboardSingleInfo name = "Wystawione książki" value = "7" />
        <DashboardSingleInfo name = "Sprzedanych w tym miesiąciu" value = "1038" />
        <DashboardSingleInfo name = "Zysk w tym miesiąciu" value = "12,45K PLN" />
    </div>
}
export default DashboardContainer