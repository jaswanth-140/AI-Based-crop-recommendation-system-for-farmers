import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Droplets, Wind, Umbrella } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const WeatherCard = ({ weatherData }) => {
  const { t } = useLanguage();
  if (!weatherData || !weatherData.success) {
    return (
      <div className="glass-card text-center text-slate-300">
        <p>{t('weather.title')}</p>
        <p className="text-sm text-slate-500">No weather data</p>
      </div>
    );
  }

  const current = weatherData.current || {};

  const metrics = [
    { label: t('weather.humidity'), value: `${current.humidity || '--'}%`, icon: Droplets },
    { label: t('weather.wind'), value: `${current.wind_speed || '--'} m/s`, icon: Wind },
    {
      label: t('weather.rainfall'),
      value: `${current.rainfall ?? weatherData.agricultural_metrics?.rainfall ?? 0} mm`,
      icon: Umbrella
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <div className="relative z-10 space-y-6">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-200">
              <CloudSun className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{t('weather.title')}</p>
              <h3 className="text-2xl font-semibold text-white">{t('weather.title')}</h3>
              <p className="text-sm text-slate-300 capitalize">{current.description}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-300">{t('weather.feels')}</p>
          <p className="mt-2 text-6xl font-bold text-white text-glow">
            {Math.round(current.temperature || 0)}°
          </p>
          <p className="text-slate-300">{Math.round(current.feels_like || current.temperature || 0)}°C</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-slate-300">
                <metric.icon className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">{metric.label}</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;

