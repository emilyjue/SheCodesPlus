let oldTemp = 0;
let oldWind = 0;
let apiKey = "aa64f245c9c8be5o955890a153t25adb";
let day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let fDay = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];

function search(event) {
  event.preventDefault();
  let input = document.querySelector("#city");
  let newCity = document.querySelector("h1");
  let cap = input.value.charAt(0).toUpperCase() + input.value.slice(1);
  newCity.innerHTML = cap;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cap}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(searchTemp);
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cap}&key=${apiKey}&units=imperial`;
  axios.get(forecastUrl).then(forecast);
}

function searchTemp(response) {
  UnitChoice1.checked = true;
  let tempElement = document.querySelector("h2");
  let roundTemp = Math.round(response.data.temperature.current);
  tempElement.innerHTML = `${roundTemp}°F`;
  oldTemp = roundTemp;
  let descElement = document.querySelector("#weather-description");
  let windElement = document.querySelector("#wind-speed");
  let wind = Math.round(response.data.wind.speed);
  let description = response.data.condition.description;
  description = description.charAt(0).toUpperCase() + description.slice(1);
  let iconElement = document.querySelector("#weather-icon");
  let icon = response.data.condition.icon_url;
  iconElement.innerHTML = `<image src=${icon} style="width=50px;height=50px">`;
  descElement.innerHTML = description;
  windElement.innerHTML = `Windspeed: ${wind}mph`;
  oldWind = wind;
  let humidElement = document.querySelector("#current-humid");
  humidElement.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;
  getTime();
}

function getTime() {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let time = document.querySelector("#current-time");
  if (minutes < 10 && hour < 10) {
    time.innerHTML = day[now.getDay()] + " 0" + hour + ":0" + minutes;
  } else if (minutes < 10) {
    time.innerHTML = day[now.getDay()] + " " + hour + ":0" + minutes;
  } else if (hour < 10) {
    time.innerHTML = day[now.getDay()] + " 0" + hour + ":" + minutes;
  } else {
    time.innerHTML = day[now.getDay()] + " " + hour + ":" + minutes;
  }
}
function switchUnit(event) {
  event.preventDefault();
  let tempForm = document.querySelector("#temp-form");
  let data = new FormData(tempForm);
  let output = "";
  for (const entry of data) {
    output = entry[1];
  }
  if (output === "fahrenheit") {
    let newTemp = Math.round((oldTemp * 9) / 5 + 32);
    let newWind = Math.round(oldWind * 2.236936);
    oldWind = newWind;
    oldTemp = newTemp;
    let newTempUnit = document.querySelector("h2");
    newTempUnit.innerHTML = newTemp + "&#176;F";
    let newWindUnit = document.querySelector("#wind-speed");
    newWindUnit.innerHTML = "Windspeed: " + newWind + "mph";
  } else {
    let newTemp = Math.round(((oldTemp - 32) * 5) / 9);
    let newWind = Math.round(oldWind * 0.44704);
    oldWind = newWind;
    oldTemp = newTemp;
    let newTempUnit = document.querySelector("h2");
    newTempUnit.innerHTML = newTemp + "&#176;C";
    let newWindUnit = document.querySelector("#wind-speed");
    newWindUnit.innerHTML = "Windspeed: " + newWind + "m/s";
  }
}

function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(currentTemp);
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;
  axios.get(forecastUrl).then(forecast);
}

function currentTemp(response) {
  UnitChoice1.checked = true;
  let tempElement = document.querySelector("h1");
  let tempFar = document.querySelector("h2");
  console.log(response.data);
  let roundTemp = Math.round(response.data.temperature.current);
  tempElement.innerHTML = response.data.city;
  tempFar.innerHTML = `${roundTemp}°F`;
  oldTemp = roundTemp;
  let descElement = document.querySelector("#weather-description");
  let windElement = document.querySelector("#wind-speed");
  let wind = Math.round(response.data.wind.speed);
  let description = response.data.condition.description;
  description = description.charAt(0).toUpperCase() + description.slice(1);
  let iconElement = document.querySelector("#weather-icon");
  let icon = response.data.condition.icon_url;
  console.log(icon);
  iconElement.innerHTML = `<image src=${icon} style="width=50px;height=50px;">`;
  descElement.innerHTML = description;
  windElement.innerHTML = `Windspeed: ${wind}mph`;
  let humidElement = document.querySelector("#current-humid");
  humidElement.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;
  oldWind = wind;
  getTime();
}

function currentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let form = document.querySelector("#city-form");
form.addEventListener("submit", search);

let tempUnit = document.querySelector("#temp-form");
tempUnit.addEventListener("change", switchUnit);

let cform = document.querySelector("#current-form");
cform.addEventListener("submit", currentCity);

navigator.geolocation.getCurrentPosition(handlePosition);

function forecast(response) {
  let next = document.querySelector("#next");
  next.innerHTML = "Next 5 Days";
  let forecastElement = document.querySelector("#forecast");
  let now = new Date();
  let dayArray = [];
  for (let i = 1; i < 6; i++) {
    if (now.getDay() + i > 6) {
      dayArray.push(fDay[now.getDay() + i - 7]);
    } else {
      dayArray.push(fDay[now.getDay() + i]);
    }
  }
  let forecastHTML = `<div class="row border">`;
  let index = 1;
  dayArray.forEach(function (day) {
    let temp = Math.round(response.data.daily[index].temperature.day);
    let cel = Math.round(((temp - 32) * 5) / 9);
    wind = Math.round(response.data.daily[index].wind.speed);
    let meter = Math.round(wind * 0.44704);
    forecastHTML =
      forecastHTML +
      `<div class="col">
      <div class="card mb-0 border-0" > 
            <img class="card-img-top" src=${response.data.daily[index].condition.icon_url} style="width:5rem;">
            <div class="card-body">
                <h5 class="card-title">${day}</h5>
                <p class="card-text">${temp}°F / ${cel}°C</p>
                <p class="card-info">${response.data.daily[index].condition.description}</p>
                <p class="card-wind">Wind: ${wind}mph / ${meter}m/s</p>
                <p class="card-humidity">Humidity: ${response.data.daily[index].temperature.humidity}%</p>
            </div> 
            </div>
        </div>`;
    index++;
  });
  forecastElement.innerHTML = forecastHTML + `</div>`;
}
