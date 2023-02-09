

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


function showMap(placeName) {
    var lonData, latData;
    let queryURL = 'https://api.opencagedata.com/geocode/v1/json?&key=d29f7107b3d343c7b01affdd5a6ed6c4&q=' + placeName;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response){
        lonData = response.results[0].geometry.lng;
        latData = response.results[0].geometry.lat;
        console.log(lonData + '  ' + latData);
    })
    .then(function(){
        displayPlace(lonData, latData);
    })
}


// function to show the several main currencies 
function showCurrency() {
    let queryURL = 'https://api.exchangerate.host/latest';
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response){
        console.log(response);
    })
}



