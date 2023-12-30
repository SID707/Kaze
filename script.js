const cityInput = document.querySelector(".cityinput");
const searchButton = document.querySelector(".search");
const locationButton = document.querySelector(".location")
const currentWeatherDiv = document.querySelector(".currentweather");
const weatherCardsDiv = document.querySelector(".weathercards");



const api_key = "85456b0352e5ed8930de440e6004b328";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // for main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} km/h</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon" width="100" height="auto">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else { //for other 5 weather cards
        return `<li class="cards">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon" width="70" height="auto">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <br>
                <h4>Wind: ${weatherItem.wind.speed} km/h</h4>
                <br>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }

    
}


const getDetails = (cityName, lat, lon) => {
    const weather_api_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

    fetch(weather_api_url).then(res => res.json()).then(data => {
        
        //filtering the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        //clearing previous weather cards
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        

        //creating weather cards and adding them to the DOM

        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            
            
        });


    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    }) 
}

const getCoordinates = () => {
    const cityName= cityInput.value.trim();
    if(!cityName) return;

    const geocoding_api_url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${api_key}`; 

    fetch(geocoding_api_url).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for $(cityName)`);
        const { name, lat, lon} = data[0];
        getDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!");
    }) 
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const reverse_geocoding_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
            
            //get city name from coordinates using reverse geocoding api
            fetch(reverse_geocoding_url).then(res => res.json()).then(data => {
                const { name } = data[0];
                getDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occured while fetching the city!");
            }) 
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            }
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCoordinates());

