
// function to diplay map of a place based on the lon and lat data
function showMap(lon, lat) {

    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: 10,
            maxZoom: 15,
            minZoom:7,
        })
    });
}

// function to show current weather and 5 day forecast of the searched city
function showWeather(lat, lon){
    let key = "d19a427e084cc28ea7bccbc2e7e39e2c";
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&" +"lon=" + lon + "&units=metric&appid=" + key;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        $('#weather').empty();
        $('#today').empty();
        $('#forecast').empty();

        // Display current weather's temp, wind and humidity
        const todayCardDiv = $('<div>').addClass('card col-10 col-md-5 m-2 text-white bg-primary text-center py-2');
        let todayDate = moment().format("DD/MM/YYYY");
        let todayIcon = response.list[0].weather[0].icon;
        let todayIconUrl = 'https://openweathermap.org/img/wn/' + todayIcon + '.png';
        const dateEl = $('<h5>').text(todayDate);
        const iconEl = $('<img>').attr('src', todayIconUrl).addClass('weatherIcon');
        const tempDiv = $('<p>').text(" Temp: " + response.list[0].main.temp + " °C");
        const windDiv = $('<p>').text(" Wind: " + response.list[0].wind.speed + " KPH");
        const humidityDiv = $('<p>').text(" Humidity: " + response.list[0].main.humidity + " %");
        todayCardDiv.append(dateEl, iconEl, tempDiv, windDiv, humidityDiv);
        $('#weather').append(todayCardDiv)

        // $('#today').text('(' +dateEl+ ')');
        // $('#today').append(tempDiv,windDiv, humidityDiv);

        let date= response.list[0].dt;
        let dateToday= moment.unix(date).format("DD/MM/YYYY");

            for (let i = 1; i < 40; i++) {
                let date = response.list[i].dt;
                dateNext = moment.unix(date).format("DD/MM/YYYY");

                if(dateToday !== dateNext){
                    dateToday = dateNext;
                    let temp = response.list[i].main.temp;
                    let wind = response.list[i].wind.speed;
                    let humidity = response.list[i].main.humidity;
                    let icon = response.list[i].weather[0].icon;
                    let iconUrl = 'https://openweathermap.org/img/wn/' + icon + '.png';
                
                    //Create cards for each day
                    const cardsDiv = $('<div>').addClass('card col-10 col-md-5 m-2 text-white bg-info text-center py-2');
                    const dateEl = $('<h5>').text(dateToday);
                    const iconEl = $('<img>').attr('src', iconUrl).addClass('weatherIcon');
                    const tempEl = $('<p>').text('Temp: ' + temp + ' °C');
                    const windEl = $('<p>').text('Wind: ' + wind + ' KPH');
                    const humidityEl = $('<p>').text('Humidity: ' + humidity + '%');
                    cardsDiv.append(dateEl, iconEl, tempEl, windEl, humidityEl);
                    $('#weather').append(cardsDiv);

                }
            } 
    }) 
} 

// function to show the description of the searched city
function showDescription(cityName){
    let queryURL = 'https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=';
    queryURL += cityName;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response) {
        let pageID = Object.keys(response.query.pages)[0] ;
        // wikipedia description. ps: use pages[pageID] other than pages.pageID
        console.log(response.query.pages[pageID].extract);
        $('#description').empty();
        $('#placeName').text(response.query.pages[pageID].title);
        const descriptionEl = $('<p>').text(response.query.pages[pageID].extract).addClass('description');
        $('#description').append(descriptionEl);
    })
}

// function to show the informations of the searched city
function showInfo(placeName) {
    let lonData, latData;
    let queryURL = 'https://api.opencagedata.com/geocode/v1/json?&key=d29f7107b3d343c7b01affdd5a6ed6c4&q=' + placeName;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response){
        lonData = response.results[0].geometry.lng;
        latData = response.results[0].geometry.lat;
        // console.log(lonData + '  ' + latData);
    })
    .then(function(){
        showDescription(placeName);
        showMap(lonData, latData);
        showWeather(latData, lonData);
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

        

        const currencyDiv = $('<ol>').appendTo($('#currency-container'));
        currencyDiv.addClass('row container justify-content-between text-center m-0');
        const GBPEl = $('<li>').text('GPB/USD: ' + GBPCurrency).addClass('col-sm-5 col-lg-2 p-0');
        const EUREl = $('<li>').text('EUR/USD: ' + EURCurrency).addClass('col-sm-5 col-lg-2 p-0');
        const JPYEl = $('<li>').text('JPY/USD: ' + JPYCurrency).addClass('col-sm-5 col-lg-2 p-0');
        const CHFEl = $('<li>').text('CHF/USD: ' + CHFCurrency).addClass('col-sm-5 col-lg-2 p-0');
        const CADEl = $('<li>').text('CAD/USD: ' + CADCurrency).addClass('col-sm-5 col-lg-2 p-0');


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
            showInfo(cityName);
            $('#search').val('');
        }
        
    })
});


