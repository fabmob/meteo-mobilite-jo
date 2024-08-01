const DateSelector = ({date, setDate}) => {
    const [displayDropdown, setDisplayDropdown] = React.useState(false)
    let lastValidDay = new Date()
    lastValidDay.setDate(lastValidDay.getDate() - 1)
    lastValidDay = lastValidDay.toISOString()
    const TdBtn = ({d, month, dstart}) => (
        <td>
            <button 
                className={"button " + ((date == dstart+d) ? "is-primary" : "")}
                disabled={dstart+d > lastValidDay}
                style={{"display": "initial"}} 
                onClick={_ => {setDisplayDropdown(false); setDate(dstart+d)}}
            >
                <div>{d}</div>
                <div style={{"fontSize": "10px", "width": "25px"}}>{month}</div>
            </button>
        </td>
    )
    return (
        <div className={"dropdown " + (displayDropdown ? "is-active" : "")}>
            <div className="dropdown-trigger">
                <button className="button" onClick={_ => setDisplayDropdown(!displayDropdown)}>
                    <span>{new Date(date).toLocaleDateString()} ▼</span>
                </button>
            </div>
            <div className="dropdown-menu" style={{"zIndex": "5000"}}>
                <div className="dropdown-content" style={{"padding": "15px"}}>
                    <table>
                        <thead>
                            <tr>
                                {["L", "Ma", "Me", "J", "V", "S", "D"].map(j=>(<th key={j} style={{"textAlign": "center", "fontSize": "16px", "height": "30px"}}>{j}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                {["24","25","26","27","28"].map(d => <TdBtn key={d} d={d} month="Juil" dstart="2024-07-"/>)}    
                            </tr>
                            <tr>
                                {["29","30","31"].map(d => <TdBtn key={d} d={d} month="Juil" dstart="2024-07-"/>)}
                                {["01","02","03","04"].map(d => <TdBtn key={d} d={d} month="Août" dstart="2024-08-"/>)}
                            </tr>
                            <tr>
                                {["05","06","07","08","09","10","11"].map(d => <TdBtn key={d} d={d} month="Août" dstart="2024-08-"/>)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}