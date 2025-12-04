import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LocationInput = ({ onLocationSubmit }) => {
  const { t } = useLanguage();
  const [coordinates, setCoordinates] = useState({ lat: '', lon: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      alert(t('input.invalid'));
      return;
    }
    
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert(t('input.range'));
      return;
    }
    
    setLoading(true);
    onLocationSubmit(lat, lon);
  };

  const handleChange = (e) => {
    setCoordinates({
      ...coordinates,
      [e.target.name]: e.target.value
    });
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({
            lat: latitude.toFixed(6),
            lon: longitude.toFixed(6)
          });
          onLocationSubmit(latitude, longitude);
        },
        (error) => {
          setLoading(false);
          alert(t('input.geoError'));
        }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="location-input-container"
    >
      <div className="location-input-header">
        <MapPin className="input-icon" />
        <h3>{t('input.title')}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="location-form">
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="lat">{t('input.latitude')}</label>
            <input
              type="number"
              id="lat"
              name="lat"
              step="any"
              placeholder={t('input.placeholderLat')}
              value={coordinates.lat}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="lon">{t('input.longitude')}</label>
            <input
              type="number"
              id="lon"
              name="lon"
              step="any"
              placeholder={t('input.placeholderLon')}
              value={coordinates.lon}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="button-group">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={useCurrentLocation}
            disabled={loading}
            className="location-button secondary"
          >
            <Target size={18} />
            {t('input.useCurrent')}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="location-button primary"
          >
            {loading ? t('input.submitting') : t('input.submit')}
          </motion.button>
        </div>
      </form>
      
      <div className="location-help">
        <p>
          <strong>{t('input.tip')}</strong> {t('input.tipDetail')}
        </p>
      </div>
      
      <style jsx>{`
        .location-input-container {
          width: 100%;
          max-width: 500px;
          margin: 1.5rem 0;
        }
        
        .location-input-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }
        
        .input-icon {
          width: 24px;
          height: 24px;
          color: #10b981;
        }
        
        .location-input-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }
        
        .location-form {
          margin-bottom: 1.5rem;
        }
        
        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .input-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .input-group input {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: white;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #10b981;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        .input-group input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .location-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 0.9rem;
          flex: 1;
          min-width: fit-content;
          justify-content: center;
        }
        
        .location-button.primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .location-button.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        .location-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .location-button.secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
        
        .location-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .location-help {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
          text-align: left;
        }
        
        .location-help p {
          margin: 0.25rem 0;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .location-help strong {
          color: rgba(255, 255, 255, 0.9);
        }
        
        @media (max-width: 640px) {
          .input-grid {
            grid-template-columns: 1fr;
            gap: 0.875rem;
          }
          
          .button-group {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .location-button {
            flex: none;
            width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .location-input-container {
            margin: 1rem 0;
          }
          
          .location-input-header {
            margin-bottom: 1rem;
          }
          
          .location-input-header h3 {
            font-size: 1.125rem;
          }
          
          .input-grid {
            margin-bottom: 1rem;
          }
          
          .input-group input {
            padding: 0.875rem 1rem;
            font-size: 16px;
          }
          
          .location-button {
            padding: 1rem 1.5rem;
            font-size: 0.9375rem;
            min-height: 48px;
          }
          
          .location-help {
            padding: 0.875rem;
          }
          
          .location-help p {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LocationInput;