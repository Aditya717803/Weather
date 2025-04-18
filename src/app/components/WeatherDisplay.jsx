import { useState } from 'react';

export default function WeatherDisplay({ weather, location }) {
  const [view, setView] = useState('current'); // 'current', 'hourly', or 'daily'
  
  // Weather code mapping
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    
    return weatherCodes[code] || 'Unknown';
  };
  
  // Weather icon mapping (using emoji as placeholder)
  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code <= 2) return '🌤️';
    if (code <= 3) return '☁️';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌧️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    if (code <= 99) return '⛈️';
    return '❓';
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Format time
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!weather) return null;
  
  return (
    <div className="mt-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">{location}</h2>
        {view === 'current' && (
          <div className="mt-4">
            <div className="text-5xl mb-2">
              {getWeatherIcon(weather.current.weather_code)}
            </div>
            <div className="text-4xl font-bold">{Math.round(weather.current.temperature_2m)}°{weather.current.temperature_2m_unit}</div>
            <div className="text-lg">{getWeatherDescription(weather.current.weather_code)}</div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-500">Feels like</p>
                <p className="font-medium">{Math.round(weather.current.apparent_temperature)}°{weather.current.apparent_temperature_unit}</p>
              </div>
              <div>
                <p className="text-gray-500">Humidity</p>
                <p className="font-medium">{weather.current.relative_humidity_2m}%</p>
              </div>
              <div>
                <p className="text-gray-500">Wind</p>
                <p className="font-medium">{Math.round(weather.current.wind_speed_10m)} {weather.current.wind_speed_10m_unit}</p>
              </div>
              <div>
                <p className="text-gray-500">Precipitation</p>
                <p className="font-medium">{weather.current.precipitation} {weather.current.precipitation_unit}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex border-b mb-4">
        <button
          onClick={() => setView('current')}
          className={`flex-1 py-2 ${view === 'current' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Current
        </button>
        <button
          onClick={() => setView('hourly')}
          className={`flex-1 py-2 ${view === 'hourly' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Hourly
        </button>
        <button
          onClick={() => setView('daily')}
          className={`flex-1 py-2 ${view === 'daily' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Daily
        </button>
      </div>
      
      {view === 'hourly' && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {weather.hourly.time.map((time, index) => (
              <div key={time} className="flex flex-col items-center min-w-16">
                <p className="text-sm text-gray-500">{formatTime(time)}</p>
                <div className="my-1">{getWeatherIcon(weather.hourly.weather_code[index])}</div>
                <p className="font-medium">{Math.round(weather.hourly.temperature[index])}°</p>
                <p className="text-xs text-gray-500">{weather.hourly.precipitation_probability[index]}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {view === 'daily' && (
        <div>
          {weather.daily.time.map((date, index) => (
            <div key={date} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center">
                <div className="mr-4">{getWeatherIcon(weather.daily.weather_code[index])}</div>
                <p>{formatDate(date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{Math.round(weather.daily.temperature_2m_min[index])}°</span>
                <span className="font-medium">{Math.round(weather.daily.temperature_2m_max[index])}°</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}