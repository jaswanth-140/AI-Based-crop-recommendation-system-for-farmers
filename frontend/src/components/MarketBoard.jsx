import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import EnhancedMarketCard from './market/EnhancedMarketCard';

const MarketBoard = ({ marketData, recommendations, fallbackPrices }) => {
  const { t } = useLanguage();

  const priceRows = marketData?.price_trends?.length ? marketData.price_trends : fallbackPrices;

  const recommendedSet = new Set(
    recommendations.map((rec) => rec.title.toLowerCase().replace(/\(.*?\)/g, '').trim())
  );

  const normalizeName = (name) => name.toLowerCase().replace(/\(.*?\)/g, '').trim();

  const recommendedRows = [];
  const otherRows = [];

  (priceRows || []).forEach((row) => {
    if (!row?.crop) return;
    const normalized = normalizeName(row.crop);
    const target = recommendedSet.has(normalized) ? recommendedRows : otherRows;
    target.push(row);
  });

  const marketStatus = marketData?.market_analysis?.market_status || 'Stable';
  const averagePrice = marketData?.market_analysis?.average_price || '₹2,150';
  const trend = marketData?.market_analysis?.trend || 'up';

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t('marketBoard.title')}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {t('marketBoard.subtitle')}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className={`rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
            trend === 'up' 
              ? 'bg-emerald-50 text-emerald-700' 
              : trend === 'down'
              ? 'bg-red-50 text-red-700'
              : 'bg-cyan-50 text-cyan-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : null}
            {marketStatus}
          </div>
        </div>
      </motion.div>

      {/* Market Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-bl-[100px] blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Average Market Price</p>
            <p className="text-3xl font-bold text-gray-900">{averagePrice}</p>
            <p className="text-sm text-gray-500 mt-1">{marketData?.season || 'Kharif'} Season</p>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </motion.div>

      {/* Recommended Crops Section */}
      {recommendedRows.length > 0 && (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-lg font-bold text-gray-900">{t('marketBoard.primary')}</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              {recommendedRows.length} crops
            </span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedRows.map((row, idx) => (
              <EnhancedMarketCard
                key={`rec-${row.crop}-${idx}`}
                crop={row.crop}
                price={row.price}
                change={row.change}
                direction={row.direction || (row.change >= 0 ? 'up' : 'down')}
                isRecommended={true}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Crops Section */}
      {otherRows.length > 0 && (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-lg font-bold text-gray-900">{t('marketBoard.secondary')}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
              {otherRows.length} crops
            </span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherRows.map((row, idx) => (
              <EnhancedMarketCard
                key={`other-${row.crop}-${idx}`}
                crop={row.crop}
                price={row.price}
                change={row.change}
                direction={row.direction || (row.change >= 0 ? 'up' : 'down')}
                isRecommended={false}
                index={recommendedRows.length + idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recommendedRows.length === 0 && otherRows.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No market data available</p>
        </motion.div>
      )}
    </div>
  );
};

export default MarketBoard;
