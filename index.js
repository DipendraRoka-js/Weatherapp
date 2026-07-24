const apiKey = "72fdadc73ee2a446319328bdd9710115";

const cityInput = document.querySelector(".js-city-input");
const searchBtn = document.querySelector(".js-search-btn");

const cityName = document.querySelector(".js-city-name");
const weatherIcon = document.querySelector(".js-weather-icon");
const temperature = document.querySelector(".js-temperature");
const weatherCondition = document.querySelector(".js-weather-condition");
const humidity = document.querySelector(".js-humidity");
const windSpeed = document.querySelector(".js-wind-speed");
const feelsLike = document.querySelector(".js-feels-like");
const pressure = document.querySelector(".js-pressure");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  getWeather(city);
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found.");
    }

    const data = await response.json();

    // Update city name
    cityName.textContent = data.name;

    // Update temperature
    temperature.textContent = `${Math.round(data.main.temp)}°C`;

    // Update weather condition
    weatherCondition.textContent = data.weather[0].description;

    // Update humidity
    humidity.textContent = `${data.main.humidity}%`;

    // Update wind speed
    windSpeed.textContent = `${data.wind.speed} km/h`;

    // Update feels like
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    // Update pressure
    pressure.textContent = `${data.main.pressure} hPa`;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  } catch (error) {
    alert(error.message);
  }
}


/*
const apiKey = "YOUR_API_KEY";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;

    if(city === ""){
        alert("Enter a city");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if(!response.ok){
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {

            weatherDiv.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                <h3>${data.main.temp} °C</h3>
                <p>${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind: ${data.wind.speed} m/s</p>
            `;
        })
        .catch(error => {
            weatherDiv.innerHTML = `<p>${error.message}</p>`;
        });
});
*/