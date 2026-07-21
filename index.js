const apiKey = "YOUR_API_KEY";

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const cityName = document.querySelector(".city-name");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");

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
      throw new Error("City not found");
    }

    const data = await response.json();

    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${data.wind.speed} km/h`;

  } catch (error) {
    alert(error.message);
  }
}