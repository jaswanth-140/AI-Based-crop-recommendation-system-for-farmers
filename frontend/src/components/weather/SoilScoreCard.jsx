import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sprout } from 'lucide-react';
import CountUp from '../CountUp';
import { useLanguage } from '../../contexts/LanguageContext';

const SoilScoreCard = ({ score, status, delay = 0.4 }) => {
  const { t } = useLanguage();
  const soilScore = Math.min(Math.max(score || 53, 0), 100);
  const soilStatus = status || (soilScore < 50 ? (t('dashboard.needsNPK') || 'Needs NPK boost') : soilScore < 70 ? (t('dashboard.moderate') || 'Moderate') : 'Good');
  const statusLabel = soilScore < 50 ? (t('dashboard.low') || 'Low') : soilScore < 70 ? (t('dashboard.moderate') || 'Moderate') : 'Good';

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* Growing plant animation */}
      <div className="absolute -bottom-4 -right-4 opacity-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 1, type: 'spring' }}
        >
          <Sprout className="w-32 h-32" />
        </motion.div>
      </div>

      <div className="relative z-10">
        <Leaf className="w-8 h-8 mb-3 opacity-90" />
        <div className="text-sm font-medium opacity-80 mb-1">{t('dashboard.soilHealth')}</div>
        <div className="text-5xl font-bold">
          <CountUp end={soilScore} duration={2} />
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${soilScore}%` }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            className="h-full bg-white rounded-full relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
        <div className="text-xs opacity-80 mt-2">
          {statusLabel} • {soilStatus}
        </div>
      </div>
    </motion.div>
  );
};

export default SoilScoreCard;

