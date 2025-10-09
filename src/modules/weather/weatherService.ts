/**
 * Weather Service
 * Fetches weather forecast using OpenWeatherMap API
 */

export interface WeatherData {
  temperature: number; // Celsius
  condition: string; // e.g., "Clear", "Clouds", "Rain"
  description: string; // e.g., "clear sky", "few clouds"
  icon: string; // Weather icon code
  humidity: number; // Percentage
  windSpeed: number; // m/s
  precipitationProbability?: number; // Percentage (0-100)
  timestamp: number; // Unix timestamp
}

const WEATHER_ICONS: Record<string, string> = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Snow': '❄️',
  'Thunderstorm': '⛈️',
  'Mist': '🌫️',
  'Fog': '🌫️',
};

/**
 * Get weather forecast for coordinates
 */
export async function getWeatherForecast(
  coordinates: { lat: number; lng: number },
  date?: Date
): Promise<WeatherData | null> {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  
  if (!apiKey) {
    console.warn('Weather API key not configured');
    return null;
  }

  try {
    // Use forecast API for future dates, current API for today
    const isToday = !date || isDateToday(date);
    
    if (isToday) {
      return getCurrentWeather(coordinates, apiKey);
    } else {
      return getForecastWeather(coordinates, date, apiKey);
    }
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

/**
 * Get current weather
 */
async function getCurrentWeather(
  coordinates: { lat: number; lng: number },
  apiKey: string
): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${apiKey}&units=metric`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch current weather');
  }

  const data = await response.json();

  return {
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: WEATHER_ICONS[data.weather[0].main] || '🌡️',
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    timestamp: data.dt * 1000,
  };
}

/**
 * Get forecast weather for a specific date
 */
async function getForecastWeather(
  coordinates: { lat: number; lng: number },
  date: Date,
  apiKey: string
): Promise<WeatherData | null> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${apiKey}&units=metric`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather forecast');
  }

  const data = await response.json();

  // Find forecast closest to target date
  const targetTime = date.getTime();
  let closestForecast = data.list[0];
  let smallestDiff = Math.abs(closestForecast.dt * 1000 - targetTime);

  for (const forecast of data.list) {
    const diff = Math.abs(forecast.dt * 1000 - targetTime);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestForecast = forecast;
    }
  }

  // Only return if within 5 days
  const maxDiff = 5 * 24 * 60 * 60 * 1000;
  if (smallestDiff > maxDiff) {
    return null;
  }

  return {
    temperature: Math.round(closestForecast.main.temp),
    condition: closestForecast.weather[0].main,
    description: closestForecast.weather[0].description,
    icon: WEATHER_ICONS[closestForecast.weather[0].main] || '🌡️',
    humidity: closestForecast.main.humidity,
    windSpeed: closestForecast.wind.speed,
    precipitationProbability: closestForecast.pop ? Math.round(closestForecast.pop * 100) : undefined,
    timestamp: closestForecast.dt * 1000,
  };
}

/**
 * Check if date is today
 */
function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Format weather for display
 */
export function formatWeather(weather: WeatherData): string {
  return `${weather.icon} ${weather.temperature}°C, ${weather.description}`;
}

