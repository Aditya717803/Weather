"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import WeatherDisplay from '../components/WeatherDisplay';

export default function Home() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLoading(true);
        try {
          const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setWeather(data);
          setError(null);
        } catch (err) {
          setError('Failed to fetch weather data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.error("Error getting location:", error);
        setError('Please allow location access or search for a location');
      });
    }
  }, []);

  const handleSearch = async (searchLocation) => {
    if (!searchLocation) return;
    
    setLocation(searchLocation);
    setLoading(true);
    
    try {
      const geocodeRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchLocation)}&count=1`);
      const geocodeData = await geocodeRes.json();
      
      if (!geocodeData.results || geocodeData.results.length === 0) {
        setError('Location not found');
        setWeather(null);
        return;
      }
      
      const { latitude, longitude } = geocodeData.results[0];
      const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      
      setWeather(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather detection application using Open-Meteo API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Weather Detection</h1>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <SearchBar onSearch={handleSearch} />
            
            {loading && <p className="text-center my-4">Loading weather data...</p>}
            
            {error && <p className="text-red-500 text-center my-4">{error}</p>}
            
            {weather && <WeatherDisplay weather={weather} location={location || weather.location} />}
          </div>
        </div>
      </main>
    </div>
  );
}
