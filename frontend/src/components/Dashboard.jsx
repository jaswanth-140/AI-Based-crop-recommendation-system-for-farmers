import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Droplets, Wind, Sun, CloudSun, CloudRain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import TemperatureCard from './weather/TemperatureCard';
import HumidityCard from './weather/HumidityCard';
import WindCard from './weather/WindCard';
import SoilScoreCard from './weather/SoilScoreCard';
import AlertCard from './alerts/AlertCard';
import SoilNutrientsBar from './SoilNutrientsBar';
import AnalyticsCharts from './AnalyticsCharts';

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const nutrientMeta = [
  { key: 'nitrogen', label: 'Nitrogen', color: 'from-emerald-500 to-teal-500' },
  { key: 'phosphorus', label: 'Phosphorus', color: 'from-sky-500 to-indigo-500' },
  { key: 'potassium', label: 'Potassium', color: 'from-amber-500 to-orange-500' }
];

const Dashboard = ({ soil, weather, alerts, loading, locationName, soilData, marketData, predictions }) => {
  const { t } = useLanguage();

  const safeWeather = {
    temperature: Number(weather?.temperature) ?? 28,
    condition: weather?.condition || 'Clear Sky',
    humidity: Number(weather?.humidity) ?? 52,
    wind: Number(weather?.wind) ?? 2.2
  };
  const safeSoil = {
    score: Number(soil?.score) ?? 72,
    nutrients: {
      nitrogen: Number(soil?.nutrients?.nitrogen) ?? 35,
      phosphorus: Number(soil?.nutrients?.phosphorus) ?? 62,
      potassium: Number(soil?.nutrients?.potassium) ?? 58
    }
  };

  const score = Math.min(Math.max(safeSoil.score || 0, 0), 100);
  const nitrogen = safeSoil.nutrients?.nitrogen ?? 0;
  const lowNitrogen = nitrogen < 30;

  const WeatherIcon = safeWeather.condition?.toLowerCase().includes('rain')
    ? CloudRain
    : safeWeather.condition?.toLowerCase().includes('cloud')
    ? CloudSun
    : Sun;

  const weatherGradient = safeWeather.condition?.toLowerCase().includes('rain')
    ? 'from-sky-200 via-sky-100 to-indigo-100'
    : safeWeather.condition?.toLowerCase().includes('cloud')
    ? 'from-slate-200 via-slate-100 to-sky-100'
    : 'from-sky-100 via-sky-50 to-yellow-50';

  const gaugeWidth = 240;
  const gaugeHeight = 130;
  const gaugeRadius = 110;
  const startX = (gaugeWidth / 2) - gaugeRadius;
  const startY = gaugeHeight;
  const endX = (gaugeWidth / 2) + gaugeRadius;
  const endY = gaugeHeight;
  const basePath = `M ${startX} ${startY} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${endX} ${endY}`;
  const angle = Math.PI * (score / 100);
  const cx = gaugeWidth / 2;
  const cy = gaugeHeight;
  const px = cx - gaugeRadius * Math.cos(Math.PI - angle);
  const py = cy - gaugeRadius * Math.sin(Math.PI - angle);
  const progressLargeArc = angle > Math.PI ? 1 : 0;
  const progressPath = `M ${startX} ${startY} A ${gaugeRadius} ${gaugeRadius} 0 ${progressLargeArc} 1 ${px} ${py}`;

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1200px 520px at 12% 18%, rgba(16,185,129,0.12), transparent 65%), radial-gradient(980px 500px at 85% 25%, rgba(14,165,233,0.12), transparent 60%), radial-gradient(1100px 540px at 28% 78%, rgba(234,179,8,0.12), transparent 65%)`
        }} />
      </div>

      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/40 px-5 py-2.5 backdrop-blur-md shadow-lg shadow-teal-500/10">
          <span className="text-sm font-semibold tracking-tight text-slate-800">{locationName}</span>
          <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
          <button className="relative rounded-full bg-white/60 p-2 text-slate-600 backdrop-blur-2xl shadow-lg shadow-teal-500/10">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-2">
        <div className="flex flex-col gap-3">
          {/* Soil Nutrients Bar */}
          <SoilNutrientsBar soil={soil} soilData={soilData} />
          
          {/* Weather Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <TemperatureCard
            temperature={safeWeather.temperature}
            feelsLike={safeWeather.temperature - 2}
            delay={0.1}
          />
          <HumidityCard
            humidity={safeWeather.humidity}
            delay={0.2}
          />
          <WindCard
            windSpeed={safeWeather.wind}
            direction="NE"
            delay={0.3}
          />
          <SoilScoreCard
            score={score}
            status={lowNitrogen ? 'Needs NPK boost' : 'Moderate'}
            delay={0.4}
          />
          </div>
          
          {/* Analytics Charts Section */}
          <AnalyticsCharts 
            marketData={marketData}
            predictions={predictions}
            soilData={safeSoil}
            weatherData={safeWeather}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <motion.div
            {...cardMotion}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03, filter: 'saturate(1.1)' }}
            className={`relative lg:col-span-2 rounded-[2rem] border border-white/60 bg-gradient-to-b ${weatherGradient} p-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]`}
          >
            <div className="rounded-[2rem] bg-white/60 p-8 backdrop-blur-2xl">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">{t('dashboard.weather')}</p>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Weather</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-7xl font-extrabold tracking-tight text-teal-900">{safeWeather.temperature}°</p>
                  <p className="mt-1 text-base font-semibold tracking-wide text-slate-600">{safeWeather.condition}</p>
                </div>
                <div className="relative">
                  <div className="absolute -top-6 -right-6 rounded-[2rem] bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(59,130,246,0.25)]">
                    <WeatherIcon size={96} strokeWidth={2.6} className="text-sky-600" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-2xl">
                  <Droplets className="h-4 w-4 text-sky-600" />
                  {t('dashboard.humidity')}
                  <span className="ml-2 text-slate-900">{safeWeather.humidity}%</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-2xl">
                  <Wind className="h-4 w-4 text-sky-600" />
                  {t('dashboard.wind')}
                  <span className="ml-2 text-slate-900">{safeWeather.wind} {t('dashboard.windUnit') || 'm/s'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...cardMotion}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03, filter: 'saturate(1.1)' }}
            className="relative rounded-[2rem] border border-white/60 bg-gradient-to-b from-stone-100 to-emerald-50 p-8 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{t('dashboard.soilHealth')}</p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Soil</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="mx-auto">
                <svg width={gaugeWidth} height={gaugeHeight} viewBox={`0 0 ${gaugeWidth} ${gaugeHeight}`}>
                  <defs>
                    <linearGradient id="gaugeGreen" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                    <linearGradient id="gaugeOrange" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                  <path d={basePath} stroke="#e2e8f0" strokeWidth="14" fill="none" />
                  <path d={progressPath} stroke={lowNitrogen ? 'url(#gaugeOrange)' : 'url(#gaugeGreen)'} strokeWidth="14" fill="none" strokeLinecap="round" />
                </svg>
                <div className="-mt-16 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{t('dashboard.score')}</p>
                  <p className="text-5xl font-extrabold tracking-tight text-teal-900">{score}</p>
                  {lowNitrogen && (
                    <div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(249,115,22,0.35))' }}
                    >
                      ⚠️ {t('dashboard.needsNPK') || 'Needs Attention'}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {nutrientMeta.map((nutrient) => (
                  <div key={nutrient.key}>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{nutrient.label}</span>
                      <span className="font-semibold text-slate-900">{safeSoil.nutrients?.[nutrient.key] ?? 0}%</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${nutrient.color}`}
                        style={{ width: `${safeSoil.nutrients?.[nutrient.key] ?? 0}%`, filter: nutrient.key === 'nitrogen' && lowNitrogen ? 'drop-shadow(0 0 8px rgba(244,63,94,0.5))' : 'none' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            {...cardMotion}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03, filter: 'saturate(1.1)' }}
            className="lg:col-span-3 rounded-[2rem] border border-white/60 bg-white/60 p-6 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-base font-extrabold tracking-tight text-teal-900">{t('dashboard.alerts')}</p>
                <p className="text-sm text-gray-500 mt-0.5">{t('dashboard.stayInformed') || 'Stay informed about your farm'}</p>
              </div>
              <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                {t('dashboard.viewAll')}
              </button>
            </div>
            <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-1 snap-x snap-mandatory">
              {alerts.map((alert, idx) => (
                <AlertCard
                  key={alert.id || idx}
                  alert={alert}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
