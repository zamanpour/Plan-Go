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
            minZoom: 7,
        })
    });
}

// Show date before currency
const showDate = moment().format("DD/MM/YYYY");
const showDateEl = $('<h6>').text(showDate)
$('#show-date').prepend(showDateEl);

// function to show current weather and 5 day forecast of the searched city
function showWeather(lat, lon) {
    let key = "d19a427e084cc28ea7bccbc2e7e39e2c";
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&" + "lon=" + lon + "&units=metric&appid=" + key;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
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
        const tempDiv = $('<p>').text(" Temp: " + response.list[0].main.temp.toFixed(0) + " °C");
        const windDiv = $('<p>').text(" Wind: " + response.list[0].wind.speed + " KPH");
        const humidityDiv = $('<p>').text(" Humidity: " + response.list[0].main.humidity + " %");
        todayCardDiv.append(dateEl, iconEl, tempDiv, windDiv, humidityDiv);
        $('#weather').append(todayCardDiv);

        let date = response.list[0].dt;
        let dateToday = moment.unix(date).format("DD/MM/YYYY");

        for (let i = 1; i < 40; i++) {
            let date = response.list[i].dt;
            dateNext = moment.unix(date).format("DD/MM/YYYY");

            if (dateToday !== dateNext) {
                dateToday = dateNext;
                let temp = response.list[i].main.temp.toFixed(0);
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

// function to record the search history
function recordSearch(response) {
    // console.log('This is the function to record the search history.');
    let cityArr = JSON.parse(localStorage.getItem('cityHistory'));
    let pageID = Object.keys(response.query.pages)[0];
    let searchName = response.query.pages[pageID].title;

    if (cityArr === null) {
        cityArr = [];
        cityArr.unshift(searchName);
        localStorage.setItem('cityHistory', JSON.stringify(cityArr));
        // console.log('No search history.');
        const historyEl = $('<button>').text(searchName);
        historyEl.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
        $('#searchHistory').prepend(historyEl);

    } else if (cityArr.includes(searchName)) {
        console.log(('This city is in the search history'));
    } else {
        console.log(('This is a new city'));
        cityArr.unshift(searchName);
        localStorage.setItem('cityHistory', JSON.stringify(cityArr));
        const historyEl = $('<button>').text(searchName);
        historyEl.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
        $('#searchHistory').prepend(historyEl);
    }
}

// function to show the description of the searched city
function showDescription(cityName) {
    let queryURL = 'https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=';
    queryURL += cityName;
    // console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
        .then(function (response) {
            let pageID = Object.keys(response.query.pages)[0];
            // wikipedia description. ps: use pages[pageID] other than pages.pageID
            // console.log(response.query.pages[pageID].extract);
            $('#description').empty();
            $('#placeName').text(response.query.pages[pageID].title);
            const descriptionEl = $('<p>').text(response.query.pages[pageID].extract).addClass('description');
            $('#description').append(descriptionEl);
            recordSearch(response);
        })
}
var invalidSearch = false;
// function to show the informations of the searched city
function showInfo(placeName) {

    let lonData, latData;
    let queryURL = 'https://api.opencagedata.com/geocode/v1/json?&key=d29f7107b3d343c7b01affdd5a6ed6c4&q=' + placeName;
    // console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
        .then(function (response) {
            lonData = response.results[0].geometry.lng;
            latData = response.results[0].geometry.lat;
            console.log(lonData + '  ' + latData);
        })
        .then(function () {
            showMap(lonData, latData);
            showWeather(latData, lonData);
            showDescription(placeName);
            showNews(placeName);
        }).fail(function () {
            invalidSearch = true;
            $('#errorModal').modal('show')
            return false;
        });
    if (!invalidSearch) {

    }

}

//function show related news
function updatePage(NYTData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = 5;

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
        // Get specific article info for current index
        var article = NYTData.response.docs[i];

        // Increase the articleCount (track article # - starting at 1)
        var articleCount = i + 1;

        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#news").append($articleList);

        // If the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
            //console.log(headline.main);
            $articleListItem.append(
                "<a href='" + article.web_url + "' target='_blank'><h2> " +
                headline.main +
                "</h2></a>"
            );
        }

        // Log section, and append to document if exists
        var section = article.section_name;
        //console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h3>Section: " + section + "</h3>");
        }

        // Log published date, and append to document if exists
        var pubDate = article.pub_date;

        console.log(moment(pubDate).format('DD/MM/YYYY, HH:MM A'));
        //console.log(article.pub_date);
        if (pubDate) {
            $articleListItem.append("<h4>Publication Time: " + moment(pubDate).format('DD/MM/YYYY, HH:MM A') + "</h4>");
        }


        // Append the article
        $articleList.append($articleListItem);
    }
}


function showNews(placeName) {

    // Empty the region associated with the articles
    $("#news").empty();

    // Query URL for the ajax request to the NYT API
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M&q=" + placeName;

    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
}


// function to initialize the webpage
function initPage() {
    let cityArr = JSON.parse(localStorage.getItem('cityHistory'));
    // console.log(cityArr);
    if (cityArr != null) {
        // console.log('City array is not empty');
        cityArr.forEach(cityName => {
            const historyEl = $('<button>').text(cityName);
            historyEl.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
            $('#searchHistory').append(historyEl);
        })
        // show the latest search result
        showInfo(cityArr[0]);
    }
}


// function to show the several main currencies 
function showCurrency() {
    let queryURL = 'https://api.exchangerate.host/latest';
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
        .then(function (response) {

            let GBPCurrency = (response.rates.USD / response.rates.GBP).toFixed(3);
            let EURCurrency = (response.rates.USD / response.rates.EUR).toFixed(3);
            let JPYCurrency = (response.rates.USD / response.rates.JPY).toFixed(3);
            let CHFCurrency = (response.rates.USD / response.rates.CHF).toFixed(3);
            let CADCurrency = (response.rates.USD / response.rates.CAD).toFixed(3);



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
$(document).ready(function () {
    // initialize the webpage when it's loaded
    initPage();

    showCurrency();

    // event listener for the search form 
    $('#search-form').on('click', 'button', function (event) {
        // Prevent the refresh when hit the 'search' button.
        event.preventDefault();
        // console.log('The button was clicked');

        // Get the city name from the input element
        let cityName = $('#search').val().trim()
        // console.log(typeof(cityName));

        if (cityName != '') {
            $('#map').empty();
            showInfo(cityName);
            $('#search').val('');
        }
    })

    // event listener for the history buttons

    $('#searchHistory').on('click', 'button', function (event) {
        event.preventDefault();
        // console.log(event.target.innerText);
        cityName = event.target.innerText.trim();


        $('#map').empty();
        showInfo(cityName);
        $('#search').val('');
    })

});


