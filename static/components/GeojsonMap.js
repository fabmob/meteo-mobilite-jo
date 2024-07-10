const { useEffect, useRef, useState } = React;

const GeojsonMap = ({ geojsonURL, geojsonURL2 }) => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.count) {
            return layer.bindPopup(feature.properties.count + " passages par jour");
        }
        if (feature.properties && feature.properties.trace_gps) {
            return layer.bindPopup(feature.properties.trace_gps + " trajets");
        }
        if (feature.properties) {
            layer.bindPopup(JSON.stringify(feature.properties));
        }
    }

    useEffect(() => {
        if (!map) {
            const sombre = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
                attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
            })
            const clair = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
            const baseMaps = {
                "Sombre": sombre,
                "Clair": clair
            }
            let default_basemap = clair
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                default_basemap = sombre
            }
            const initializedMap = L.map(mapContainerRef.current, { preferCanvas: true, layers: [default_basemap] }).setView([48.866667, 2.333333], 11);
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
                L.geoJSON(geojsonFeature, {
                    style: f => { return { color: f.properties.stroke || f.properties.fill || f.properties.color, fillColor: f.properties.fill || f.properties.color}; },
                    onEachFeature: onEachFeature
                }).addTo(map);
                if (geojsonURL2) {
                    const geojsonFeature2 = await (await fetch(geojsonURL2)).json();
                    const content = L.geoJSON(geojsonFeature2, {
                        style: f => { return { weight: f.properties.Count/10, color: f.properties.stroke || f.properties.fill || f.properties.color, fillColor: f.properties.fill || f.properties.color}; },
                        onEachFeature: onEachFeature
                    })
                    var lgroup = L.layerGroup([content]);
                    map._layerControl.addOverlay(lgroup, "Lignes")
                }
            }
        };

        fetchDataAndAddToMap();

        return () => {
            // Clear the map of geoJSON layers before adding new ones
            if (map) {
                map.eachLayer(layer => {
                    if (layer instanceof L.GeoJSON) {
                        map.removeLayer(layer);
                    }
                });
            }
        };
    }, [geojsonURL, map]);

    return (
        <div>
            <div ref={mapContainerRef} id="map"></div>
        </div>
    );
};