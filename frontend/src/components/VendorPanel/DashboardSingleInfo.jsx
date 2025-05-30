const DashboardSingleInfo = ({name, value}) => {
    return <div className="dashboard-single-info">
        <span>{name}</span>
        <h1>{value}</h1>
    </div>
}
export default DashboardSingleInfo