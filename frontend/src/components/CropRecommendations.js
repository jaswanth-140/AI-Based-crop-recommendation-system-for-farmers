import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedCropName } from '../utils/cropTranslations';

const computeMatchPercent = (item, maxProfit = 0) => {
  const rawValue =
    item.match_percentage ??
    item.match_score ??
    item.probability ??
    item.score ??
    item.matchScore;
  const numericRaw = Number(rawValue);
  if (Number.isFinite(numericRaw)) {
    const normalized = numericRaw > 1 ? numericRaw : numericRaw * 100;
    return Math.min(100, Math.max(0, normalized));
  }
  const confidence = Math.min(100, Math.max(0, Number(item.confidence) || 0));
  const suitability = Math.min(100, Math.max(0, Number(item.suitability_score) || 0));
  const profitVal = Math.max(0, Number(item.net_profit) || 0);
  const profitScore = maxProfit > 0 ? Math.min(100, Math.round((profitVal / maxProfit) * 100)) : 0;
  const weighted = 0.5 * confidence + 0.3 * suitability + 0.2 * profitScore;
  return Math.round(Math.min(100, Math.max(0, weighted)));
};

const CropRecommendations = ({ predictions, location }) => {
  const { t, language } = useLanguage();
  if (!predictions || !predictions.success) {
    return (
      <div className="glass-card text-center text-slate-300">
        <p>{t('crop.noData')}</p>
      </div>
    );
  }

  const list = predictions.top_recommendations || [];
  const maxProfit = Math.max(...list.map((c) => Math.max(0, Number(c.net_profit) || 0)), 1);
  const top = list[0];
  const others = list.slice(1);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <div className="relative z-10 space-y-6">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-500/20 p-3 text-violet-200">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{t('crop.aiRanking')}</p>
              <h3 className="text-2xl font-semibold text-white">
                {location?.district}, {location?.state}
              </h3>
            </div>
          </div>
        </div>

        {top && (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 via-indigo-500/10 to-slate-900/40 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{t('crop.bestFit')}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-white">
                  {getLocalizedCropName(top.crop, language) || top.crop}
                </p>
                <p className="text-sm text-slate-300">{top.icon}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">{t('crop.matchConfidence')}</p>
                <p className="text-4xl font-bold text-white text-glow">
                  {computeMatchPercent(top, maxProfit).toFixed(0)}
                  <span className="text-lg text-slate-300">%</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {others.map((crop) => (
            <div key={crop.crop} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  #{crop.rank} {getLocalizedCropName(crop.crop, language) || crop.crop}
                </p>
                <p className="text-xs text-slate-400">
                  {computeMatchPercent(crop, maxProfit).toFixed(0)} {t('crop.matchUnit')}
                </p>
              </div>
              <p className="text-sm font-semibold text-emerald-300">
                ₹{crop.price_per_quintal?.toLocaleString('en-IN') || '--'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CropRecommendations;

