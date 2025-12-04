import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplet, Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const clampPercent = (value, min, max) => {
  if (value === undefined || value === null) return 40;
  const perc = ((value - min) / (max - min)) * 100;
  return Math.min(100, Math.max(5, perc));
};

const SoilCard = ({ soilData }) => {
  const { t } = useLanguage();
  const hasSoil = soilData && soilData.success;
  const properties = useMemo(
    () => (hasSoil ? soilData.soil_properties || {} : {}),
    [hasSoil, soilData]
  );
  const bars = useMemo(
    () => [
      {
        key: 'nitrogen',
        label: t('soil.nitrogen'),
        value: properties.nitrogen?.mean,
        unit: properties.nitrogen?.unit,
        percent: clampPercent(properties.nitrogen?.mean, 0.2, 0.8),
        icon: Leaf,
        gradient: 'from-red-500 via-amber-400 to-emerald-400'
      },
      {
        key: 'ph',
        label: t('soil.ph'),
        value: properties.phh2o?.mean,
        unit: '',
        percent: clampPercent(properties.phh2o?.mean, 4.5, 8.5),
        icon: Droplet,
        gradient: 'from-blue-400 via-emerald-400 to-lime-400'
      },
      {
        key: 'soc',
        label: t('soil.carbon'),
        value: properties.soc?.mean,
        unit: properties.soc?.unit,
        percent: clampPercent(properties.soc?.mean, 0.2, 1.8),
        icon: Flame,
        gradient: 'from-amber-400 via-orange-500 to-pink-500'
      }
    ],
    [properties, t]
  );

  if (!hasSoil) {
    return (
      <div className="glass-card text-center text-slate-300">
        <p>{t('soil.title')}</p>
        <p className="text-sm text-slate-500">{t('soil.recommendations')}</p>
      </div>
    );
  }

  const ph = properties.phh2o?.mean;
  const nitrogenLow = properties.nitrogen?.mean < 0.4;
  const phMessage = ph < 6 ? t('soil.acidic') : ph > 8 ? t('soil.alkaline') : t('soil.neutral');

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <div className="relative z-10 space-y-6">
        <div className="card-header">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{t('soil.dataSource')}</p>
            <h3 className="text-2xl font-semibold text-white">{t('soil.title')}</h3>
            <p className="text-sm text-slate-300">{soilData.soil_type}</p>
          </div>
        </div>

        <div className="space-y-4">
          {bars.map((bar) => (
            <div key={bar.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-2 text-white/80">
                    <bar.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{bar.label}</p>
                    <p className="text-xs text-slate-400">
                      {bar.value ? `${bar.value.toFixed(2)} ${bar.unit || ''}` : '--'}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-200">{Math.round(bar.percent)}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${bar.gradient}`}
                  style={{ width: `${bar.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{t('soil.landUse')}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-100">
              🌾 Agriculture {soilData.lulc_statistics?.agriculture_percentage?.toFixed(1) ?? '--'}%
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-100">
              🌳 Forest {soilData.lulc_statistics?.forest_percentage?.toFixed(1) ?? '--'}%
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{t('soil.recommendations')}</p>
          <ul className="mt-3 space-y-3 text-sm text-slate-200">
            <li>{phMessage}</li>
            <li>{nitrogenLow ? t('soil.lowNitrogen') : t('soil.goodNitrogen')}</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default SoilCard;

