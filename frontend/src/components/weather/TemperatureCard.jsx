import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Sun } from 'lucide-react';
import CountUp from '../CountUp';
import { useLanguage } from '../../contexts/LanguageContext';

const TemperatureCard = ({ temperature, feelsLike, delay = 0.1 }) => {
  const { t } = useLanguage();
  const temp = Math.round(temperature || 28);
  const feels = Math.round(feelsLike || temp - 2);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 text-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* Animated background sun */}
      <div className="absolute -top-8 -right-8 w-32 h-32 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sun className="w-32 h-32" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Thermometer className="w-8 h-8 mb-3 opacity-90" />
        <div className="text-sm font-medium opacity-80 mb-1">{t('dashboard.temperature') || 'Temperature'}</div>
        <div className="text-5xl font-bold mb-1">
          <CountUp end={temp} duration={2} />°
        </div>
        <div className="text-sm opacity-90">{t('dashboard.feelsLike') || 'Feels like'} {feels}°</div>
      </div>

      {/* Pulsing heat waves */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
        <motion.div
          className="h-full bg-white/60"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default TemperatureCard;

