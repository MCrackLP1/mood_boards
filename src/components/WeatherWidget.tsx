/**
 * Weather Widget Component
 * Displays weather information for a location
 */

import { useEffect, useState } from 'react';
import { WeatherData, getWeatherForecast } from '@/modules/weather/weatherService';
import styles from './WeatherWidget.module.css';

interface WeatherWidgetProps {
  coordinates: { lat: number; lng: number };
  date?: Date;
  compact?: boolean;
}

export function WeatherWidget({ coordinates, date, compact = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
  }, [coordinates.lat, coordinates.lng, date]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherForecast(coordinates, date);
      
      if (!data) {
        setError('Wetter nicht verfügbar');
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.widget} ${compact ? styles.compact : ''}`}>
        <div className={styles.loading}>Lädt...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`${styles.widget} ${compact ? styles.compact : ''}`}>
        <div className={styles.error}>{error || 'Wetter nicht verfügbar'}</div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`${styles.widget} ${styles.compact}`}>
        <span className={styles.icon}>{weather.icon}</span>
        <span className={styles.temperature}>{weather.temperature}°C</span>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.main}>
        <div className={styles.iconLarge}>{weather.icon}</div>
        <div className={styles.temp}>
          <div className={styles.temperature}>{weather.temperature}°C</div>
          <div className={styles.condition}>{weather.description}</div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Luftfeuchtigkeit:</span>
          <span className={styles.detailValue}>{weather.humidity}%</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Wind:</span>
          <span className={styles.detailValue}>{weather.windSpeed} m/s</span>
        </div>
        {weather.precipitationProbability !== undefined && (
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Regen:</span>
            <span className={styles.detailValue}>{weather.precipitationProbability}%</span>
          </div>
        )}
      </div>

      <button className={styles.refreshButton} onClick={fetchWeather} title="Aktualisieren">
        🔄
      </button>
    </div>
  );
}

