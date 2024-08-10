const wmo_code = {
    0: "Clear sky",
    1: "Mainly clear", 
    2: "partly cloudy",
    3: "overcast",
    45: "Fog", 
    48:	"depositing rime fog",
    51: "Drizzle: Light", 
    53: "Drizzle: moderate", 
    55: "Drizzle: dense intensity",
    56: "Freezing Drizzle: Light", 
    57:	"Freezing Drizzle: dense intensity",
    61: "Rain: Slight",
    63: "Rain: moderate",
    65: "Rain: heavy intensity",
    66: "Freezing Rain: Light", 
    67:	"Freezing Rain: heavy intensity",
    71: "Snow fall: Slight",
    73: "Snow fall: moderate", 
    75: "Snow fall: heavy intensity",
    77:	"Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: moderate",
    82:"Rain showers: violent",
    85: "Snow showers slight",
    86:	"Snow showers heavy",
    95:	"Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight", 
    99: "Thunderstorm wit heavy hail"
}
const weather_url = "https://api.open-meteo.com/v1/forecast"
const city_to_coordinate_url = "https://nominatim.openstreetmap.org/search?q=New+York&format=json";
const dailyTemp = document.getElementById('dailyTemp')
let content = ''
const current_temp_min = document.getElementsByClassName('current_temp_min')
const current_temp_max = document.getElementsByClassName('current_temp_max')
const current_weather = document.getElementById('current_weather1')
// fetch coordinate and weather data from api
const data = fetch(weather_url + '?latitude=52.5108638&longitude=13.3989421&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Europe/Berlin')
    .then(data => {
        return data.json();
    })
    .then(data => {
        const {temperature_2m_max,temperature_2m_min,weather_code} = data.daily
        console.log(data);
        current_temp_min.innerHTML = Math.round(data.daily.temperature_2m_min[0])
        current_temp_max.innerHTML = Math.round(data.daily.temperature_2m_max[0])

        for (let x in data.daily.temperature_2m_max) {
            // console.log(new Date(data.daily.time[x]).toString().slice(0,10),data.daily.temperature_2m_max[x]);
            const date = new Date(data.daily.time[x]).toString().slice(0, 10)
            const temp_max = Math.round(data.daily.temperature_2m_max[x])
            const temp_min = Math.round(data.daily.temperature_2m_min[x])
            content += `
                <div class="widget dailyWidget slide-left">
                    <div>
                        <div class="icon">${temp_min}&deg;</div>
                        <div class="degree">${temp_max}&deg;</div>
                        <div class="country">${date}</div>
                    </div>
                </div>      
            `
        }
         dailyTemp.innerHTML = content
         current_weather.innerHTML = wmo_code[data.daily.weather_code[0]]
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);

    });

    // Function to format time as HH:MM
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0') - 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Function to format date as AM/PM - DAY, D MONTH
function formatDate(date) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${ampm} - ${formattedDate}`;
}

// Get current date and time
const now = new Date();

// Format the time and date
const currentTime = formatTime(now);
const currentDate = formatDate(now);

// Output the results
document.querySelector('.current_time').textContent = currentTime;
document.querySelector('.date_month').textContent = currentDate;
