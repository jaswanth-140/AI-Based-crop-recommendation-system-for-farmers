import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Target, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { indianStatesDistricts } from '../data/indianLocations';

const LocationSettings = ({ onClose, currentLocation, onLocationUpdate }) => {
  const [selectedTab, setSelectedTab] = useState('states'); // 'states' or 'coordinates'
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get districts for selected state
  const districts = useMemo(() => {
    if (!selectedState) return [];
    return indianStatesDistricts[selectedState] || [];
  }, [selectedState]);

  // Validate coordinates
  const isValidCoordinates = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lon)) return false;
    
    // Check if coordinates are within India's boundaries
    // India spans approximately: 8°N to 37°N latitude, 68°E to 97°E longitude
    if (lat < 6 || lat > 38 || lon < 66 || lon > 99) {
      return false;
    }
    
    return true;
  };

  // Handle state/district selection
  const handleStateDistrictSubmit = async () => {
    if (!selectedState || !selectedDistrict) {
      toast.error('Please select both state and district');
      return;
    }

    setIsLoading(true);
    try {
      // Geocode the location to get coordinates
      const query = `${selectedDistrict}, ${selectedState}, India`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        
        const locationData = {
          state: selectedState,
          district: selectedDistrict,
          coordinates: {
            lat: parseFloat(lat),
            lon: parseFloat(lon)
          },
          display_name,
          method: 'manual_state_district'
        };

        await onLocationUpdate(locationData);
        toast.success(`Location set to ${selectedDistrict}, ${selectedState}`);
        onClose();
      } else {
        toast.error('Could not find coordinates for this location');
      }
    } catch (error) {
      console.error('Error setting location:', error);
      toast.error('Failed to set location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle coordinate submission
  const handleCoordinatesSubmit = async () => {
    if (!isValidCoordinates()) {
      toast.error('Please enter valid coordinates within India (Lat: 6-38°N, Lon: 66-99°E)');
      return;
    }

    setIsLoading(true);
    try {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      // Reverse geocode to get location details
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      if (data) {
        const locationData = {
          state: data.address?.state || 'Unknown State',
          district: data.address?.state_district || data.address?.county || 'Unknown District',
          area: data.address?.village || data.address?.suburb || data.address?.town || '',
          coordinates: { lat, lon },
          display_name: data.display_name,
          method: 'manual_coordinates'
        };

        await onLocationUpdate(locationData);
        toast.success(`Location set to ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
        onClose();
      } else {
        toast.error('Could not fetch location details for these coordinates');
      }
    } catch (error) {
      console.error('Error setting location by coordinates:', error);
      toast.error('Failed to set location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-3">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Change Location</h2>
              <p className="text-sm text-gray-500">Set your farm location manually</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Location Display */}
        {currentLocation && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-2">Current Location</p>
            <p className="font-semibold text-gray-900">
              {currentLocation.district}, {currentLocation.state}
            </p>
            {currentLocation.coordinates && (
              <p className="text-sm text-gray-600 mt-1">
                {currentLocation.coordinates.lat?.toFixed(4)}°N, {currentLocation.coordinates.lon?.toFixed(4)}°E
              </p>
            )}
          </div>
        )}

        {/* Tab Selection */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setSelectedTab('states')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              selectedTab === 'states'
                ? 'bg-white text-cyan-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Navigation className="h-4 w-4" />
            Select State & District
          </button>
          <button
            onClick={() => setSelectedTab('coordinates')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              selectedTab === 'coordinates'
                ? 'bg-white text-cyan-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className="h-4 w-4" />
            Enter Coordinates
          </button>
        </div>

        {/* State & District Selection */}
        <AnimatePresence mode="wait">
          {selectedTab === 'states' && (
            <motion.div
              key="states"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* State Selector */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict(''); // Reset district when state changes
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="">Choose a state...</option>
                  {Object.keys(indianStatesDistricts).sort().map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selector */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Choose a district...</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {!selectedState && (
                  <p className="mt-2 text-xs text-gray-500">Please select a state first</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleStateDistrictSubmit}
                disabled={!selectedState || !selectedDistrict || isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Setting Location...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Set Location
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Coordinates Input */}
          {selectedTab === 'coordinates' && (
            <motion.div
              key="coordinates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Info Box */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-700 mb-1">📍 Coordinate Format</p>
                <p className="text-xs text-blue-600">
                  Enter decimal coordinates (e.g., Latitude: 17.3850, Longitude: 78.4867)
                  <br />
                  Valid range: Lat 6-38°N, Lon 66-99°E (India)
                </p>
              </div>

              {/* Latitude Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Latitude (°N)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 17.3850"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Longitude Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Longitude (°E)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., 78.4867"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Validation Indicator */}
              {latitude && longitude && (
                <div className={`rounded-xl border p-3 ${
                  isValidCoordinates()
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-rose-200 bg-rose-50'
                }`}>
                  <p className={`text-xs font-semibold ${
                    isValidCoordinates() ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {isValidCoordinates()
                      ? '✓ Valid coordinates within India'
                      : '✗ Invalid coordinates or outside India'}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleCoordinatesSubmit}
                disabled={!latitude || !longitude || !isValidCoordinates() || isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Setting Location...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Set Location
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default LocationSettings;
