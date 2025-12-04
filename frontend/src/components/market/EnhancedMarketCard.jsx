import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3, DollarSign } from 'lucide-react';
import CountUp from '../CountUp';

/**
 * Enhanced Market Card Component
 * Displays market price with rich visualizations and animations
 */
const EnhancedMarketCard = ({ crop, price, change, direction, isRecommended = false, index = 0 }) => {
  const isUp = direction === 'up' || (change && change >= 0);
  const changeValue = Math.abs(change || 0);
  const priceValue = price || 0;

  // Generate mock price history for sparkline
  const priceHistory = React.useMemo(() => {
    const base = priceValue;
    return Array.from({ length: 20 }, (_, i) => {
      const variation = (Math.random() - 0.5) * (base * 0.1);
      return Math.max(base * 0.7, base + variation - (i * (base * 0.02)));
    });
  }, [priceValue]);

  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);
  const range = maxPrice - minPrice || 1;

  // Create SVG path for sparkline
  const pathData = priceHistory
    .map((p, i) => {
      const x = (i / (priceHistory.length - 1)) * 100;
      const y = 100 - ((p - minPrice) / range) * 80;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative p-6 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
        isRecommended
          ? 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-200'
          : 'bg-white border border-gray-100'
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full blur-2xl" />
      </div>

      {/* Recommended badge */}
      {isRecommended && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
          className="absolute top-4 right-4 z-10"
        >
          <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <span>⭐</span>
            <span>Recommended</span>
          </div>
        </motion.div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{crop}</h3>
            <p className="text-sm text-gray-500">Market Price</p>
          </div>
          <div className={`p-3 rounded-2xl ${isUp ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {isUp ? (
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
          </div>
        </div>

        {/* Price display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ₹<CountUp end={priceValue} duration={1.5} />
            </span>
            <span className="text-lg text-gray-500">/quintal</span>
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="mb-4 h-16 bg-gradient-to-b from-gray-50 to-transparent rounded-xl p-2">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill={`url(#gradient-${index})`}
            />
            <motion.path
              d={pathData}
              stroke={isUp ? '#10b981' : '#ef4444'}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
            />
          </svg>
        </div>

        {/* Change indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUp ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-lg font-bold ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
              {isUp ? '+' : '-'}
              <CountUp end={changeValue} duration={1.5} decimals={1} />%
            </span>
          </div>
          <div className="text-xs text-gray-500 font-medium">24h change</div>
        </div>

        {/* Trend bar */}
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (changeValue / 10) * 100)}%` }}
            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
            className={`h-full rounded-full ${isUp ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
          />
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-[50px] pointer-events-none" />
    </motion.div>
  );
};

export default EnhancedMarketCard;

