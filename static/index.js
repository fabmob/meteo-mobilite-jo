const App = () => {
    const [data, setData] = React.useState(14)
    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        La météo de la mobilité pendant les JO (paris intramuros)
                    </h1>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Répartition des déplacement en voiture</h2>
                            <GeojsonMap geojsonURL="data/car.geojson"/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Répartition des déplacement en vélo</h2>
                            <GeojsonMap geojsonURL="data/cycle.geojson"/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Répartition des déplacement à pied</h2>
                            <GeojsonMap geojsonURL="data/walk.geojson"/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Part modale GPS M</h2>
                            <PieChart dataUrl="data/modal_share_gps.json"/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Part modale Compteurs</h2>
                            <PieChart dataUrl="data/modal_share_compteurs.json"/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Part modale EMG</h2>
                            <PieChart dataUrl="data/modal_share_EMG.json"/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Part modale GPS T</h2>
                            <PieChart dataUrl="data/modal_share_gps_tracemob.json"/>
                        </div>
                    </div>

                    <div className="row">
                        <h1 className="subtitle">Pôles générateurs et receveurs de mobilité par heure (3 trajets et plus)</h1>
                        <input className="input" type="range" min="0" max="23" value={data} onChange={e => setData(e.target.value)} />
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle is-6">Origines des déplacements à {data}h</h2>
                            <GeojsonMap geojsonURL={"data/origins/origins_" + data + "h.geojson"}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Destination des déplacements à {data}h</h2>
                            <GeojsonMap geojsonURL={"data/destinations/destinations_" + data + "h.geojson"}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Part modale par zone (rouge = 100% motorisé, vert = 100% vélo/marche)</h2>
                            <GeojsonMap geojsonURL="data/h3_modal_share.geojson"/>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);