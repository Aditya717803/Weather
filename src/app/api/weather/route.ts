export async function GET(request:any) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
  
    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: 'Latitude and longitude are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    try {
      // Fetch weather data from Open-Meteo API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherData = await response.json();
      
      // Format the weather data for frontend consumption
      const formattedData = {
        location: weatherData.timezone.split('/')[1].replace('_', ' '),
        current: weatherData.current,
        daily: weatherData.daily,
        hourly: {
          time: weatherData.hourly.time.slice(0, 24),
          temperature: weatherData.hourly.temperature_2m.slice(0, 24),
          precipitation_probability: weatherData.hourly.precipitation_probability.slice(0, 24),
          weather_code: weatherData.hourly.weather_code.slice(0, 24)
        }
      };
      
      return new Response(JSON.stringify(formattedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch weather data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }