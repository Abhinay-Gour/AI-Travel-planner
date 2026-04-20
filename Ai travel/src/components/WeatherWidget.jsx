import React, { useState, useEffect } from 'react';
import { fetchRealWeather } from '../services/bookingService';
import './WeatherWidget.css';

const STATIC_WEATHER = {
  paris: { icon:'⛅', temp:18, desc:'Partly Cloudy', humidity:'72%', wind:'14 km/h', uv:'Moderate', best:'Apr–Jun, Sep–Oct', forecast:[{day:'Mon',icon:'☀️',high:20,low:12},{day:'Tue',icon:'🌧️',high:16,low:10},{day:'Wed',icon:'⛅',high:19,low:11},{day:'Thu',icon:'☀️',high:22,low:13},{day:'Fri',icon:'⛅',high:18,low:11},{day:'Sat',icon:'🌧️',high:15,low:9},{day:'Sun',icon:'☀️',high:21,low:12}]},
  goa: { icon:'☀️', temp:32, desc:'Sunny & Humid', humidity:'85%', wind:'18 km/h', uv:'Very High', best:'Oct–Mar', forecast:[{day:'Mon',icon:'☀️',high:33,low:26},{day:'Tue',icon:'⛅',high:31,low:25},{day:'Wed',icon:'🌧️',high:28,low:24},{day:'Thu',icon:'☀️',high:34,low:27},{day:'Fri',icon:'☀️',high:35,low:27},{day:'Sat',icon:'⛅',high:32,low:25},{day:'Sun',icon:'☀️',high:33,low:26}]},
  manali: { icon:'❄️', temp:8, desc:'Cold & Snowy', humidity:'60%', wind:'22 km/h', uv:'Low', best:'May–Jun, Oct–Nov', forecast:[{day:'Mon',icon:'❄️',high:9,low:1},{day:'Tue',icon:'🌨️',high:6,low:-1},{day:'Wed',icon:'⛅',high:10,low:2},{day:'Thu',icon:'☀️',high:12,low:3},{day:'Fri',icon:'❄️',high:8,low:0},{day:'Sat',icon:'🌨️',high:5,low:-2},{day:'Sun',icon:'⛅',high:11,low:2}]},
  tokyo: { icon:'🌸', temp:22, desc:'Pleasant & Clear', humidity:'55%', wind:'10 km/h', uv:'Moderate', best:'Mar–May, Sep–Nov', forecast:[{day:'Mon',icon:'☀️',high:23,low:15},{day:'Tue',icon:'☀️',high:24,low:16},{day:'Wed',icon:'⛅',high:21,low:14},{day:'Thu',icon:'🌧️',high:18,low:13},{day:'Fri',icon:'⛅',high:22,low:15},{day:'Sat',icon:'☀️',high:25,low:16},{day:'Sun',icon:'☀️',high:24,low:15}]},
  bali: { icon:'🌺', temp:30, desc:'Tropical & Warm', humidity:'80%', wind:'15 km/h', uv:'High', best:'Apr–Oct', forecast:[{day:'Mon',icon:'⛅',high:31,low:24},{day:'Tue',icon:'🌧️',high:28,low:23},{day:'Wed',icon:'☀️',high:32,low:25},{day:'Thu',icon:'⛅',high:30,low:24},{day:'Fri',icon:'☀️',high:33,low:25},{day:'Sat',icon:'🌧️',high:27,low:22},{day:'Sun',icon:'☀️',high:31,low:24}]},
  dubai: { icon:'☀️', temp:38, desc:'Hot & Sunny', humidity:'45%', wind:'20 km/h', uv:'Extreme', best:'Oct–Apr', forecast:[{day:'Mon',icon:'☀️',high:40,low:28},{day:'Tue',icon:'☀️',high:39,low:27},{day:'Wed',icon:'☀️',high:41,low:29},{day:'Thu',icon:'⛅',high:37,low:26},{day:'Fri',icon:'☀️',high:40,low:28},{day:'Sat',icon:'☀️',high:42,low:30},{day:'Sun',icon:'☀️',high:39,low:27}]},
  default: { icon:'🌤️', temp:25, desc:'Mild Weather', humidity:'65%', wind:'12 km/h', uv:'Moderate', best:'Oct–Mar (generally)', forecast:[{day:'Mon',icon:'☀️',high:26,low:18},{day:'Tue',icon:'⛅',high:24,low:17},{day:'Wed',icon:'🌧️',high:21,low:15},{day:'Thu',icon:'☀️',high:27,low:19},{day:'Fri',icon:'⛅',high:25,low:17},{day:'Sat',icon:'☀️',high:28,low:19},{day:'Sun',icon:'⛅',high:24,low:16}]},
};

const getStaticWeather = (destination) => {
  if (!destination) return null;
  const d = destination.toLowerCase();
  for (const [key, data] of Object.entries(STATIC_WEATHER)) {
    if (key !== 'default' && d.includes(key)) return { ...data, realData: false };
  }
  return { ...STATIC_WEATHER.default, realData: false };
};

const WeatherWidget = ({ destination }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!destination) return;
    let cancelled = false;

    const load = async () => {
      // Try real API first
      const real = await fetchRealWeather(destination.replace(/,.*/, '').trim());
      if (!cancelled) {
        setWeather(real || getStaticWeather(destination));
      }
    };

    // Show static immediately, then update with real data
    setWeather(getStaticWeather(destination));
    load();

    return () => { cancelled = true; };
  }, [destination]);

  if (!weather) return null;

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <span style={{fontSize:'1.5rem'}}>🌤️</span>
        <div>
          <div className="weather-title">
            Weather Forecast
            {weather.realData && <span style={{fontSize:'0.7rem',background:'#10b981',color:'white',padding:'2px 6px',borderRadius:4,marginLeft:8}}>Live</span>}
          </div>
          <div className="weather-subtitle">{destination}</div>
        </div>
      </div>

      <div className="weather-current">
        <div className="weather-icon">{weather.icon}</div>
        <div>
          <div className="weather-temp">{weather.temp}°C</div>
          <div className="weather-desc">{weather.desc}</div>
          <div className="weather-details">
            <span className="weather-detail">💧 {weather.humidity}</span>
            <span className="weather-detail">💨 {weather.wind}</span>
            <span className="weather-detail">☀️ UV: {weather.uv}</span>
          </div>
        </div>
      </div>

      <div className="weather-forecast">
        {weather.forecast.map((d, i) => (
          <div key={i} className="forecast-day">
            <div className="forecast-day-name">{d.day}</div>
            <div className="forecast-icon">{d.icon}</div>
            <div className="forecast-temp">{d.high}°</div>
            <div className="forecast-low">{d.low}°</div>
          </div>
        ))}
      </div>

      {weather.best && (
        <div className="best-time-badge">
          🗓️ Best time to visit: {weather.best}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
