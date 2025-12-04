import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Leaf, Droplet, Syringe } from 'lucide-react';
import { generateFertilizerPlan, isNitrogenLow } from '../utils/fertilizerPlan';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap = [Leaf, Droplet, Syringe];

const FertilizerTimeline = ({ cropName, soilData }) => {
  const { t } = useLanguage();

  const schedule = useMemo(() => generateFertilizerPlan(cropName, soilData), [cropName, soilData]);
  const nitrogenAlert = isNitrogenLow(soilData);
  const activeIndex = Math.min(1, Math.max(0, schedule.length - 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{t('timeline.subtitle')}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">{t('timeline.title')}</h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
          {cropName || 'Smart Crop'}
        </span>
      </div>

      <div className="relative mt-6">
        <div className="absolute left-6 top-0 h-full w-px bg-slate-200" />
        <div className="space-y-6 pl-12">
          {schedule.map((entry, index) => {
            const Icon = iconMap[index % iconMap.length];
            const isActive = index === activeIndex;
            const dimmed = index > activeIndex;
            return (
              <motion.div
                key={`${entry.title}-${entry.day}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-2xl border ${isActive ? 'border-emerald-200 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.45)]' : 'border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'} ${dimmed ? 'opacity-80' : 'opacity-100'} bg-white`}
              >
                <div className={`absolute -left-6 top-6 h-3.5 w-3.5 rounded-full ${isActive ? 'bg-emerald-500 ring-4 ring-emerald-200' : 'bg-slate-300'} animate-pulse`} />
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-500">{t('timeline.day')} {entry.day}</span>
                      <span className="text-lg font-extrabold text-slate-900">{entry.title}</span>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">
                      <Icon className="h-4 w-4 text-emerald-600" />
                      {t('timeline.stage')}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {entry.tasks.map((task) => (
                      <li key={task} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  {(entry.highlight || nitrogenAlert) && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                      <AlertCircle className="h-4 w-4" />
                      Critical Action
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FertilizerTimeline;

