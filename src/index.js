/*let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

let city = prompt("Enter a city");
let known = false;
if (!city) {
  alert("Please enter a city");
} else {
  city = city.toLowerCase();
  for (let location in weather) {
    if (city === location) {
      let far = Math.round((weather[location].temp * 9) / 5 + 32);
      let cap = city.charAt(0).toUpperCase() + city.slice(1);
      alert(
        `It is currently ${Math.round(
          weather[location].temp
        )}°C (${far}°F) in ${cap} with a humidity of ${
          weather[location].humidity
        }%`
      );
      known = true;
      break;
    }
  }
  if (known === false) {
    alert(
      `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`
    );
  }
}




<div class="form-check form-check-inline" id="temp-unit">
        <input
          class="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="fahrenheit"
          checked
        />
        <label class="form-check-label" for="flexRadioDefault1" id="fahrenheit"
          >Fahrenheit</label
        >
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="celsius"
        />
        <label class="form-check-label" for="flexRadioDefault2" id="celsius"
          >Celsius</label
        >
      </div>
    </div>
*/
let oldTemp = 23;
let now = new Date();
let day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let hour = now.getHours();
let minutes = now.getMinutes();

function search(event) {
  event.preventDefault();
  let input = document.querySelector("#city");
  let newCity = document.querySelector("h1");
  let cap = input.value.charAt(0).toUpperCase() + input.value.slice(1);
  newCity.innerHTML = cap;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cap}&units=imperial&appid=${apiKey}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(searchTemp);
}

function searchTemp(response) {
  let tempElement = document.querySelector("h2");
  console.log(response.data.main.temp); //Challenge 4
  let roundTemp = Math.round(response.data.main.temp);
  tempElement.innerHTML = `${roundTemp}°F`;
  oldTemp = roundTemp;
}
let form = document.querySelector("#city-form");
form.addEventListener("submit", search);

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
    oldTemp = newTemp;
    let newTempUnit = document.querySelector("h2");
    newTempUnit.innerHTML = newTemp + "&#176;F";
  } else {
    let newTemp = Math.round(((oldTemp - 32) * 5) / 9);
    oldTemp = newTemp;
    let newTempUnit = document.querySelector("h2");
    newTempUnit.innerHTML = newTemp + "&#176;C";
  }
}
let tempUnit = document.querySelector("#temp-form");
tempUnit.addEventListener("change", switchUnit);

let apiKey = "794204046345249d3375e2b3e50ea702";
function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(currentTemp);
}

function currentTemp(response) {
  let tempElement = document.querySelector("h1");
  let tempFar = document.querySelector("h2");
  console.log(response.data.main);
  let roundTemp = Math.round(response.data.main.temp);
  tempElement.innerHTML = `It is currently`;
  tempFar.innerHTML = `${roundTemp}°F in ${response.data.name}`;
  oldTemp = roundTemp;
}

function currentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let cform = document.querySelector("#current-form");
cform.addEventListener("submit", currentCity);
