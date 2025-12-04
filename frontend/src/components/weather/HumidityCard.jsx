import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import CountUp from '../CountUp';
import { useLanguage } from '../../contexts/LanguageContext';

const HumidityCard = ({ humidity, delay = 0.2 }) => {
  const { t } = useLanguage();
  const hum = Math.round(humidity || 52);
  const status = hum < 40 ? (t('dashboard.low') || 'Low') : hum < 70 ? (t('dashboard.moderate') || 'Moderate') : 'High';

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500 text-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* Animated water droplets */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-3 bg-white rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: '-10%'
            }}
            animate={{
              top: '110%',
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Droplets className="w-8 h-8 mb-3 opacity-90" />
        <div className="text-sm font-medium opacity-80 mb-1">{t('dashboard.humidity')}</div>
        <div className="text-5xl font-bold">
          <CountUp end={hum} duration={2} />%
        </div>
        <div className="text-sm opacity-90 mt-2">{status}</div>
      </div>

      {/* Wave animation at bottom */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <motion.path
          d="M0,60 Q300,90 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="white"
          opacity="0.2"
          animate={{
            d: [
              'M0,60 Q300,90 600,60 T1200,60 L1200,120 L0,120 Z',
              'M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z',
              'M0,60 Q300,90 600,60 T1200,60 L1200,120 L0,120 Z'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  );
};

export default HumidityCard;

