import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import WeatherParticles from './WeatherParticles';
import { getRegionalFarmImage, getSoilTypeColor, getDefaultGradient } from '../utils/imageUtils';
import placeTranslations from '../data/placeTranslations';

const formatCoord = (value, suffix) => {
  if (value === null || value === undefined) return '--';
  return `${Number(value).toFixed(4)}°${suffix}`;
};

const escapeRegExp = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const LocationSummary = ({ location, coordinates, soilType, weatherCondition, onSync }) => {
  const { t, language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const display = location || {};
  
  const state = display.state || 'Telangana';
  const district = display.district || 'Medchal-Malkajgiri';
  const area = display.area || display.village || 'Ward 11, Nagole';
  const pincode = display.pincode || '500075';
  
  const farmImage = imageError 
    ? getDefaultGradient() 
    : getRegionalFarmImage(state, district);
  
  const soilColor = getSoilTypeColor(soilType || 'Red Loam Mix');
  const coords = `${formatCoord(coordinates?.lat, 'N')} / ${formatCoord(coordinates?.lon, 'E')}`;
  const farmerOverlay =
    'https://imgs.search.brave.com/vtU5yaCBwF49_I2_L1jkwy1DVQHcc3m5NU1hCceicKI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzgxLzE1Lzg3/LzM2MF9GXzEwODEx/NTg3NzZfek9xU0xw/OG9nSFhSMVRIYnF4/S2JCS0l5YzhjTjhy/UmUuanBn';

  const placeMapEntries = useMemo(() => {
    const map = placeTranslations[language] || placeTranslations.en;
    return Object.entries(map || {}).sort((a, b) => b[0].length - a[0].length);
  }, [language]);

  const localizePlaceText = useCallback(
    (text) => {
      if (!text || !placeMapEntries.length) return text;
      let localized = text;
      placeMapEntries.forEach(([key, value]) => {
        if (!key || !value) return;
        const pattern = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'gi');
        localized = localized.replace(pattern, value);
      });
      return localized;
    },
    [placeMapEntries]
  );

  const localizedArea = localizePlaceText(area);
  const localizedDistrict = localizePlaceText(district);
  const localizedState = localizePlaceText(state);
  const localizedSoilType = localizePlaceText(soilType || 'Red Soil');

  const showLocalizedArea = language !== 'en' && localizedArea && localizedArea !== area;
  const showLocalizedRegion =
    language !== 'en' && (localizedDistrict !== district || localizedState !== state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
    >
      {/* Background: High-quality farm image from Pexels */}
      <img
        src="https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=1920"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        alt="Farm landscape"
        onError={() => setImageError(true)}
      />

      {/* Subtle texture overlay for depth */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-transparent to-amber-500/20" />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Animated weather particles */}
      {weatherCondition && <WeatherParticles condition={weatherCondition} />}

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end text-white">
        {/* Top badges */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t('location.live')}
          </span>
          <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-xs font-medium">
            📍 GPS Active
          </span>
        </div>

        {/* Location title */}
        {showLocalizedArea ? (
          <>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 drop-shadow-2xl">
              {localizedArea}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-2 text-white/80">{area}</p>
          </>
        ) : (
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl">
            {area}
          </h1>
        )}
        <p className="text-base md:text-lg lg:text-xl opacity-90">
          {district}, {state}
        </p>
        {showLocalizedRegion && (
          <p className="text-sm md:text-base opacity-80 mt-1 text-white/90">
            {localizedDistrict}, {localizedState}
          </p>
        )}

        {/* Info pills */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs md:text-sm">
            📍 {coords}
          </span>
          <span className={`px-3 py-1 ${soilColor} backdrop-blur-md rounded-full text-xs md:text-sm font-medium`}>
            🌱 {language !== 'en' ? localizedSoilType : soilType || 'Red Soil'}
          </span>
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs md:text-sm">
            📮 PIN: {pincode}
          </span>
        </div>
      </div>

      {/* Sync button with animation */}
      {onSync && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, rotate: 180 }}
          onClick={onSync}
          className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-colors shadow-lg z-20"
          aria-label="Sync location data"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      )}

      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/30 to-transparent rounded-bl-[100px]" />
    </motion.div>
  );
};

export default LocationSummary;
