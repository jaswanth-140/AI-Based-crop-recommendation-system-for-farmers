import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, LineChart, PieChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AnalyticsCharts = ({ marketData, predictions, soilData, weatherData }) => {
  const { t } = useLanguage();

  // Generate price trend data
  const priceTrendData = useMemo(() => {
    if (!marketData?.price_trends) {
      return Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        price: 2000 + Math.random() * 500
      }));
    }
    return marketData.price_trends.slice(0, 7).map((trend, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      price: trend.price || 2000
    }));
  }, [marketData]);

  // Generate crop distribution data
  const cropDistribution = useMemo(() => {
    if (!predictions?.top_recommendations) {
      return [
        { name: 'Rice', value: 35, color: '#10b981' },
        { name: 'Wheat', value: 25, color: '#3b82f6' },
        { name: 'Maize', value: 20, color: '#f59e0b' },
        { name: 'Others', value: 20, color: '#8b5cf6' }
      ];
    }
    
    // Get top 4 recommendations and normalize to 100%
    const topCrops = predictions.top_recommendations.slice(0, 4);
    const totalScore = topCrops.reduce((sum, crop) => {
      const score = crop.match_percentage || crop.match_score || crop.probability || 0;
      return sum + (typeof score === 'number' ? score : parseFloat(score) || 0);
    }, 0);
    
    // If total is 0, use equal distribution
    if (totalScore === 0) {
      const equalValue = 100 / topCrops.length;
      return topCrops.map((crop, i) => ({
        name: crop.crop?.split(' ')[0] || `Crop ${i + 1}`,
        value: Math.round(equalValue * 10) / 10, // Round to 1 decimal
        color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][i]
      }));
    }
    
    // Normalize scores to percentages that add up to 100
    return topCrops.map((crop, i) => {
      const score = crop.match_percentage || crop.match_score || crop.probability || 0;
      const numericScore = typeof score === 'number' ? score : parseFloat(score) || 0;
      const percentage = (numericScore / totalScore) * 100;
      return {
        name: crop.crop?.split(' ')[0] || `Crop ${i + 1}`,
        value: Math.round(percentage * 10) / 10, // Round to 1 decimal
        color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][i]
      };
    });
  }, [predictions]);

  // Calculate max price for scaling
  const maxPrice = Math.max(...priceTrendData.map(d => d.price));
  const minPrice = Math.min(...priceTrendData.map(d => d.price));
  const priceRange = maxPrice - minPrice || Math.max(maxPrice * 0.1, 100); // Use 10% of max or 100 as fallback

  // Generate soil nutrients pie data
  const soilNutrients = useMemo(() => {
    const nitrogen = soilData?.nutrients?.nitrogen || 35;
    const phosphorus = soilData?.nutrients?.phosphorus || 40;
    const potassium = soilData?.nutrients?.potassium || 25;
    const total = nitrogen + phosphorus + potassium;
    return [
      { name: 'Nitrogen', value: (nitrogen / total) * 100, color: '#10b981' },
      { name: 'Phosphorus', value: (phosphorus / total) * 100, color: '#3b82f6' },
      { name: 'Potassium', value: (potassium / total) * 100, color: '#f59e0b' }
    ];
  }, [soilData]);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 mt-0">
      {/* Price Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative p-6 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('analytics.priceTrend') || 'Price Trend (7 Days)'}</h3>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        
        <div className="h-56 relative">
          <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="55"
                y1={30 + i * 35}
                x2="380"
                y2={30 + i * 35}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}
            
            {/* Price line */}
            <motion.path
              d={`M ${priceTrendData.map((d, i) => {
                const x = 55 + (i * (325 / (priceTrendData.length - 1)));
                const y = 170 - ((d.price - minPrice) / priceRange) * 140;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
            
            {/* Area fill */}
            <motion.path
              d={`M ${priceTrendData.map((d, i) => {
                const x = 55 + (i * (325 / (priceTrendData.length - 1)));
                const y = 170 - ((d.price - minPrice) / priceRange) * 140;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')} L ${55 + ((priceTrendData.length - 1) * (325 / (priceTrendData.length - 1)))} 170 L 55 170 Z`}
              fill="url(#priceGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Data point circles */}
            {priceTrendData.map((d, i) => {
              const x = 55 + (i * (325 / (priceTrendData.length - 1)));
              const y = 170 - ((d.price - minPrice) / priceRange) * 140;
              return (
                <motion.g key={i}>
                  {/* Outer glow circle */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="#10b981"
                    fillOpacity="0.2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  />
                  {/* Main data point */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  />
                </motion.g>
              );
            })}
            
            {/* X-axis */}
            <line
              x1="55"
              y1="170"
              x2="380"
              y2="170"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            
            {/* Y-axis */}
            <line
              x1="55"
              y1="30"
              x2="55"
              y2="170"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            
            {/* X-axis labels */}
            {priceTrendData.map((d, i) => {
              const x = 55 + (i * (325 / (priceTrendData.length - 1)));
              return (
                <text
                  key={i}
                  x={x}
                  y="190"
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-medium"
                  fontSize="11"
                >
                  {d.day}
                </text>
              );
            })}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => {
              const value = minPrice + (priceRange * (4 - i) / 4);
              return (
                <text
                  key={i}
                  x="48"
                  y={35 + i * 35}
                  textAnchor="end"
                  className="text-xs fill-gray-600 font-medium"
                  fontSize="11"
                >
                  ₹{Math.round(value)}
                </text>
              );
            })}
          </svg>
        </div>
      </motion.div>

      {/* Crop Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative p-6 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('analytics.cropDistribution') || 'Crop Distribution'}</h3>
          </div>
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="flex items-center gap-6">
          {/* Pie Chart SVG */}
          <div className="flex-1">
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {(() => {
                let currentAngle = -90;
                return cropDistribution.map((item, i) => {
                  const angle = (item.value / 100) * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;
                  currentAngle = endAngle;
                  
                  const startAngleRad = (startAngle * Math.PI) / 180;
                  const endAngleRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 100 + 80 * Math.cos(startAngleRad);
                  const y1 = 100 + 80 * Math.sin(startAngleRad);
                  const x2 = 100 + 80 * Math.cos(endAngleRad);
                  const y2 = 100 + 80 * Math.sin(endAngleRad);
                  
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  return (
                    <motion.path
                      key={i}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={item.color}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  );
                });
              })()}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="space-y-3">
            {cropDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Soil Nutrients Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative p-6 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('analytics.soilNutrients') || 'Soil Nutrients Analysis'}</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          {soilNutrients.map((nutrient, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{nutrient.name}</span>
                <span className="text-sm font-bold text-gray-900">{nutrient.value.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${nutrient.value}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: nutrient.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('analytics.marketPerformance') || 'Market Performance'}</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
            <p className="text-xs text-gray-600 mb-1">{t('analytics.avgPrice') || 'Average Price'}</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{marketData?.market_analysis?.average_price?.replace('₹', '').replace(',', '') || '2,150'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl">
              <p className="text-xs text-gray-600 mb-1">{t('analytics.demandScore') || 'Demand Score'}</p>
              <p className="text-xl font-bold text-emerald-600">
                {marketData?.market_analysis?.demand_score || 82}%
              </p>
            </div>
            
            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl">
              <p className="text-xs text-gray-600 mb-1">{t('analytics.marketStatus') || 'Status'}</p>
              <p className="text-xl font-bold text-emerald-600">
                {marketData?.market_analysis?.market_status || 'Bullish'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;

