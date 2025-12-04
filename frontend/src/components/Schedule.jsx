import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import FertilizerTimeline from './FertilizerTimeline';
import { useLanguage } from '../contexts/LanguageContext';

const Schedule = ({ cropName, soilData, predictions }) => {
  const { t } = useLanguage();
  
  // Get the top recommended crop if no specific crop is provided
  const selectedCrop = cropName || predictions?.top_recommendations?.[0]?.crop || 'Paddy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 pb-24"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-emerald-600" />
            AI Fertilizer Schedule
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Dynamic nutrient coaching based on your crop and soil conditions
          </p>
        </div>
      </div>

      <FertilizerTimeline cropName={selectedCrop} soilData={soilData} />
    </motion.div>
  );
};

export default Schedule;

