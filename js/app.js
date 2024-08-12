const wmo_code = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light",
    67: "Freezing Rain: Heavy intensity",
    71: "Snowfall: Slight",
    73: "Snowfall: Moderate",
    75: "Snowfall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

const weather_url = "https://api.open-meteo.com/v1/forecast";
const dailyTemp = document.getElementById('dailyTemp');
const current_temp_min = document.getElementsByClassName('current_temp_min');
const current_temp_max = document.getElementsByClassName('current_temp_max');
const current_weather = document.getElementById('current_weather1');
const form = document.getElementById("form");

form.addEventListener("submit", find_city_coordinate);

async function find_city_coordinate(event) {
    event.preventDefault();

    const city_input = document.getElementById("city_input").value;

    try {
        // Fetch city coordinates
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city_input}&format=json`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        const { lat, lon, display_name } = data[0];

        // Fetch weather data
        const weatherResponse = await fetch(`${weather_url}?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max&timezone=Europe/Berlin&current=wind_speed_10m,precipitation`);
        if (!weatherResponse.ok) throw new Error("Weather data not available");
        const weatherData = await weatherResponse.json();

        // Update UI with weather data
        const { temperature_2m_max, temperature_2m_min, weather_code, apparent_temperature_max } = weatherData.daily;
        const { precipitation, wind_speed_10m } = weatherData.current;

        current_temp_min[0].innerHTML = Math.round(temperature_2m_min[0]) + `\u00B0`;
        current_temp_max[0].innerHTML = Math.round(temperature_2m_max[0]) + `\u00B0`;
        current_weather.innerHTML = wmo_code[weather_code[0]];
        document.querySelector('#windSpeed').textContent = `Wind speed: ${Math.round(wind_speed_10m)} ${weatherData.current_units.wind_speed_10m}`;
        document.querySelector('#perp').textContent = `Precipitation: ${Math.round(precipitation)} ${weatherData.current_units.precipitation}`;
        document.querySelector('#cityName').textContent = display_name;
        document.querySelector('#tempFeels').textContent = `Feels like ${Math.round(apparent_temperature_max[0])}\u00B0`;

        let content = '';
        for (let i = 0; i < temperature_2m_max.length; i++) {
            const date = new Date(weatherData.daily.time[i]).toString().slice(0, 10);
            const temp_max = Math.round(temperature_2m_max[i]);
            const temp_min = Math.round(temperature_2m_min[i]);
            content += `
                <div class="widget dailyWidget slide-left">
                    <div>
                        <div class="icon">${temp_min}&deg;<span class="material-symbols-outlined down">arrow_drop_down</span></div>
                        <div class="degree">${temp_max}&deg;<span class="material-symbols-outlined up">arrow_drop_up</span></div>
                        <div class="country">${date}</div>
                    </div>
                </div>
            `;
        }

        dailyTemp.innerHTML = content;
        const btn = document.querySelectorAll('[btn]');
        btn.forEach(b =>{
            b.classList.remove('hidden')
        })
    } catch (error) {
        console.error('Error:', error);
    }
}
// Update the UI for temp
document.addEventListener('DOMContentLoaded', function () {
    const tempButton = document.getElementById("tempButton");
    tempButton.addEventListener('click', async function () {
        const city_input = document.getElementById("city_input").value;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city_input}&format=json`);
            if (!response.ok) throw new Error("City not found");
            const data = await response.json();
            const { lat, lon } = data[0];

            const weatherResponse = await fetch(`${weather_url}?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max&timezone=Europe/Berlin&current=wind_speed_10m,precipitation`);
            if (!weatherResponse.ok) throw new Error("Weather data not available");
            const weatherData = await weatherResponse.json();

           // Update UI with weather data
        const { temperature_2m_max, temperature_2m_min, weather_code, apparent_temperature_max } = weatherData.daily;

        let content = '';
        for (let i = 0; i < temperature_2m_max.length; i++) {
            const date = new Date(weatherData.daily.time[i]).toString().slice(0, 10);
            const temp_max = Math.round(temperature_2m_max[i]);
            const temp_min = Math.round(temperature_2m_min[i]);
            content += `
                <div class="widget dailyWidget slide-left">
                    <div>
                        <div class="icon">${temp_min}&deg;<span class="material-symbols-outlined down">arrow_drop_down</span></div>
                        <div class="degree">${temp_max}&deg;<span class="material-symbols-outlined up">arrow_drop_up</span></div>
                        <div class="country">${date}</div>
                    </div>
                </div>
            `;
        }

        dailyTemp.innerHTML = content;
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

// Update the UI for weather conditions
document.addEventListener('DOMContentLoaded', function () {
    const conditionButton = document.getElementById("conditionButton");
    conditionButton.addEventListener('click', async function () {
        const city_input = document.getElementById("city_input").value;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city_input}&format=json`);
            if (!response.ok) throw new Error("City not found");
            const data = await response.json();
            const { lat, lon } = data[0];

            const weatherResponse = await fetch(`${weather_url}?latitude=${lat}&longitude=${lon}&daily=precipitation_probability_max&timezone=Europe/Berlin`);
            if (!weatherResponse.ok) throw new Error("Weather data not available");
            const weatherData = await weatherResponse.json();
            const { precipitation_probability_max } = weatherData.daily;

            let content = '';
            for (let i = 0; i < precipitation_probability_max.length; i++) {
                const date = new Date(weatherData.daily.time[i]).toString().slice(0, 10);
                const prob_max = Math.round(precipitation_probability_max[i]);
                content += `
                    <div class="widget dailyWidget slide-left">
                        <div>
                            <div class="degree">${prob_max}%</div>
                            <div class="country">${date}</div>
                        </div>
                    </div>
                `;
            }
            document.querySelector('#dailyTemp').innerHTML = content;
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


function formatTime(date) {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
}

function formatDate(date) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase();
    return formattedDate;
}

const now = new Date();

const currentTime = formatTime(now);
const currentDate = formatDate(now);

document.querySelector('.current_time').textContent = currentTime;
document.querySelector('.date_month').textContent = currentDate;
