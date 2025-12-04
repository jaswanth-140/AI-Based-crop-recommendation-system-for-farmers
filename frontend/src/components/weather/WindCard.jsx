import React from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const WindCard = ({ windSpeed, direction, delay = 0.3 }) => {
  const { t } = useLanguage();
  const speed = windSpeed || 2.57;
  const dir = direction || 'NE';
  const formattedSpeed = speed.toFixed(2);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-teal-400 via-emerald-500 to-green-500 text-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* Flowing wind lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-white rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: '-20%',
              width: `${30 + i * 10}%`
            }}
            animate={{
              left: '120%',
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Wind className="w-8 h-8 mb-3 opacity-90" />
        <div className="text-sm font-medium opacity-80 mb-1">{t('dashboard.wind') || 'Wind Speed'}</div>
        <div className="text-5xl font-bold">{formattedSpeed}</div>
        <div className="text-sm opacity-90 mt-2">{t('dashboard.windUnit') || 'm/s'} • {dir}</div>
      </div>

      {/* Compass rose */}
      <div className="absolute bottom-3 right-3 w-12 h-12 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="none" />
          <path d="M50,15 L55,45 L50,50 L45,45 Z" fill="white" />
          <text x="50" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">N</text>
          <text x="50" y="85" textAnchor="middle" fill="white" fontSize="10">S</text>
          <text x="15" y="55" textAnchor="middle" fill="white" fontSize="10">W</text>
          <text x="85" y="55" textAnchor="middle" fill="white" fontSize="10">E</text>
        </svg>
      </div>
    </motion.div>
  );
};

export default WindCard;

