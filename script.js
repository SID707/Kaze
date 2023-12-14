const cityInput = document.querySelector(".cityinput");
const searchButton = document.querySelector(".search");

const api_key = "85456b0352e5ed8930de440e6004b328";

const getDetails = (cityName, lat, lon) => {
    const weather_api_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

    fetch(weather_api_url).then(res => res.json()).then(data => {
        console.log(data);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!");
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

searchButton.addEventListener("click", getCoordinates);