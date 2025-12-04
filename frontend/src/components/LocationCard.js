import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Satellite } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LocationCard = ({ location, coordinates }) => {
  const { t } = useLanguage();
  const displayLocation = location || {};
  const lat = coordinates?.lat ? coordinates.lat.toFixed(4) : '--';
  const lon = coordinates?.lon ? coordinates.lon.toFixed(4) : '--';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="relative z-10 space-y-6">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-200">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{t('location.current')}</p>
              <h3 className="text-2xl font-semibold text-white">
                {displayLocation.area || displayLocation.village || t('location.unknownFarm')}
              </h3>
              <p className="text-sm text-slate-300">
                {displayLocation.district || '—'}, {displayLocation.state || 'India'}
              </p>
            </div>
          </div>
          <span className="badge">{t('location.live')}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{t('location.coordinates')}</p>
            <p className="mt-2 font-mono text-lg text-emerald-200">
              {lat}°N / {lon}°E
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{t('location.soilType')}</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {displayLocation.soil_type || 'Red Loam Mix'}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: t('location.state'), value: displayLocation.state || '—', icon: Satellite },
            { label: t('location.district'), value: displayLocation.district || '—', icon: MapPin },
            { label: t('location.tehsil'), value: displayLocation.block || displayLocation.taluk || '—', icon: Navigation }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-slate-300">
                <item.icon className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">{item.label}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LocationCard;

