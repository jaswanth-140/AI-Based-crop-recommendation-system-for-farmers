import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CropCard from './CropCard';

const Recommendations = ({ items }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t('recommendations.smartMatches')}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {t('recommendations.title')}
          </h2>
        </div>
        <div className="rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
          <Leaf className="mr-1 inline h-4 w-4" />
          {t('recommendations.adaptive')}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {items.map((item, index) => (
          <CropCard key={item.id || index} crop={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
