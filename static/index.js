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
    "Saint-Quentin-en-Yvelines",
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
    // "Teahupo'o, Tahiti",
    "Trocadéro",
]

const Site = () => {
    const toDATE = "2024-07-26"
    const yesterDATE = "2024-05-12"
    const {siteName} = useParams()
    const [data, setData] = React.useState(null)
    const [yesterdayData, setYesterdayData] = React.useState(null)
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                let _data = await (await fetch(`/data/sites/${siteName}/${toDATE}/modal_share.json`)).json()
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
            try {
                setYesterdayData(await (await fetch(`/data/sites/${siteName}/${yesterDATE}/modal_share.json`)).json())
            } catch (error) {
                console.log(siteName, "yesterday data couldn't be fetched", error)
                setYesterdayData(null)
            }
            
        }
        fetchData()
    }, [siteName])

    const arrivalEvolution = (data && yesterdayData) ? Math.round((data.end.Total_Count - yesterdayData.end.Total_Count) / data.end.Total_Count * 100) : 0
    const departureEvolution = (data && yesterdayData) ? Math.round((data.start.Total_Count - yesterdayData.start.Total_Count) / data.start.Total_Count * 100) : 0
    return (
        <section className="section">
            <h1 className="title">
                {siteName}, le {new Date(toDATE).toLocaleDateString()}
            </h1>
            { !data ? <h2 className="subtitle">Pas assez de données disponibles sur ce site</h2> :
                <div>
                    <h2 className="subtitle">Arrivées au site</h2>
                    <div className="columns">
                        <div className="column is-4 content">
                            <ul>
                                <li>Pour rejoindre le site, le mode de transport favorisé est <span className="tag is-info"><b>{transportModeTranslate[data.favoriteArrivalMode]} {transportModeEmoji[data.favoriteArrivalMode]}</b></span></li>
                                <li>L'impact CO2 moyen de ces déplacements est estimé à <span className="tag is-info"><b>{(data.start.Total_Emission/data.start.Total_Count).toFixed(2)} kgCO2</b></span></li>
                                <li>Comparée à habituellement, la quantité d'arrivées a évolué de {arrivalEvolution >= 0 ? <span className="tag is-success"><b>+{arrivalEvolution}%</b></span> : <span className="tag is-danger"><b>{arrivalEvolution}%</b></span>}</li>
                            </ul>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Modes utilisés lors des {data.end && data.end.Total_Count} voyages</h2>
                            <BarChart dataJson={data.end.Count} labelColorMap={transportModeColorMap} />
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
                                <li>Pour quitter le site, le mode de transport favorisé est <span className="tag is-info"><b>{transportModeTranslate[data.favoriteDepartureMode]} {transportModeEmoji[data.favoriteDepartureMode]}</b></span></li>
                                <li>L'impact CO2 moyen de ces déplacements est estimé à <span className="tag is-info"><b>{(data.end.Total_Emission/data.end.Total_Count).toFixed(2)} kgCO2</b></span></li>
                                <li>Comparée à habituellement, la quantité de départs a évolué de {departureEvolution >= 0 ? <span className="tag is-success"><b>+{departureEvolution}%</b></span> : <span className="tag is-danger"><b>{departureEvolution}%</b></span>}</li>
                            </ul>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Modes utilisés lors des {data.start && data.start.Total_Count} voyages</h2>
                            <BarChart dataJson={data.start.Count} labelColorMap={transportModeColorMap}/>
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
                            <GeojsonMap geojsonURL={`/data/sites/${siteName}/${toDATE}/origin_zones.geojson`} zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag has-text-dark" style={{"background": "linear-gradient(90deg, rgba(1,255,0,1) 0%, rgba(245,255,0,1) 50%, rgba(255,0,0,1) 100%)"}}>Nombre de trajets</span>
                            </div>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Zones populaires d'arrivée des trajets quittant le site</h2>
                            <GeojsonMap geojsonURL={`/data/sites/${siteName}/${toDATE}/destination_zones.geojson`} zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag has-text-dark" style={{"background": "linear-gradient(90deg, rgba(1,255,0,1) 0%, rgba(245,255,0,1) 50%, rgba(255,0,0,1) 100%)"}}>Nombre de trajets</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            }
            <br/>
            <h2 className="subtitle">Naviger vers un autre site</h2>
            <div className="buttons has-addons">
                {sites.map(site => <Link key={site} to={"/sites/" + site}><button className={`button ${siteName == site ? "is-info is-selected" : ""}`}>{site}</button></Link>)}
            </div>
        </section>
    )
}
const SitesSection = () => {
    const toDATE = "2024-07-26"
    const yesterDATE = "2024-05-12"
    const [popularSites, setPopularSites] = React.useState([])
    const [yesterdayPopularSites, setYesterdayPopularSites] = React.useState([])
    
    React.useEffect(() => {
        const fetchData = async () => {
            const _data = await (await fetch(`data/sites_popularity/${toDATE}.json`)).json()
            console.log(_data)
            setPopularSites(_data)
            setYesterdayPopularSites(await (await fetch(`data/sites_popularity/${yesterDATE}.json`)).json())
        }
        fetchData()
    }, [])
    const yesterdayPopularSitesNames = yesterdayPopularSites.map(x => x.name)
    for (let i = 0; i < popularSites.length; i++) {
        const yesterdayIndex = yesterdayPopularSitesNames.indexOf(popularSites[i].name)
        popularSites[i].indexDiff = i - yesterdayIndex
    }
    return (
        <section className="section">
            <div className="container">
                <h1 className="title">
                    Vue par sites olympiques, le {new Date(toDATE).toLocaleDateString()}
                </h1>
                <div className="columns">
                    <div className="column">
                        <h2 className="subtitle">Sites les plus populaires</h2>
                        <div className="content">
                            <ol>
                                {popularSites.map(x => <li key={x.name}>
                                    {x.indexDiff == 0 ? <span className="tag position-tag is-warning">+0</span>
                                    : x.indexDiff > 0 ? <span className="tag position-tag is-danger">+{x.indexDiff}</span>
                                    : <span className="tag position-tag is-success">{x.indexDiff}</span>}
                                    <span><Link to={`/sites/${x.name}`}>{x.name}</Link>, {x.arrivals} arrivées sur le site, {x.departures} départs</span>
                                </li>)}
                            </ol>
                        </div>
                    </div>
                    <div className="column">
                        <h2 className="subtitle">Mode favorisé par site</h2>
                        <div className="content">
                            <ol style={{"lineHeight": "25px"}}>
                                {popularSites.map(x => <li key={x.name}>{x.name}: Arrivées {transportModeEmoji[x.prefered_arrival_mode]}, Départs {transportModeEmoji[x.prefered_departure_mode]}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
                {/* <h2 className="subtitle">Choisir un site pour plus de détails</h2>
                <div className="buttons has-addons">
                    {sites.map(site => <Link key={site} to={"/sites/" + site}><button className="button">{site}</button></Link>)}
                </div> */}
                
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
                        Répartition habituelle des déplacements
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
                            <h2 className="subtitle">Part modale Traces</h2>
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
const Exode = () => {
    const [minCount, setMinCount] = useState(4)
    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        Grands mouvements de population
                    </h1>
                    <p>
                        Zones affichées à partir de <b>{minCount}</b> voyages, changez ce filtre avec le sélecteur ci-dessous.
                    </p>
                    <div>
                        <input className="input" type="range" min="4" max="100" value={minCount} onChange={e => setMinCount(e.target.value)} />
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Voyageurs quittant l'Île-de-france le vendredi 27/07/24</h2>
                            <GeojsonMap geojsonURL="data/26_exode.geojson" geojsonURL2="data/26_exode_lines.geojson" minCount={minCount} opacity="0.2" zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Train</span> <span className="tag is-warning">Voiture</span> <span className="tag is-danger">Avion</span> <span className="tag has-background-dark has-text-white">Inconnu</span>, Epaisseur du trait: nombre de voyages
                            </div>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Voyageurs arrivants en Île-de-france le vendredi 27/07/24</h2>
                            <GeojsonMap geojsonURL="data/26_inxode.geojson" geojsonURL2="data/26_inxode_lines.geojson" minCount={minCount} opacity="0.2" zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Train</span> <span className="tag is-warning">Voiture</span> <span className="tag is-danger">Avion</span> <span className="tag has-background-dark has-text-white">Inconnu</span>, Epaisseur du trait: nombre de voyages
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Voyageurs quittant l'Île-de-france le jeudi 09/05/24</h2>
                            <GeojsonMap geojsonURL="data/exode.geojson" geojsonURL2="data/exode_lines.geojson" minCount={minCount} opacity="0.2" zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Train</span> <span className="tag is-warning">Voiture</span> <span className="tag is-danger">Avion</span> <span className="tag has-background-dark has-text-white">Inconnu</span>, Epaisseur du trait: nombre de voyages
                            </div>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Voyageurs revenant en Île-de-france le dimanche 12/05/24</h2>
                            <GeojsonMap geojsonURL="data/inxode.geojson" geojsonURL2="data/inxode_lines.geojson" minCount={minCount} opacity="0.2" zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Train</span> <span className="tag is-warning">Voiture</span> <span className="tag is-danger">Avion</span> <span className="tag has-background-dark has-text-white">Inconnu</span>, Epaisseur du trait: nombre de voyages
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Voyageurs quittant l'Île-de-france le jeudi 09/05/24</h2>
                            <GeojsonMap geojsonURL="data/03_exode.geojson" geojsonURL2="data/03_exode_lines.geojson" minCount={minCount} opacity="0.2" zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Train</span> <span className="tag is-warning">Voiture</span> <span className="tag is-danger">Avion</span> <span className="tag has-background-dark has-text-white">Inconnu</span>, Epaisseur du trait: nombre de voyages
                            </div>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Voyageurs revenant en Île-de-france le dimanche 12/05/24</h2>
                            <GeojsonMap geojsonURL="data/03_inxode.geojson" geojsonURL2="data/03_inxode_lines.geojson" minCount={minCount} opacity="0.2" zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Train</span> <span className="tag is-warning">Voiture</span> <span className="tag is-danger">Avion</span> <span className="tag has-background-dark has-text-white">Inconnu</span>, Epaisseur du trait: nombre de voyages
                            </div>
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

                        <h2 className="subtitle">Consultez les tableaux de bord:</h2>
                        <div className="buttons">
                            <Link to="/ceremonie_ouverture"><button className="button is-primary">Cérémonie d'ouverture</button></Link>
                            <Link to="/sites"><button className="button is-primary">Statistiques par site Olympique</button></Link>
                            {/* <Link to="/general"><button className="button is-primary">Statistiques générales</button></Link> */}
                            <Link to="/exode"><button className="button is-primary">Grands Mouvements</button></Link>
                        </div>

                        <h2 className="subtitle">Une preuve de concept portée par:</h2>
                        <div className="columns">
                            <div className="column is-2">
                                <a href="https://lafabriquedesmobilites.fr" target="_blank">
                                    <img src="https://lafabriquedesmobilites.fr/images/fabmob_cmjn1.svg" style={{"maxHeight": "80px"}}></img>
                                </a>
                            </div>
                            <div className="column is-2">
                                <a href="https://www.moovance.fr" target="_blank">
                                    <img src="/images/Logo_MOOVANCE-02.png" style={{"maxHeight": "80px"}}></img>
                                </a>
                            </div>
                        </div>

                        <h2 className="subtitle">Données sources</h2>
                        <p>Le projet exploite des données de traces de mobilités et d'open data comme sources. Il est donc aussi une preuve de concept technique d'indicateurs constructibles à partir de traces de mobilités. Ces dernières sont définies comme un trajet effectué par une personne au sein d'un unique mode de transport. On y retrouve généralement :</p>
                        <ul>
                            <li>Un identifiant utilisateur</li>
                            <li>Le mode de transport utilisé (marche, vélo, bus, voiture personnelle, etc.)</li>
                            <li>Les dates de départ et d'arrivée</li>
                            <li>Une série de coordonnées (latitude et longitude), souvent appelée "trace GPS"</li>
                            <li>(optionnel) la raison du déplacement</li>
                        </ul>
                        <p>Parfois, ces données sont assimilables aux données de "Floating Car Data" ou "Floating Cellular Data", avec comme différence l'usage de smartphones comme outil de mesure, permettant une meilleure précision et une meilleure identification du mode de transport.</p>

                        <p>Cette preuve de concept entre dans un ensemble de projets portés par la Fabrique des Mobilités en 2024-2025 autour des traces de mobilités. Consultez <a href="https://wiki.lafabriquedesmobilites.fr/wiki/Programme_%E2%80%9CConnaissance_des_mobilit%C3%A9s%E2%80%9D">ce document</a> pour plus de détails et pour y participer.</p>

                        <p><b>Note importante</b>: du fait de leur source (application mobile), les données ne sont naturellement ni exhaustives, ni représentatives de l'ensemble de la population. Elles sont limitées aux utilisateurs de l'application mobile Moovance, une population relativement jeune et technophile. </p>
                        
                    </div>
                </div>
            </section>
        </div>
    )   
}
const CeremonieOuverture = () => {
    const [data, setData] = React.useState(null)
    const [zone, setZone] = React.useState("all")
    // const [yesterdayData, setYesterdayData] = React.useState(null)
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                let _data = await (await fetch(`/data/ceremony/modal_share.json`)).json()
                console.log(_data)
                for (const _zone of ["all", "red_zone", "black_zone"]) {
                    console.log(_zone)
                    console.log(_data[_zone])
                    _data[_zone].favoriteMode = ""
                    let maxVal = 0
                    for (const mode in _data[_zone].percents_count) {
                        if (Object.hasOwnProperty.call(_data[_zone].percents_count, mode)) {
                            const element = _data[_zone].percents_count[mode]
                            if (element > maxVal) {
                                maxVal = element
                                _data[_zone].favoriteMode = mode
                            }
                        }
                    }
                }
                setData(_data)
            } catch (error) {
                console.log("data couldn't be fetched", error)
                setData(null)
            }
            
        }
        fetchData()
    }, [])
    const evolution = 0

    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        Déplacement durant la céremonie d'ouverture JO 2024
                    </h1>
                    <h2 className="subtitle">Statistiques générales des voyages commençants ou arrivants dans une zone</h2>
                    <div className="buttons has-addons">
                        <button onClick={_ => setZone("all")} className={`button ${zone == "all" ? "is-info is-selected" : ""}`}>Ensemble des données</button>
                        <button onClick={_ => setZone("red_zone")} className={`button ${zone == "red_zone" ? "is-info is-selected" : ""}`}>Zone rouge</button>
                        <button onClick={_ => setZone("black_zone")} className={`button ${zone == "black_zone" ? "is-info is-selected" : ""}`}>Zone anti-terroriste</button>
                    </div>
                    <div className="columns">
                        <div className="column content">
                            <ul>
                                {zone === "all" && <li>Par défaut, nous considérons <span className="tag is-info">tous les trajets parisiens</span>. Utilisez les boutons ci-dessus pour filtrer sur une zone spécifique.</li>}
                                {zone === "red_zone" && <li>La <span className="tag is-danger">zone rouge</span> est une zone de circulation interdite pour les véhicules motorisés. Des dérogations sont possibles avec un pass-jeux.</li>}
                                {zone === "black_zone" && <li>La <span className="tag is-dark">zone antiterroriste</span> est une zone d'accès totalement interdite, sauf exceptions et détenteurs de billets pour la cérémonie.</li>}
                                <br/>
                                {data && data[zone] && <li>Notre échantillon: <span className="tag is-info"><b>{data[zone].stats.Total_Users}</b></span> personnes</li>}
                                {data && data[zone] && <li>Le mode de transport favorisé est <span className="tag is-info"><b>{transportModeTranslate[data[zone].favoriteMode]} {transportModeEmoji[data[zone].favoriteMode]}</b></span></li>}
                                {data && data[zone] && <li>L'impact CO2 moyen de ces déplacements est estimé à <span className="tag is-info"><b>{(data[zone].stats.Total_Emission/data[zone].stats.Total_Count).toFixed(2)} kgCO2</b></span></li>}
                                {data && data[zone] && <li>Comparée à un vendredi classique, la quantité de déplacements a évolué de {evolution >= 0 ? <span className="tag is-success"><b>+{evolution}%</b></span> : <span className="tag is-danger"><b>{evolution}%</b></span>}</li>}
                            </ul>
                        </div>
                        <div className="column">
                            {zone === "all" && <GeojsonMap geojsonURL="data/zones/paris.geojson" forceHeight="250px" forceColor="rgb(102, 209, 255)"/>}
                            {zone === "red_zone" && <GeojsonMap geojsonURL="data/zones/ceremony_red.geojson" forceHeight="250px" forceColor="rgb(255, 102, 133)"/>}
                            {zone === "black_zone" && <GeojsonMap geojsonURL="data/zones/ceremony_silt.geojson" forceHeight="250px" forceColor="rgb(46, 51, 61)"/>}
                        </div>
                    </div>
                    {data && data[zone] && <div className="columns">
                        <div className="column">
                            <h2 className="subtitle is-6">Modes utilisés lors des {data[zone].stats.Total_Count} voyages</h2>
                            <BarChart dataJson={data[zone].stats.Count} labelColorMap={transportModeColorMap} />
                            <p style={{"marginTop": "-30px", "fontSize": "12px"}}><i>Note: un voyage peut contenir plusieurs modes de transport</i></p>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {Math.round(data[zone].stats.Total_Distance)} km totaux parcourus</h2>
                            <PieChart dataJson={data[zone].percents_distance} labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Repartition des {Math.round(data[zone].stats.Total_Duration/60/60)}h totales de voyage</h2>
                            <PieChart dataJson={data[zone].percents_duration} labelColorMap={transportModeColorMap}/>
                        </div>
                    </div>
                    }
                    {zone === "all" && <div className="columns">
                        <div className="column">
                            <h2 className="subtitle is-6">Déplacements par quart d'heure</h2>
                            <StackedBarChart dataUrl="data/ceremony/trips_per_15_min.json" labelColorMap={transportModeColorMap} />
                        </div>
                    </div>}
                    {zone === "black_zone" && <div className="columns">
                        <div className="column">
                            <h2 className="subtitle is-6">Arrivées dans la zone</h2>
                            <StackedBarChart dataUrl="data/ceremony/black_zone_entry.json" labelColorMap={transportModeColorMap} />
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Départs de la zone</h2>
                            <StackedBarChart dataUrl="data/ceremony/black_zone_exits.json" labelColorMap={transportModeColorMap} />
                        </div>
                    </div>}
                    {zone === "red_zone" && <div className="columns">
                        <div className="column">
                            <h2 className="subtitle is-6">Arrivées dans la zone</h2>
                            <StackedBarChart dataUrl="data/ceremony/red_zone_entry.json" labelColorMap={transportModeColorMap} />
                        </div>
                        <div className="column">
                            <h2 className="subtitle is-6">Départs de la zone</h2>
                            <StackedBarChart dataUrl="data/ceremony/red_zone_exits.json" labelColorMap={transportModeColorMap} />
                        </div>
                    </div>}
                    <div className="content">
                        <p>Rappel des moments forts de la cérémonie:</p>
                        <ul>
                            <li>17h30: les visiteurs sont arrivés dans les zones et patientent dans les files d'attente</li>
                            <li>19h30: la cérémonie commence</li>
                            <li>21h45: passage du bateau français, fin du défilé des athlètes</li>
                            <li>22h30: la cérémonie s'enchaîne au Trocadéro</li>
                            <li>23h15: la vasque olympique est allumée </li>
                            <li>23h30: fin de cérémonie</li>
                        </ul>
                    </div>
                    <hr />
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Mode de transport favorisé le jour de la cérémonie</h2>
                            <GeojsonMap geojsonURL="data/ceremony_h3_modal_share_tc_in_clean.geojson"/>
                            <div className="row">
                                Légende: <span className="tag is-success">0% des trajets sont en voiture ou moto</span> <span className="tag is-warning">50% des trajets sont motorisés</span> <span className="tag is-danger">100% des trajets sont motorisés</span>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Évolution des modes de transports favorisés, comparé à un jour normal</h2>
                            <GeojsonMap geojsonURL="data/ceremony_h3_modal_change_tc_in_clean.geojson"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Trajets nettement moins motorisés qu'habituellement</span> <span className="tag is-light">Peu de changements par rapport à l'habituel</span> <span className="tag is-danger">Trajets nettement plus motorisés qu'habituellement</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
const Footer = () => {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <p>
                    Un site proposé en <a href="https://github.com/fabmob/meteo-mobilite-jo">open source</a> par <a href="https://lafabriquedesmobilites.fr/">la Fabrique des Mobilités</a>, propulsé grace aux données de <a href="https://www.moovance.fr/">Moovance</a>.<br/>
                    Données sources ni exhaustives, ni représentatives de la population. Limitées aux utilisateurs de l'application Moovance.
                </p>
            </div>
        </footer>
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
                <Route path="/exode">
                    <Exode />
                </Route>
                <Route path="/ceremonie_ouverture">
                    <CeremonieOuverture />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
            <Footer />
        </BrowserRouter>
    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);