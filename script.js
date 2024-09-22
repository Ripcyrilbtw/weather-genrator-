// Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
const API_KEY = '2dddc8b82b0c3020b60c80dcdb73e4fc';
const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value;
    const weatherData = await getWeatherData(city);
    
    if (weatherData) {
        displayWeatherInfo(weatherData);
        playMusicBasedOnWeather(weatherData.weather[0].main);
    } else {
        weatherResult.textContent = 'Could not retrieve weather data. Please try again.';
    }
});

// Fetch weather data from OpenWeatherMap
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Weather data not available');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Display weather info on the webpage
function displayWeatherInfo(weatherData) {
    const temperature = (weatherData.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
    weatherResult.textContent = `Weather in ${weatherData.name}: ${weatherData.weather[0].description}, Temp: ${temperature}°C`;
}

// Play music based on the weather condition
function playMusicBasedOnWeather(weather) {
    const synth = new Tone.Synth().toDestination();
    let notes;

    switch (weather.toLowerCase()) {
        case 'clear':
            notes = ['C4', 'E4', 'G4'];  // Happy chords for sunny weather
            break;
        case 'rain':
            notes = ['D3', 'F3', 'A3'];  // Mellow tones for rainy weather
            break;
        case 'clouds':
            notes = ['G2', 'A2', 'B2'];  // Neutral chords for cloudy weather
            break;
        case 'snow':
            notes = ['E2', 'G3', 'C3'];  // Light, soft tones for snowy weather
            break;
        default:
            notes = ['C2', 'G2', 'D3'];  // Default to some neutral tones
    }

    // Play the notes in sequence
    const now = Tone.now();
    notes.forEach((note, index) => {
        synth.triggerAttackRelease(note, '8n', now + index * 0.5);
    });
}
