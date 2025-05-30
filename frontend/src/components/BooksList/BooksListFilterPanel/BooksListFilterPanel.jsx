const BooksListFilterPanel = () => {
    return <div className="panel">
        <h3>Filtrowanie</h3>
        <h5 style={{marginBottom: '0'}}>Kategorie</h5>
        <ul style={{padding:'1rem', margin:0}}>
            <li>biografie</li>
            <li>biznes</li>
            <li>dla dzieci</li>
            <li>dla młodzieży</li>
            <li>fantastyka</li>
            <li>historia</li>
            <li>horror</li>
            <li>komiks</li>
            <li>literatura faktu</li>
            <li>literatura obyczajowa</li>
            <li>rozwój osobisty</li>
            <li>sport</li>
            <li>turystyka</li>
        </ul>
    </div>
}
export default BooksListFilterPanel;