const { useEffect, useRef, useState } = React;

const GeojsonMap = ({ geojsonURL, computeMax }) => {
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
            const initializedMap = L.map(mapContainerRef.current, { preferCanvas: true }).setView([48.866667, 2.333333], 11);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
                attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }).addTo(initializedMap);
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