import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MarketCard = ({ marketData, predictions }) => {
  const { t } = useLanguage();
  if (!marketData || !marketData.success) {
    return (
      <div className="glass-card text-center text-slate-300">
        <p>{t('market.title')}</p>
        <p className="text-sm text-slate-500">{t('market.trendDown')}</p>
      </div>
    );
  }

  const priceRows = (marketData.price_trends || []).map((trend) => ({
    crop: trend.crop,
    price: trend.price,
    change: trend.change,
    direction: trend.direction || (trend.change >= 0 ? 'up' : 'down')
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <div className="relative z-10 space-y-6">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500/20 p-3 text-orange-200">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{t('market.demand')}</p>
              <h3 className="text-2xl font-semibold text-white">{t('market.title')}</h3>
              <p className="text-sm text-slate-300">{marketData.season}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{t('market.price')}</p>
          <p className="mt-2 text-4xl font-semibold text-white text-glow">
            {marketData.market_analysis?.average_price || '₹—'}
          </p>
          <p className="text-sm text-slate-400">
            {marketData.market_analysis?.market_status} •{' '}
            {marketData.market_analysis?.trend === 'up' ? t('market.trendUp') : t('market.trendDown')}
          </p>
        </div>

        <div className="space-y-3">
          {priceRows.map((row) => {
            const isUp = row.direction === 'up';
            const Icon = isUp ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={row.crop}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{row.crop}</p>
                  <p className="text-xs text-slate-400">{row.price ? `₹${row.price.toLocaleString('en-IN')}` : '--'}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? 'text-emerald-300' : 'text-rose-300'}`}>
                  <Icon className="h-4 w-4" />
                  {Math.abs(row.change).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        {predictions?.top_recommendations && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{t('market.topCrops')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {predictions.top_recommendations.slice(0, 3).map((rec) => (
                <span key={rec.crop} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-100">
                  #{rec.rank} {rec.crop} • {(rec.match_score || rec.probability || 0).toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MarketCard;

