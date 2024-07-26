const { useEffect, useRef, useState } = React;
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

const GeojsonMap = ({ geojsonURL, geojsonURL2, minCount, opacity = 1, zoomLevel = 11, forceHeight, forceColor }) => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.count) {
            return layer.bindPopup(feature.properties.count + " passages par jour");
        }
        if (feature.properties && feature.properties.trace_gps) {
            return layer.bindPopup(feature.properties.trace_gps + " trajets");
        }
        if (feature.properties && feature.properties.Count && feature.properties.MostCommonTransport) {
            return layer.bindPopup(
                `
                Nombre voyages: ${feature.properties.Count}<br/>
                Mode favori: ${transportModeEmoji[feature.properties.MostCommonTransport]}<br/>
                `
            )
        }
        if (feature.properties && feature.properties.percent) {
            return layer.bindPopup(`Pourcentage de trajets non-motorisés: ${feature.properties.percent.toFixed(0)}%`)
        }
        if (feature.properties && feature.properties.Count) {
            return layer.bindPopup(`Nombre voyages: ${feature.properties.Count}`)
        }
        if (feature.properties && feature.properties.modal_share_percent_diff) {
            return layer.bindPopup(`Evolution de la part des trajets non-motorisés: ${feature.properties.modal_share_percent_diff.toFixed(0)}%`)
        }
        if (feature.properties) {
            layer.bindPopup(JSON.stringify(feature.properties));
        }
    }

    useEffect(() => {
        if (!map) {
            const sombre = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
                attribution:'Données: Moovance, Fond de carte: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
            })
            const clair = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Données: Moovance, Fond de carte: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
            const baseMaps = {
                "Sombre": sombre,
                "Clair": clair
            }
            let default_basemap = clair
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                default_basemap = sombre
            }
            const initializedMap = L.map(mapContainerRef.current, { preferCanvas: true, layers: [default_basemap] }).setView([48.866667, 2.333333], zoomLevel);
            const layerControl = L.control.layers(baseMaps).addTo(initializedMap)
            initializedMap._layerControl = layerControl
            setMap(initializedMap);
        }

        return () => {
            if (map) {
                map.remove();
                setMap(null);
            }
        };
    }, []);

    useEffect(() => {
        const fetchDataAndAddToMap = async () => {
            if (map) {
                const geojsonFeature = await (await fetch(geojsonURL)).json();
                let _geojsonData = geojsonFeature
                if (minCount) {
                    _geojsonData = {
                        ...geojsonFeature,
                        features: geojsonFeature.features.filter(x => x.properties.Count >= minCount)
                    }
                }
                const firstContent = L.geoJSON(_geojsonData, {
                    style: f => { return { color: f.properties.stroke || f.properties.fill || f.properties.color || forceColor, fillColor: f.properties.fill || f.properties.color || forceColor, opacity: opacity}; },
                    onEachFeature: onEachFeature
                }).addTo(map)
                // var firstgroup = L.layerGroup([firstContent]).addTo(map)
                map._layerControl.addOverlay(firstContent, "Zones")
                map.firstgroup = firstContent
                if (geojsonURL2) {
                    const geojsonFeature2 = await (await fetch(geojsonURL2)).json();
                    let _geojsonData = geojsonFeature2
                    if (minCount) {
                        _geojsonData = {
                            ...geojsonFeature2,
                            features: geojsonFeature2.features.filter(x => x.properties.Count >= minCount)
                        }
                    }
                    const secondContent = L.geoJSON(_geojsonData, {
                        style: f => { return { weight: f.properties.Count/10, color: f.properties.stroke || f.properties.fill || f.properties.color, fillColor: f.properties.fill || f.properties.color}; },
                        onEachFeature: onEachFeature
                    }).addTo(map)
                    // var secondgroup = L.layerGroup([secondContent]).addTo(map)
                    map._layerControl.addOverlay(secondContent, "Lignes")
                    map.secondgroup = secondContent
                }
            }
        };

        fetchDataAndAddToMap();

        return () => {
            // Clear the map of geoJSON layers before adding new ones
            if (map) {
                map._layerControl.removeLayer(map.firstgroup)
                if (map.secondgroup)
                    map._layerControl.removeLayer(map.secondgroup)
                map.eachLayer(layer => {
                    if (layer instanceof L.GeoJSON) {
                        map.removeLayer(layer);
                    }
                });
            }
        };
    }, [geojsonURL, map, minCount]);

    return (
        <div>
            {forceHeight ? <div ref={mapContainerRef} id="map" style={{height: forceHeight}}></div> : <div ref={mapContainerRef} id="map"></div>}
        </div>
    );
};