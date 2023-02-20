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

function search(event) {
  event.preventDefault();
  let input = document.querySelector("#city");
  let newCity = document.querySelector("h1");
  let cap = input.value.charAt(0).toUpperCase() + input.value.slice(1);
  newCity.innerHTML = cap;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cap}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(searchTemp);
}

function searchTemp(response) {
  let tempElement = document.querySelector("h2");
  let roundTemp = Math.round(response.data.temperature.current);
  tempElement.innerHTML = `${roundTemp}°F`;
  oldTemp = roundTemp;
  let descElement = document.querySelector("#weather-description");
  let windElement = document.querySelector("#wind-speed");
  let wind = Math.round(response.data.wind.speed);
  let description = response.data.condition.description;
  description = description.charAt(0).toUpperCase() + description.slice(1);
  console.log(response.data.condition.description);
  let iconElement = document.querySelector("#weather-icon");
  let icon = response.data.condition.icon_url;
  console.log(icon);
  iconElement.innerHTML = `<image src=${icon} style="width=50px;height=50px">`;
  descElement.innerHTML = description;
  windElement.innerHTML = `Windspeed: ${wind}mph`;
  oldWind = wind;
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
}

function currentTemp(response) {
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
getTime();
