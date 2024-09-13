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
    "HIGH_SPEED_TRAIN": "#5ED6FF", // Light blue
    "PT": "#0078D0", // Olympic blue
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

const availableColors = ["#B4B4B4", "#969696", "#F0282D", "#FA841E", "#FFB114", "#FFB114", "#E67324", "#0078D0", "#00287F", "#6BDB83", "#980F30", "#FF9196", "#00A651", "#996B4F", "#005A46", "#5ED6FF"]
const sitesColorMap = {}
for (let i = 0; i < sites.length; i++) {
    sitesColorMap[sites[i]] = availableColors[i%availableColors.length]
}
const daysofweek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const daysColorMap = {}
for (let i = 0; i < daysofweek.length; i++) {
    daysColorMap[daysofweek[i]] = availableColors[(i*2)%availableColors.length]
}

const Site = () => {
    const {siteName} = useParams()
    const url = new URL(window.location.href)
    const [toDATE, setToDate] = React.useState(url.searchParams.get("date") || "2024-08-11")

    const [data, setData] = React.useState(null)
    const [yesterdayData, setYesterdayData] = React.useState(null)
    const [siteBehavior, setSiteBehavior] = React.useState(null)
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

            let yesterDATE = new Date(toDATE)
            yesterDATE.setDate(yesterDATE.getDate() - 1)
            yesterDATE = yesterDATE.toISOString().split("T")[0]
            try {
                setYesterdayData(await (await fetch(`/data/sites/${siteName}/${yesterDATE}/modal_share.json`)).json())
            } catch (error) {
                console.log(siteName, "yesterday data couldn't be fetched", error, "trying default 2024-05-12")
                try {
                    setYesterdayData(await (await fetch(`/data/sites/${siteName}/2024-05-12/modal_share.json`)).json())
                } catch (error) {
                    console.log(siteName, "default yesterday data couldn't be fetched either")
                    setYesterdayData(null)
                }
            }
            try {
                setSiteBehavior((await (await fetch(`/data/sites/sites_behavior.json`)).json())[siteName])
            } catch (error) {
                console.log(siteName, "sites behavior data couldn't be fetched", error)
                setSiteBehavior(null)
            }
            
        }
        fetchData()
    }, [siteName, toDATE])

    const setToDateAndParam = (d) => {
        setToDate(d)
        url.searchParams.set("date", d)
        history.pushState({}, '', url.href)
    }

    const reduceBehaviorDict = (key, ignoredSite) => {
        let reducedDict = {}
        for (let site in siteBehavior) {
            if (Object.hasOwnProperty.call(siteBehavior, site)) {
                if (site == ignoredSite) continue
                const siteVal = siteBehavior[site]
                if (siteVal[key] > 0) {
                    if (site === "Aucun") site = "Aucun, c'est le premier site visité"
                    reducedDict[site] = siteVal[key]
                }
            }
        }
        return reducedDict
    }

    const arrivalEvolution = (data && yesterdayData) ? Math.round((data.end.Total_Count - yesterdayData.end.Total_Count) / data.end.Total_Count * 100) : 0
    const departureEvolution = (data && yesterdayData) ? Math.round((data.start.Total_Count - yesterdayData.start.Total_Count) / data.start.Total_Count * 100) : 0
    return (
        <section className="section">
            <h1 className="title">
                {siteName}, le <DateSelector date={toDATE} setDate={setToDateAndParam} />
            </h1>
            { !data ? <h2 className="subtitle">Pas assez de données disponibles sur ce site à cette date</h2> :
                <div>
                    <h2 className="subtitle">Arrivées au site</h2>
                    <div className="columns">
                        <div className="column is-4 content">
                            <ul>
                                <li>Pour rejoindre le site, le mode de transport favorisé est <span className="tag is-info"><b>{transportModeTranslate[data.favoriteArrivalMode]} {transportModeEmoji[data.favoriteArrivalMode]}</b></span></li>
                                <li>L'impact CO2 moyen de ces déplacements est estimé à <span className="tag is-info"><b>{(data.start.Total_Emission/data.start.Total_Count).toFixed(2)} kgCO2</b></span></li>
                                <li>Comparée à la veille, la quantité d'arrivées a évolué de {arrivalEvolution >= 0 ? <span className="tag is-success"><b>+{arrivalEvolution}%</b></span> : <span className="tag is-danger"><b>{arrivalEvolution}%</b></span>}</li>
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
                                <li>Comparée à la veille, la quantité de départs a évolué de {departureEvolution >= 0 ? <span className="tag is-success"><b>+{departureEvolution}%</b></span> : <span className="tag is-danger"><b>{departureEvolution}%</b></span>}</li>
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
            <hr/>
            {siteBehavior && <h1 className="title">
                {siteName}, statistiques générales, sur l'ensemble de la période des jeux
            </h1>}
            {siteBehavior && <div>
                <h2 className="subtitle">Comportement des visiteurs</h2>
                <div className="columns">
                    {siteBehavior[siteName] && <div className="column content">
                        <ul>
                            <li><span className="tag is-info"><b>{siteBehavior.total_unique_users} visiteurs</b></span> se sont rendus sur le site, totalisant <span className="tag is-info"><b>{siteBehavior.total_unique_journeys} trajets</b></span></li>
                            <li style={{"listStyleType": "none"}}><ul><li>Les visiteurs sont en moyenne venus <span className="tag is-info"><b>{siteBehavior.average_visits_per_user.toFixed(1)} fois</b></span></li></ul></li>
                            <li><span className="tag is-info"><b>{Math.round(siteBehavior[siteName].unique_users_who_also_visited * 100 / siteBehavior.total_unique_users)}%</b></span> des visiteurs sont revenus sur le site au moins une fois</li>
                            <li style={{"listStyleType": "none"}}><ul><li>Ces derniers sont en moyenne venus <span className="tag is-info"><b>{(siteBehavior[siteName].times_this_was_also_visited / siteBehavior[siteName].unique_users_who_also_visited).toFixed(1)} fois</b></span></li></ul></li>
                            <li>Les voyages se rendant sur site durent en moyenne <span className="tag is-info"><b>{(siteBehavior.mean_trip_duration_seconds/60).toFixed(1)} minutes</b></span></li>
                            <li>Le mode de transport (hors marche) le plus utilisé est <span className="tag is-info"><b>{transportModeTranslate[siteBehavior.most_common_transport]} {transportModeEmoji[siteBehavior.most_common_transport]}</b></span>, avec <span className="tag is-info"><b>{siteBehavior.most_common_transport_total_unique_journeys} trajets</b></span></li>
                            <li style={{"listStyleType": "none"}}><ul><li>Les trajets contenant ce mode durent en moyenne <span className="tag is-info"><b>{(siteBehavior.mean_trip_duration_seconds_including_most_common_transport/60).toFixed(1)} minutes</b></span></li></ul></li>
                            <li style={{"listStyleType": "none"}}><ul><li>Dont <span className="tag is-info"><b>{(siteBehavior.mean_trip_duration_seconds_with_most_common_transport/60).toFixed(1)} minutes</b></span> avec ce mode</li></ul></li>
                        </ul>
                    </div>}
                    <div className="column">
                        <h2 className="subtitle is-6">Les visiteurs de {siteName} ont aussi visité (nb visiteurs)</h2>
                        <BarChart dataJson={reduceBehaviorDict("unique_users_who_also_visited", siteName)} labelColorMap={sitesColorMap} label="visiteurs" />
                    </div>
                    <div className="column">
                        <h2 className="subtitle is-6">Les visiteurs de {siteName} ont aussi visité (nb visites)</h2>
                        <BarChart dataJson={reduceBehaviorDict("times_this_was_also_visited", siteName)} labelColorMap={sitesColorMap} label="visites" />
                    </div>
                </div>
                <h2 className="subtitle">Déplacements avant de se rendre sur le site</h2>
                <div className="columns">
                    <div className="column">
                        <h2 className="subtitle is-6">Dernier site visité avant {siteName}</h2>
                        <BarChart dataJson={reduceBehaviorDict("times_this_was_the_previous_visited_site")} labelColorMap={sitesColorMap} label="visites" />
                    </div>
                    <div className="column">
                        <h2 className="subtitle is-6">Temps moyen entre les visites</h2>
                        <BarChart dataJson={reduceBehaviorDict("mean_duration_between_visits_in_hours")} labelColorMap={sitesColorMap} label="heures" />
                    </div>
                </div>
                
            </div>
            }
            
            <hr/>
            <h1 className="title">Naviger vers un autre site</h1>
            <div className="buttons has-addons">
                {sites.map(site => <Link key={site} to={"/sites/" + site}><button className={`button ${siteName == site ? "is-info is-selected" : ""}`}>{site}</button></Link>)}
            </div>
        </section>
    )
}

const SitesSection = () => {
    const [toDATE, setToDate] = React.useState("2024-08-11")
    const [popularSites, setPopularSites] = React.useState([])
    const [yesterdayPopularSites, setYesterdayPopularSites] = React.useState([])
    
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const _data = await (await fetch(`data/sites_popularity/${toDATE}.json`)).json()
                setPopularSites(_data)
            } catch(e) {
                console.log("could not load data at date", toDATE)
                setPopularSites([])
            }
            let yesterDATE = new Date(toDATE)
            yesterDATE.setDate(yesterDATE.getDate() - 1)
            yesterDATE = yesterDATE.toISOString().split("T")[0]
            try {
                setYesterdayPopularSites(await (await fetch(`data/sites_popularity/${yesterDATE}.json`)).json())
            } catch(e) {
                console.log("could not load yesterday data at date", yesterDATE, "trying default 2024-05-12")
                try {
                    setYesterdayPopularSites(await (await fetch(`data/sites_popularity/2024-05-12.json`)).json())
                } catch(e) {
                    console.log("could not load yesterday data at default date either")
                    setYesterdayPopularSites([])
                }
            }
        }
        fetchData()
    }, [toDATE])
    const yesterdayPopularSitesNames = yesterdayPopularSites.map(x => x.name)
    for (let i = 0; i < popularSites.length; i++) {
        const yesterdayIndex = yesterdayPopularSitesNames.indexOf(popularSites[i].name)
        popularSites[i].indexDiff = i - yesterdayIndex
    }
    return (
        <section className="section">
            <div className="container">
                <h1 className="title">
                    Vue par sites olympiques, le <DateSelector date={toDATE} setDate={setToDate} />
                </h1>
                {!popularSites.length ? <h2 className="subtitle">Données non disponibles à cette date</h2>
                : <div className="columns">
                    <div className="column">
                        <h2 className="subtitle">Sites les plus populaires</h2>
                        <div className="content">
                            <ol>
                                {popularSites.map(x => <li key={x.name}>
                                    {x.indexDiff == 0 ? <span className="tag position-tag is-warning">+0</span>
                                    : x.indexDiff > 0 ? <span className="tag position-tag is-danger">+{x.indexDiff}</span>
                                    : <span className="tag position-tag is-success">{x.indexDiff}</span>}
                                    <span><Link to={`/sites/${x.name}/?date=${toDATE}`}>{x.name}</Link>, {x.arrivals} arrivées sur le site, {x.departures} départs</span>
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
                }
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
    const [toDATE, setToDate] = React.useState("2024-08-11")
    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        Grands mouvements de population, le <DateSelector date={toDATE} setDate={setToDate}/>
                    </h1>
                    <p>
                        Zones affichées à partir de <b>{minCount}</b> voyages, changez ce filtre avec le sélecteur ci-dessous.
                    </p>
                    <div>
                        <input className="input" type="range" min="4" max="100" value={minCount} onChange={e => setMinCount(e.target.value)} />
                    </div>
                    <div className="columns">
                        <div className="column">
                            <h2 className="subtitle">Voyageurs quittant l'Île-de-france</h2>
                            <GeojsonMap geojsonURL={`data/exode/${toDATE}/exode.geojson`} geojsonURL2={`data/exode/${toDATE}/exode_lines.geojson`} minCount={minCount} opacity="0.2" zoomLevel="5"/>
                            <div className="row">
                                Légende: <span className="tag is-success">Train</span> <span className="tag is-warning">Voiture</span> <span className="tag is-danger">Avion</span> <span className="tag has-background-dark has-text-white">Inconnu</span>, Epaisseur du trait: nombre de voyages
                            </div>
                        </div>
                        <div className="column">
                            <h2 className="subtitle">Voyageurs arrivants en Île-de-france</h2>
                            <GeojsonMap geojsonURL={`data/exode/${toDATE}/inxode.geojson`} geojsonURL2={`data/exode/${toDATE}/inxode_lines.geojson`} minCount={minCount} opacity="0.2" zoomLevel="5"/>
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

const EMG_Compare = () => {
    const [data, setData] = React.useState(null)
    const [modalZones, setModalZones] = React.useState("paris_paris")
    const [multimodalChoice, setMultimodalChoice] = React.useState("rer")
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                let _data = await (await fetch(`/data/emg_compare.json`)).json()
                setData(await (await fetch(`/data/emg_compare.json`)).json())
            } catch (error) {
                console.log("data couldn't be fetched", error)
                setData(null)
            }
        }
        fetchData()
    }, [])
    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        Comparaison avec les déplacements franciliens habituels (<a href="https://www.institutparisregion.fr/mobilite-et-transports/deplacements/enquete-regionale-sur-la-mobilite-des-franciliens/" target="_blank">EMG 2023</a>)
                    </h1>
                    <article className="message is-info">
                        <div className="message-body content">
                            <p>Début avril 2024, l'Institut Paris Région a <a href="https://www.institutparisregion.fr/mobilite-et-transports/deplacements/enquete-regionale-sur-la-mobilite-des-franciliens/" target="_blank">publié les résultats de son Enquête Mobilité par GPS (EMG)</a> afin de diversifier la connaissance de la mobilité des Franciliens un an et demi après la fin de la pandémie de Covid-19. Elle complète la traditionnelle Enquête Globale Transport (EGT) menée par l’Autorité organisatrice de la mobilité, Île-de-France Mobilités et cofinancée par l'Etat.</p>
                            <p>Cette enquête permet de poser des bases de comparaisons pour les données récoltées pendant la période des jeux. Elle permet aussi d'isoler les biais dans nos données, et d'en questionner la qualité.</p>
                            <p>Cette page est donc différente des autres, avec la présence d'encarts explicatifs, comme celui-ci, pour caractériser les résultats et en tirer des apprentissages.</p>
                        </div>
                    </article>
                </div>
                <br/>
                {data && <div className="container">
                    <h2 className="subtitle">Nombre de déplacements par jour de la semaine</h2>
                    <article className="message is-small">
                        <div className="message-body content">
                            <p>Dans les deux cas, nous retrouvons une chute attendue du nombre de déplacements les weekends. </p>
                            <p>Pendant les JO, les déplacements sont mieux répartis sur la semaine, avec une augmentation significative le dimanche.</p>
                            <p>Le 3ème graphique nous donne un ordre de grandeur du nombre de voyages considérés pour nos résultats (plus de 750 000 réalisés par ~17 000 personnes).</p>
                        </div>
                    </article>
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG (millions)</h3>
                            <BarChart dataJson={data.nb_journey_days.emg.NbJourney} labelColorMap={daysColorMap} />
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG (%)</h3>
                            <PieChart dataJson={data.nb_journey_days.emg.percent} labelColorMap={daysColorMap} label="Pourcentage des déplacements"/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO</h3>
                            <BarChart dataJson={data.nb_journey_days.data.NbJourney} labelColorMap={daysColorMap}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO (%)</h3>
                            <PieChart dataJson={data.nb_journey_days.data.percent} labelColorMap={daysColorMap} label="Pourcentage des déplacements"/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.nb_journey_days.diff} labelColorMap={daysColorMap} label="diff %"/>
                        </div>
                    </div>

                    <h2 className="subtitle">Part des individus ne se déplaçant pas par jour de la semaine</h2>
                    <article className="message is-small">
                        <div className="message-body content">
                            <p>Même si les résultats sont similaires aux constats précédents, un premier biais existe : l'EMG cible les franciliens alors que nos données portent sur les déplacements en Île-de-France, qu'ils soient franciliens ou non.</p>
                            <p>Il faut donc faire des choix dans le comptage des individus, un utilisateur n'étant venu en Île-de-France qu'un weekend ne s'est techniquement pas déplacé en Île-de-France un mardi par exemple.</p>
                            <p>Pour éviter ces faux positifs, nous limitons la recherche aux individus avec au moins 7 jours de déplacements pendant les jeux. Ce choix augmente la probabilité que l'individu soit resté durant l'ensemble de la période.</p>
                        </div>
                    </article>
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG (%)</h3>
                            <BarChart dataJson={data.users_not_moving.emg.percent_users_not_moving} label="pourcent" labelColorMap={daysColorMap} maxAxisVal={50} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO (%)</h3>
                            <BarChart dataJson={data.users_not_moving.data.percent_users_not_moving} label="pourcent" labelColorMap={daysColorMap} maxAxisVal={50} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.users_not_moving.diff} labelColorMap={daysColorMap} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>

                    <h2 className="subtitle">Déplacements par heure de la journée</h2>
                    <article className="message is-small">
                        <div className="message-body content">
                            <p>Les enquêtes classiques, focalisées sur les déplacements réguliers, mettent en avant les trois pics d'activités: matin, midi et un étalement le soir.</p>
                            <p>Pendant les jeux, qui correspondent aussi aux congés d'été pour certains, ces pics sont moins prononcés, et les déplacements sont plus tardifs.</p>
                        </div>
                    </article>
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG (%)</h3>
                            <BarChart dataJson={data.nb_journey_hour.emg.percent} label="pourcent" maxAxisVal={16} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO (%)</h3>
                            <BarChart dataJson={data.nb_journey_hour.data.percent} label="pourcent" maxAxisVal={16} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.nb_journey_hour.diff} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>

                    <h2 className="subtitle">Grandes Moyennes</h2>
                    <article className="message is-small">
                        <div className="message-body content">
                            <p>Pour les mêmes raisons de déplacements moins réguliers, le nombre moyen de déplacements par jour diminue aussi pendant les jeux. Nous avons fait le choix de ne considérer que les jours avec au moins un déplacement.</p>
                            <p>La durée moyenne de déplacement réduit aussi. Notons que pour ces deux indicateurs, seuls les déplacements commençants et terminant en Île-de-France sont considérés. Il est possible que les enquêtes considèrent aussi les déplacements des franciliens hors Ile-de-France.</p>
                            <p>Le taux d'occupation des voitures met en avant un autre biais dans la source de nos données. L'application utilisée encourage fortement la pratique du covoiturage, résultant en un taux anormalement haut. Un constat à garder en tête lors de prochaines observation avec une part importante de déplacement en voiture.</p>
                        </div>
                    </article>
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG</h3>
                            <ul>
                                <li>Nombre moyen de déplacements par jour par personne <span className="tag is-info"><b>{data.nb_daily_journey_per_user.emg}</b></span></li>
                                <li>Durée moyenne de déplacement par personne par jour <span className="tag is-info"><b>{data.avg_daily_traveling_time.emg} minutes</b></span></li>
                                <li>Taux d'occupation des voitures <span className="tag is-info"><b>{data.occupancy.emg} personnes</b></span></li>
                            </ul>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO</h3>
                            <ul>
                                <li>Nombre moyen de déplacements par jour par personne <span className="tag is-info"><b>{data.nb_daily_journey_per_user.data.toFixed(2)}</b></span></li>
                                <li>Durée moyenne de déplacement par personne par jour <span className="tag is-info"><b>{data.avg_daily_traveling_time.data.toFixed(0)} minutes</b></span></li>
                                <li>Taux d'occupation des voitures <span className="tag is-info"><b>{data.occupancy.data.toFixed(2)} personnes</b></span></li>
                            </ul>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff</h3>
                            <ul>
                                <li>Nombre moyen de déplacements par jour par personne <span className="tag is-info"><b>{(data.nb_daily_journey_per_user.data - data.nb_daily_journey_per_user.emg).toFixed(2)}</b></span></li>
                                <li>Durée moyenne de déplacement par personne par jour <span className="tag is-info"><b>{(data.avg_daily_traveling_time.data - data.avg_daily_traveling_time.emg).toFixed(0)} minutes</b></span></li>
                                <li>Taux d'occupation des voitures <span className="tag is-info"><b>+{(data.occupancy.data - data.occupancy.emg).toFixed(2)} personnes</b></span></li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="subtitle">Part modales</h2>
                    <article className="message is-small">
                        <div className="message-body content">
                            <p>À l'exception des trajets en grande couronne, ou les petits trajets à pied sont peut-être ignorés dans les enquêtes, la part modale de la voiture est toujours supérieure dans nos données JO.</p>
                            <p>Ce constat, combiné au très faible taux de déplacement en bus, laisse supposer un problème de détection du mode de déplacement, entre bus et voiture. Avec une partie des trajets voiture qui devraient se retrouver dans la part transport en commun</p>
                            <p>Dans <a href="https://www.6-t.co/etudes/comment-les-parisien-ne-s-et-les-petit-e-s-couronnais-es-adopteront-leur-mobilite-pendant-les-jeux-olympiques-paris-2024" target="_blank">son étude, le bureau de recherche 6t</a> prédisait une réduction des déplacements en voiture et transports à Paris pendant les jeux, au profit de la mobilité douce.</p>
                            <p>Lorsqu'elles sont comparées à l'EMG, nos données semblent indiquer le contraire. Mais en observant les différences de comportement entre les mêmes utilisateurs en mai 2024 et durant les jeux (échantillon: ~650 personnes), nous observons:</p>
                            <ul>
                                <li>Une augmentation de 11% des déplacements à vélo (plus ou moins conforme à la prédiction 6t).</li>
                                <li>Une diminution de 18% des déplacements en bus (conforme à la prédiction 6t).</li>
                                <li>Des taux de déplacements similaires sur les autres modes (le taux de marche n'a donc pas augmenté pendant les jeux, contrairement à la prédiction 6t, de même pour l'utilisation de la voiture, qui n'a pas diminué).</li>
                            </ul>
                            <p>Cela confirme en conséquence un biais dans les données, avec une surreprésentation de la voiture comparé aux autres modes. Cela encourage aussi les comparaisons entre périodes avec la même source, plutôt qu'entre des sources différentes.</p>
                        </div>
                    </article>
                    <div className="buttons has-addons">
                        <button onClick={_ => setModalZones("paris_paris")} className={`button ${modalZones == "paris_paris" ? "is-info is-selected" : ""}`}>{"Paris <-> Paris"}</button>
                        <button onClick={_ => setModalZones("paris_idf_pc")} className={`button ${modalZones == "paris_idf_pc" ? "is-info is-selected" : ""}`}>{"Paris <-> Petite Couronne"}</button>
                        <button onClick={_ => setModalZones("paris_idf_gc")} className={`button ${modalZones == "paris_idf_gc" ? "is-info is-selected" : ""}`}>{"Paris <-> Grande Couronne"}</button>
                        <button onClick={_ => setModalZones("idf_idf_gc")} className={`button ${modalZones == "idf_idf_gc" ? "is-info is-selected" : ""}`}>{"Grande Couronne <-> Grande Couronne"}</button>
                        <button onClick={_ => setModalZones("idf_idf_pc")} className={`button ${modalZones == "idf_idf_pc" ? "is-info is-selected" : ""}`}>{"Petite Couronne <-> Petite Couronne"}</button>
                    </div>
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">{"EMG (%)"}</h3>
                            <PieChart dataJson={data.modal_shares.emg[modalZones].percent} labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">{"JO (%)"}</h3>
                            <PieChart dataJson={data.modal_shares.data[modalZones].percent} labelColorMap={transportModeColorMap}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.modal_shares.diff[modalZones]} labelColorMap={transportModeColorMap} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>
                                        
                    <h2 className="subtitle">Durée moyenne des deplacements par mode</h2>
                    <article className="message is-small">
                        <div className="message-body content">
                            <p>Ici, les résultats diffèrent grandement car les enquêtes mesurent le budget-temps journalier moyen par mode de transport, alors que nos données illustrent le temps de trajet moyen par mode. La mesure en budget-temps est un indicateur qui se valorise mieux sur les trajets réguliers du quotidien, il a moins d'intérêt sur les périodes exceptionnelles.</p>
                            <p>Il n'est pas clair si dans l'EMG, seules les journées où le mode est utilisé sont comptabilisés. Par exemple, une personne prenant le bus une heure, un jour sur deux, a-t-elle un budget-temps d'une heure, ou de 30 minutes ?</p>
                            <p>De plus, tous les trajets étant par nature multimodaux (avec la marche en début et fin), il n'est pas clair si l'EMG compte la durée porte-à-porte, ou le temps exact passé dans le transport. Nous affichons la différence à titre d'exemple sur nos données.</p>
                            <p>Ces questions rendent la comparaison difficile. Les seuls constats exploitables résident dans la comparaison entre les modes, avec un temps de marche plus long pendant les jeux que le vélo ou la voiture, ce qui contraire à l'habituel.</p>
                        </div>
                    </article>
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG (minutes)</h3>
                            <BarChart dataJson={data.avg_duration_per_mode.emg.duration} labelColorMap={transportModeColorMap} label="minutes" maxAxisVal={60}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO trajet complet (minutes)</h3>
                            <BarChart dataJson={data.avg_duration_per_mode.data.full_journey.journey_duration} labelColorMap={transportModeColorMap} label="minutes" maxAxisVal={60}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO mode de transport uniquement (minutes)</h3>
                            <BarChart dataJson={data.avg_duration_per_mode.data.mode_only.duration} labelColorMap={transportModeColorMap} label="minutes" maxAxisVal={60}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.avg_duration_per_mode.diff.duration} labelColorMap={transportModeColorMap} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>

                    <h2 className="subtitle">Multimodalité des trajets avec du train</h2>
                    <article className="message is-small">
                        <div className="message-body content">
                            <p>Ce dernier indicateur questionne les différents modes utilisés par les franciliens lors de leurs déplacements en train. La marche n'étant pas considérée comme un mode à part entière dans les résultats d'enquête, nous l'ignorons aussi dans les résultats ci-dessous.</p>
                            <p>Pour que cet indicateur ait de la valeur, les données sources doivent pouvoir différencier entre les différents modes eérrés (métro, tram, train). Cette différenciation est complexe avec des données GPS, rendant les comparaisons difficiles avec l'EMG.</p>
                            <p>Ces indicateurs mettent à nouveau en avant la sous-représentation des trajets en bus dans nos données. En particulier la confusion de ces derniers avec la voiture. En effet, dans l'EMG, les trajets avec une composante train comprennent 10x plus de trajets avec une part bus que de voiture. Nos données indiquent 20x plus de part voiture que bus.</p>
                            <p>Une telle différence empêche de tirer une quelconque observation.</p>
                        </div>
                    </article>
                    <div className="buttons has-addons">
                        <button onClick={_ => setMultimodalChoice("rer")} className={`button ${multimodalChoice == "rer" ? "is-info is-selected" : ""}`}>RER/Train</button>
                        <button onClick={_ => setMultimodalChoice("metro")} className={`button ${multimodalChoice == "metro" ? "is-info is-selected" : ""}`}>Metro</button>
                    </div>
                    {multimodalChoice == "rer" ? <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG Nombre de modes utilisés lors des trajets avec du RER/Train (%)</h3>
                            <PieChart dataJson={data.multimodal_train_trips.emg.nb_unique_modes_rer.percent} label="Pourcentage des trajets"/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO Nombre de modes utilisés lors des trajets ferrés (%)</h3>
                            <PieChart dataJson={data.multimodal_train_trips.data.nb_unique_modes.percent} label="Pourcentage des trajets"/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.diff.nb_unique_modes_rer} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>
                    :
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG Nombre de modes utilisés lors des trajets avec du Metro (%)</h3>
                            <PieChart dataJson={data.multimodal_train_trips.emg.nb_unique_modes_metro.percent} label="Pourcentage des trajets"/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO Nombre de modes utilisés lors des trajets ferrés (%)</h3>
                            <PieChart dataJson={data.multimodal_train_trips.data.nb_unique_modes.percent} label="Pourcentage des trajets"/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.diff.nb_unique_modes_metro} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>
                    }

                    {multimodalChoice == "rer" ? <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG Parts des modes utilisés lors des trajets avec du RER/Train (%)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.emg.nb_journey_per_modes_rer.percent} labelColorMap={transportModeColorMap} label="part modale" maxAxisVal={100} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO Parts des modes utilisés lors des trajets avec du train (%)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.data.nb_journey_per_modes.percent} labelColorMap={transportModeColorMap} label="part modale" maxAxisVal={100} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.diff.nb_journey_per_modes_rer} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>
                    :
                    <div className="columns">
                        <div className="column content">
                            <h3 className="subtitle is-6">EMG Parts des modes utilisés lors des trajets avec du Metro (%)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.emg.nb_journey_per_modes_metro.percent} labelColorMap={transportModeColorMap} label="part modale" maxAxisVal={100} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">JO Parts des modes utilisés lors des trajets avec du train (%)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.data.nb_journey_per_modes.percent} labelColorMap={transportModeColorMap} label="part modale" maxAxisVal={100} reverseAxis={false}/>
                        </div>
                        <div className="column content">
                            <h3 className="subtitle is-6">Diff (points)</h3>
                            <BarChart dataJson={data.multimodal_train_trips.diff.nb_journey_per_modes_metro} label="diff %" reverseAxis={false}/>
                        </div>
                    </div>
                    }
                    
                </div>}
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
                            <Link to="/emg_compare"><button className="button is-primary">Comparaison enquête mobilité</button></Link>
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
                for (const _zone of ["all", "red_zone", "black_zone"]) {
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
                                {/* {data && data[zone] && <li>Comparée à un vendredi classique, la quantité de déplacements a évolué de {evolution >= 0 ? <span className="tag is-success"><b>+{evolution}%</b></span> : <span className="tag is-danger"><b>{evolution}%</b></span>}</li>} */}
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
                            <li>18h30: les visiteurs sont arrivés dans les zones et patientent dans les files d'attente</li>
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
                <Route path="/emg_compare">
                    <EMG_Compare />
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

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)
root.render(<App />)