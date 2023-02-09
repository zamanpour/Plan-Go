function displayPlace(lon, lat) {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: 10
        })
    });
}

displayPlace(0.1276,51.5072) // london 
displayPlace(2.3522, 48.8566) // paris