let allData;
let cityName;
let cityLocation ;
let todayInfo = document.querySelector(".today-info");
let todayWeather = document.querySelector(".today-weather");
let dayInfo = document.querySelector(".day-info");
let searchInput = document.querySelector("input");
let daysList = document.querySelector(".days-list");


function displayData() {

    let dayDateStringFromAPI = allData.location.localtime;
    let apiDayDate = new Date(dayDateStringFromAPI);
    let dayName = apiDayDate.toLocaleDateString('en-US', { weekday: 'long' });

   
    todayInfo.innerHTML = `
            <h2>${dayName}</h2>
            <span>${allData.location.localtime}</span>
            <div>
                <i class="fa-solid fa-location-crosshairs"></i>
                <span>${ allData.location.region},${ allData.location.country}</span>
            </div>
    `

    todayWeather.innerHTML =  `
            <img class="icon" src="${allData.current.condition.icon.split("/").splice(3,8).join("/")}" alt="">
            <h1 class="weather-temp">${allData.current.temp_c}°C</h1>
            <h3>${allData.current.condition.text}</h3>
        `

    dayInfo.innerHTML =  `
            <div>
                <span class="title">PRECIPITATION</span>
                <span class="value">${allData.current.precip_mm} %</span>
            </div>

            <div>
                <span class="title">HUMIDITY</span>
                <span class="value">${allData.current.humidity} %</span>
            </div>

            <div>
                <span class="title">WIND SPEED</span>
                <span class="value">${allData.current.wind_kph} km/h</span>
            </div>
    `

    let listBox = ``;
    for (let index = 1; index < 5; index++) {
    let arrayDaysDateStringFromAPI = allData.forecast.forecastday[index].date;
    let apiArrayDayDate = new Date(arrayDaysDateStringFromAPI);
    let arrayDayName = apiArrayDayDate.toLocaleDateString('en-US', { weekday: 'long' });
        console.log(arrayDaysDateStringFromAPI);
        listBox += `
        <li>
        <img class="icon" src="${allData.forecast.forecastday[index].day.condition.icon.split("/").splice(3,8).join("/")}" alt="">
        <span>${arrayDayName}</span>
        <span class="day-temp">${allData.forecast.forecastday[index].day.mintemp_c}°C</span>
    </li>
        `;
        
    }
    
    daysList.innerHTML = listBox;

}


async function fetchData() {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6e317837a03f434fa55235550233012&q=${cityLocation}&days=7`)
    let responseData = await response.json()
    allData = responseData;
    displayData();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    cityLocation = `${latitude},${longitude}`;
    fetchData();
}

searchInput.addEventListener('keyup',async function(e){
    cityName = searchInput.value;
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6e317837a03f434fa55235550233012&q=${cityName}&days=7`)
    let responseData = await response.json()
    allData = responseData;
    displayData();
})

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

getLocation();

