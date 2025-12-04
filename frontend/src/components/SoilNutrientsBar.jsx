import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplet, Flame } from 'lucide-react';
import CountUp from './CountUp';

/**
 * Soil Nutrients Bar Component
 * Compact horizontal display of soil nutrients
 */
const SoilNutrientsBar = ({ soil, soilData }) => {
  const safeSoil = {
    score: Number(soil?.score) ?? 72,
    nutrients: {
      nitrogen: Number(soil?.nutrients?.nitrogen) ?? 35,
      phosphorus: Number(soil?.nutrients?.phosphorus) ?? 62,
      potassium: Number(soil?.nutrients?.potassium) ?? 58
    }
  };

  const nutrients = [
    {
      key: 'nitrogen',
      label: 'Nitrogen',
      value: safeSoil.nutrients.nitrogen,
      icon: Leaf,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200'
    },
    {
      key: 'phosphorus',
      label: 'Phosphorus',
      value: safeSoil.nutrients.phosphorus,
      icon: Droplet,
      color: 'from-sky-500 to-indigo-500',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700',
      borderColor: 'border-sky-200'
    },
    {
      key: 'potassium',
      label: 'Potassium',
      value: safeSoil.nutrients.potassium,
      icon: Flame,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    }
  ];

  const soilType = soilData?.soil_type || 'Red Loam';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {/* Soil Type Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-[40px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Leaf className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Soil Type</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{soilType}</p>
        </div>
      </motion.div>

      {/* Nutrient Cards */}
      {nutrients.map((nutrient, index) => {
        const Icon = nutrient.icon;
        return (
          <motion.div
            key={nutrient.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`relative p-4 rounded-2xl ${nutrient.bgColor} border-2 ${nutrient.borderColor} overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${nutrient.color} opacity-20 rounded-bl-[40px]`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Icon className={`w-5 h-5 ${nutrient.textColor}`} />
                </div>
                <span className={`text-xs font-semibold ${nutrient.textColor}`}>
                  <CountUp end={nutrient.value} duration={1.5} />%
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900">{nutrient.label}</p>
              <div className="mt-2 h-2 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${nutrient.value}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${nutrient.color} rounded-full`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SoilNutrientsBar;

