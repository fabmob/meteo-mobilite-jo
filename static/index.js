const { BrowserRouter, Route, Switch, Link, useParams } = ReactRouterDOM

const transportModeColorMap = {
    "NOT_DEFINED": "#B4B4B4", // gray
    "UNKNOWN": "#969696", // Olympic Silver
    "PASSENGER_CAR": "#F0282D", // Olympic red
    "MOTORCYCLE": "#FA841E", // Orange
    "HEAVY_DUTY_VEHICLE": "#FFB114", // Light Orange
    "BUS": "#FFB114", // Olympic yellow
    "COACH": "#E67324", // Dark orange
    "RAIL_TRIP": "#0078D0", // Olympic blue
    "BOAT_TRIP": "#00287F", // Dark blue
    "BIKE_TRIP": "#6BDB83", // Light green
    "PLANE": "#980F30", // Dark red
    "SKI": "#FF9196", // Light red
    "FOOT": "#00A651", // Olympic green
    "IDLE": "#996B4F", // Bronze
    "OTHER": "#E5E5E5", // Very light gray
    "SCOOTER": "#005A46", // Dark green
    "HIGH_SPEED_TRAIN": "#5ED6FF" // Light blue
}
const transportModeTranslate = {
    "NOT_DEFINED": "non défini",
    "UNKNOWN": "inconnu",
    "PASSENGER_CAR": "la voiture",
    "MOTORCYCLE": "la moto",
    "HEAVY_DUTY_VEHICLE": "le camion",
    "BUS": "le bus",
    "COACH": "la navette",
    "RAIL_TRIP": "le train",
    "BOAT_TRIP": "le bateau",
    "BIKE_TRIP": "le vélo",
    "PLANE": "l'avion",
    "SKI": "le ski",
    "FOOT": "la marche",
    "IDLE": "inactif",
    "OTHER": "autre",
    "SCOOTER": "la trotinette",
    "HIGH_SPEED_TRAIN": "le train haute vitesse"
}
const transportModeEmoji = {
    "NOT_DEFINED": "❔",
    "UNKNOWN": "❔",
    "PASSENGER_CAR": "🚗",
    "MOTORCYCLE": "🏍️",
    "HEAVY_DUTY_VEHICLE": "🚚",
    "BUS": "🚌",
    "COACH": "🚌",
    "RAIL_TRIP": "🚇",
    "BOAT_TRIP": "🛳️",
    "BIKE_TRIP": "🚲",
    "PLANE": "✈️",
    "SKI": "⛷️",
    "FOOT": "👟",
    "IDLE": "❔",
    "OTHER": "❔",
    "SCOOTER": "🛴",
    "HIGH_SPEED_TRAIN": "🚄"
}
const sites = [
    "Arena Bercy",
    "Arena Champ-de-Mars",
    "Arena Paris Nord",
    "Arena Paris Sud",
    "Arena Porte de La Chapelle",
    "Centre Aquatique",
    "Centre National de Tir de Châteauroux",
    "Château de Versailles",
    "Colline d'Elancourt",
    "Grand Palais",
    "Hôtel de Ville",
    "Invalides",
    "La Concorde",
    "Golf National",
    "Marina de Marseille",
    "Parc des Princes",
    "Paris La Défense Arena",
    "Pont Alexandre III",
    "Site d'escalade Bourget",
    "Stade BMX de Saint-Quentin-en-Yvelines",
    "Stade de Bordeaux",
    "Stade de France",
    "Stade de la Beaujoire",
    "Stade de Lyon",
    "Stade de Marseille",
    "Stade de Nice",
    "Stade Geoffroy-Guichard",
    "Stade Nautique de Vaires-sur-Marne",
    "Stade Pierre Mauroy",
    "Stade Roland-Garros",
    "Stade Tour Eiffel",
    "Stade Yves-du-Manoir",
    "Teahupo'o, Tahiti",
    "Trocadéro",
    "Vélodrome National de Saint-Quentin-en-Yvelines"
]

const Site = () => {
    const {siteName} = useParams()
    const [data, setData] = React.useState(null)
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                let _data = await (await fetch("/data/sites/" + siteName + "/modal_share.json")).json()
                _data.favoriteArrivalMode = ""
                _data.favoriteDepartureMode = ""
                let maxVal = 0
                for (const mode in _data.end_percents_count) {
                    if (Object.hasOwnProperty.call(_data.end_percents_count, mode)) {
                        const element = _data.end_percents_count[mode]
                        if (element > maxVal) {
                            maxVal = element
                            _data.favoriteArrivalMode = mode
                        }
                    }
                }
                maxVal = 0
                for (const mode in _data.start_percents_count) {
                    if (Object.hasOwnProperty.call(_data.start_percents_count, mode)) {
                        const element = _data.start_percents_count[mode]
                        if (element > maxVal) {
                            maxVal = element
                            _data.favoriteDepartureMode = mode
                        }
                    }
                }
                setData(_data)
            } catch (error) {
                console.log(siteName, "data couldn't be fetched", error)
                setData(null)
            }
            
        }
        fetchData()
    }, [siteName])

    return (
        <section className="section">
            <h1 className="title">
                {siteName}
            </h1>
            { !data ? <h2 className="subtitle">Pas assez de données disponibles sur ce site</h2> :
                <div>
                    <h2 className="subtitle">Arrivées au site</h2>
                    <div className="columns">
                        <div className="column is-4 content">
                            <ul>
                                <li>Pour rejoindre le site, le mode de transport favorisé est <span class="tag is-info"><b>{transportModeTranslate[data.favoriteArrivalMode]} {transportModeEmoji[data.favoriteArrivalMode]}</b></span></li>
                                <li>L'impact CO2 de ces déplacements est estimé à <span class="tag is-info"><b>XX kgCO2</b></span></li>
                                <li>Comparée à hier, la quantité d'arrivées a évolué de <span class="tag is-success"><b>+XX%</b></span></li>
                            </ul>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {data.end && data.end.Total_Count} trajets</h2>
                            <PieChart dataJson={data.end_percents_count} labelColorMap={transportModeColorMap} />
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {Math.round(data.end && data.end.Total_Distance)} km totaux parcourus</h2>
                            <PieChart dataJson={data.end_percents_distance} labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {Math.round(data.end && data.end.Total_Duration/60/60)}h totales de voyage</h2>
                            <PieChart dataJson={data.end_percents_duration} labelColorMap={transportModeColorMap}/>
                        </div>
                    </div>
                    <h2 className="subtitle">Départs du site</h2>
                    <div className="columns">
                        <div className="column is-4 content">
                            <ul>
                                <li>Pour quitter le site, le mode de transport favorisé est <span class="tag is-info"><b>{transportModeTranslate[data.favoriteDepartureMode]} {transportModeEmoji[data.favoriteDepartureMode]}</b></span></li>
                                <li>L'impact CO2 de ces déplacements est estimé à <span class="tag is-info"><b>XX kgCO2</b></span></li>
                                <li>Comparée à hier, la quantité de départs a évolué de <span class="tag is-success"><b>+XX%</b></span></li>
                            </ul>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {data.start && data.start.Total_Count} trajets</h2>
                            <PieChart dataJson={data.start_percents_count} labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {Math.round(data.start && data.start.Total_Distance)} km totaux parcourus</h2>
                            <PieChart dataJson={data.start_percents_distance} labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {Math.round(data.start && data.start.Total_Duration/60/60)}h totales de voyage</h2>
                            <PieChart dataJson={data.start_percents_duration} labelColorMap={transportModeColorMap}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Zones populaires de départ des trajets se rendant au site</h2>
                            <GeojsonMap geojsonURL={"/data/sites/" + siteName + "/origin_zones.geojson"}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Zones populaires d'arrivée des trajets quittant le site</h2>
                            <GeojsonMap geojsonURL={"/data/sites/" + siteName + "/destination_zones.geojson"}/>
                        </div>
                    </div>
                    <h2 className="subtitle">Naviger vers un autre site</h2>
                    <div className="buttons has-addons">
                        {sites.map(site => <Link key={site} to={"/sites/" + site}><button className={`button ${siteName == site ? "is-info is-selected" : ""}`}>{site}</button></Link>)}
                    </div>
                </div>
            }
        </section>
    )
}
const SitesSection = () => {
    const [popularSites, setPopularSites] = React.useState([])
    
    React.useEffect(() => {
        const fetchData = async () => {
            const _data = await (await fetch("data/sites_popularity.json")).json()
            console.log(_data)
            setPopularSites(_data)
        }
        fetchData()
    }, [])

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">
                    Vue par sites olympiques
                </h1>
                <div className="columns">
                    <div className="column">
                        <h2 className="subtitle">Sites les plus populaires</h2>
                        <div className="content">
                            <ol>
                                {popularSites.map(x => <li key={x.name}>{x.name}, {x.arrivals} arrivées sur le site, {x.departures} départs depuis le site</li>)}
                            </ol>
                        </div>
                    </div>
                    <div className="column">
                        <h2 className="subtitle">Mode favorisé par site</h2>
                        <div className="content">
                            <ol>
                                {popularSites.map(x => <li key={x.name}>{x.name}: 🛬 {transportModeEmoji[x.prefered_arrival_mode]}, 🛫 {transportModeEmoji[x.prefered_departure_mode]}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
                <h2 className="subtitle">Choisir un site pour plus de détails</h2>
                <div className="buttons has-addons">
                    {sites.map(site => <Link key={site} to={"/sites/" + site}><button className="button">{site}</button></Link>)}
                </div>
                
            </div>
        </section>
    )
}
const GeneralStats = () => {
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
                            <PieChart dataUrl="data/modal_share_gps.json" labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Part modale Compteurs</h2>
                            <PieChart dataUrl="data/modal_share_compteurs.json" labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Part modale EMG</h2>
                            <PieChart dataUrl="data/modal_share_EMG.json" labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Part modale GPS T</h2>
                            <PieChart dataUrl="data/modal_share_gps_tracemob.json" labelColorMap={transportModeColorMap}/>
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
const Home = () => {
    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <div className="content">
                        <h1 className="title">
                            Introduction
                        </h1>
                        <p>Ce projet est une preuve de concept de tableau de bord pour suivre les évolutions de la mobilité jour après jour durant les Jeux olympiques de l'été 2024.</p>

                        <p>Il exploite des données de traces de mobilités et d'open data comme sources. C'est de fait aussi une preuve de concept technique d'indicateurs constructibles à partir de traces de mobilités. Ces dernières sont définies comme un trajet effectué par une personne au sein d'un unique mode de transport. On y retrouve généralement :</p>
                        <ul>
                            <li>Un identifiant utilisateur</li>
                            <li>Le mode de transport utilisé (marche, vélo, bus, voiture personnelle, etc.)</li>
                            <li>Les dates de départ et d'arrivée</li>
                            <li>Une série de coordonnées (latitude et longitude), souvent appelée "trace GPS"</li>
                            <li>(optionnel) la raison du déplacement</li>
                        </ul>
                        <p>Parfois, ces données sont assimilables aux données de "Floating Car Data" ou "Floating Cellular Data", avec comme différence l'usage de smartphones comme outil de mesure, permettant une meilleure précision et une meilleure identification du mode de transport.</p>

                        <p>Cette preuve de concept entre dans un ensemble de projets portés par la Fabrique des Mobilités en 2024-2025 autour des traces de mobilités. Consultez <a href="https://wiki.lafabriquedesmobilites.fr/wiki/Programme_%E2%80%9CConnaissance_des_mobilit%C3%A9s%E2%80%9D">ce document</a> pour plus de détails et pour y participer.</p>

                        <h2 className="subtitle">Consultez les tableaux de bord:</h2>
                        <div className="buttons">
                            <Link to="/sites"><button className="button is-primary">Statistiques par site Olympique</button></Link>
                            <Link to="/general"><button className="button is-primary">Statistiques générales</button></Link>
                        </div>
                        <hr/>
                        <p>Un POC porté par:</p>
                        <div className="columns">
                            <div className="column is-2">
                                <a href="https://lafabriquedesmobilites.fr" target="_blank">
                                    <img src="https://lafabriquedesmobilites.fr/images/fabmob_cmjn1.svg" style={{"max-height": "57px"}}></img>
                                </a>
                            </div>
                            <div className="column is-2">
                                <a href="https://www.moovance.fr" target="_blank">
                                    <img src="https://www.moovance.fr/wp-content/uploads/2022/11/logo_moovance_blanc_300_57_px_site_web.png" style={{"max-height": "57px"}}></img>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )   
}
const App = () => {
    return (
        <BrowserRouter>
            <NavBar></NavBar>
            <Switch>
                <Route path="/sites/:siteName">
                    <Site/>
                </Route>
                <Route path="/sites">
                    <SitesSection />
                </Route>
                <Route path="/general">
                    <GeneralStats />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);