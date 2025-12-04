import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Calendar, TrendingUp, CheckCircle, ArrowRight, X } from 'lucide-react';
import { getCropImage } from '../utils/imageUtils';
import { getCropData } from '../data/cropDatabase';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedCropName } from '../utils/cropTranslations';

/**
 * CropCard Component
 * Displays a visually rich crop recommendation card with animations
 */
const CropCard = ({ crop, index = 0 }) => {
  const { language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  
  // Extract and normalize crop data
  const cropName = crop.title || crop.name || crop.crop || 'Unknown Crop';
  const localizedCropName = getLocalizedCropName(cropName, language);
  const matchScore = crop.match || crop.matchScore || crop.match_percentage || 0;
  
  // Get crop data from database for accurate prices and info
  const cropData = getCropData(cropName);
  
  const season = crop.season || cropData?.season || 'Kharif';
  const soilType = crop.soilType || cropData?.soilType || 'Red';
  
  // Initialize image with proper fallback
  useEffect(() => {
    if (crop.image && /^https?:\/\//.test(crop.image)) {
      setCurrentImage(crop.image);
    } else {
      setCurrentImage(getCropImage(cropName));
    }
  }, [crop.image, cropName]);
  
  const image = currentImage || getCropImage(cropName);
  
  // Use database values if available, otherwise use defaults
  const waterNeed = crop.waterNeed || cropData?.waterNeed || (cropName.toLowerCase().includes('rice') || cropName.toLowerCase().includes('paddy') ? 'High' : 'Moderate');
  const duration = crop.duration || cropData?.duration || (cropName.toLowerCase().includes('sugarcane') ? '10-12 months' : '3-4 months');
  const roi = crop.roi || cropData?.roi || (crop.profit_per_acre ? `₹${(crop.profit_per_acre / 1000).toFixed(0)}K/acre` : '₹45K/acre');
  const benefits = crop.benefits || [
    `High yield potential for ${season} season`,
    `Well-suited for ${soilType} soil conditions`
  ];
  
  // Use accurate price from database
  const marketPrice = crop.marketPrice || crop.price_per_quintal || cropData?.price || 2150;
  const priceChange = crop.priceChange || crop.change || cropData?.change || 4.2;
  const emoji = crop.emoji || crop.icon || cropData?.emoji || '🌾';

  // Get crop emoji based on name if not provided
  const getCropEmoji = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('rice') || lower.includes('paddy')) return '🌾';
    if (lower.includes('wheat')) return '🌾';
    if (lower.includes('maize') || lower.includes('corn')) return '🌽';
    if (lower.includes('cotton')) return '🧵';
    if (lower.includes('tomato')) return '🍅';
    if (lower.includes('groundnut') || lower.includes('peanut')) return '🥜';
    if (lower.includes('sugarcane')) return '🌾';
    if (lower.includes('turmeric')) return '🌿';
    if (lower.includes('jowar') || lower.includes('sorghum')) return '🌾';
    if (lower.includes('bajra') || lower.includes('millet')) return '🌾';
    return '🌱';
  };

  const cropEmoji = emoji !== '🌾' ? emoji : getCropEmoji(cropName);

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      {/* Hero crop image with overlay */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100">
        {!imageError ? (
          <img
            src={image}
            alt={localizedCropName || cropName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              setImageError(true);
              // Try fallback
              const fallback = getCropImage(cropName);
              if (fallback !== image) {
                e.currentTarget.src = fallback;
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">{emoji}</div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Match score badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
          className="absolute top-4 right-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-emerald-500 text-white px-5 py-2 rounded-full font-bold text-xl shadow-2xl backdrop-blur-sm">
              {Math.round(matchScore)}%
            </div>
          </div>
        </motion.div>

        {/* Season & Soil indicators */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <span className="bg-white/95 backdrop-blur-md text-gray-800 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            {season} 🌱
          </span>
          <span className="bg-amber-500/95 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
            {soilType} Soil
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">
          {localizedCropName || cropName}
          <span className="ml-2 text-lg">{cropEmoji}</span>
        </h3>

        {/* Quick stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <div className="text-xs text-gray-600 mb-0.5">Water Need</div>
            <div className="font-bold text-sm text-gray-900">{waterNeed}</div>
          </div>

          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-amber-600" />
            <div className="text-xs text-gray-600 mb-0.5">Duration</div>
            <div className="font-bold text-sm text-gray-900">{duration}</div>
          </div>

          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <div className="text-xs text-gray-600 mb-0.5">ROI</div>
            <div className="font-bold text-sm text-gray-900">{roi}</div>
          </div>
        </div>

        {/* Growth timeline */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
            <span>🌱 Sow</span>
            <span>🌿 Grow</span>
            <span>🌾 Harvest</span>
          </div>
          <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 + index * 0.1 }}
              className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-amber-500 rounded-full relative"
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Key benefits */}
        <div className="mb-5 space-y-2">
          {benefits.slice(0, 2).map((benefit, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Market price indicator */}
        <div className="flex items-center justify-between mb-5 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Current Market Price</div>
            <div className="text-lg font-bold text-gray-900">
              ₹{typeof marketPrice === 'number' ? marketPrice.toLocaleString('en-IN') : marketPrice}/quintal
            </div>
          </div>
          <div className={`flex items-center gap-1 font-semibold ${priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${priceChange < 0 ? 'rotate-180' : ''}`} />
            <span className="text-sm">{priceChange >= 0 ? '+' : ''}{priceChange}%</span>
          </div>
        </div>

        {/* Action button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDetails(true)}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-base hover:shadow-xl transition-all flex items-center justify-center gap-2 group/btn"
        >
          View Full Details
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-bl-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-teal-400/10 to-transparent rounded-tr-[100px] pointer-events-none" />
    </motion.div>

    {/* Full Details Modal */}
    {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="relative h-64 overflow-hidden">
              <img
                src={image}
                alt={localizedCropName || cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {localizedCropName || cropName} {emoji}
                </h2>
                <div className="flex gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {season}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {soilType} Soil
                  </span>
                  <span className="bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(matchScore)}% Match
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-xs text-gray-600 mb-1">Water Need</div>
                  <div className="font-bold text-gray-900">{waterNeed}</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                  <div className="text-xs text-gray-600 mb-1">Duration</div>
                  <div className="font-bold text-gray-900">{duration}</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <div className="text-xs text-gray-600 mb-1">ROI</div>
                  <div className="font-bold text-gray-900">{roi}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-xs text-gray-600 mb-1">Market Price</div>
                  <div className="font-bold text-gray-900">₹{typeof marketPrice === 'number' ? marketPrice.toLocaleString('en-IN') : marketPrice}</div>
                  <div className={`text-xs ${priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Key Benefits</h3>
                  <ul className="space-y-2">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Crop Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Season:</span>
                      <span className="ml-2 font-semibold text-gray-900">{season}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Soil Type:</span>
                      <span className="ml-2 font-semibold text-gray-900">{soilType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Water Requirement:</span>
                      <span className="ml-2 font-semibold text-gray-900">{waterNeed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Growth Duration:</span>
                      <span className="ml-2 font-semibold text-gray-900">{duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default CropCard;

