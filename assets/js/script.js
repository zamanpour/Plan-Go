

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
        
        let GBPCurrency = (response.rates.USD/response.rates.GBP).toFixed(3);
        let EURCurrency = (response.rates.USD/response.rates.EUR).toFixed(3);
        let JPYCurrency = (response.rates.USD/response.rates.JPY).toFixed(3);
        let CHFCurrency = (response.rates.USD/response.rates.CHF).toFixed(3);
        let CADCurrency = (response.rates.USD/response.rates.CAD).toFixed(3);

        

        const currencyDiv = $('<ul>').appendTo($('#currency-container'));
        const GBPEl = $('<li>').text('GPB/USD: ' + GBPCurrency);
        const EUREl = $('<li>').text('EUR/USD: ' + EURCurrency);
        const JPYEl = $('<li>').text('JPY/USD: ' + JPYCurrency);
        const CHFEl = $('<li>').text('CHF/USD: ' + CHFCurrency);
        const CADEl = $('<li>').text('CAD/USD: ' + CADCurrency);


        currencyDiv.append(GBPEl, EUREl, JPYEl, CHFEl, CADEl);

    })
}


// The page can only be manipulated until the document is 'reday'.
$(document).ready(function(){
    showCurrency();

    $('#search-form').on('click', 'button', function(event) {
        // Prevent the refresh when hit the 'search' button.
        event.preventDefault();
        // console.log('The button was clicked');

        // Get the city name from the input element
        let cityName = $('#search').val().trim()
        // console.log(typeof(cityName));

        if(cityName != '') {
            $('#map').empty();
            showMap(cityName);
        }
        
    })
});


