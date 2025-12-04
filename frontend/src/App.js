import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Home, Sprout, MessageCircle, User, RefreshCw, LineChart, Calendar } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { apiService } from './utils/api';
import { register } from './registerServiceWorker';
import { useLanguage } from './contexts/LanguageContext';
import { DEMO_MODE, demoPredictionPayload } from './config/demoData';
import { inferLanguageFromLocation } from './utils/language';
import Dashboard from './components/Dashboard';
import Recommendations from './components/Recommendations';
import Chatbot from './components/Chatbot';
import LocationSummary from './components/LocationSummary';
import MarketBoard from './components/MarketBoard';
import Schedule from './components/Schedule';
import ErrorBoundary from './components/ErrorBoundary';
import BackgroundEffects from './components/BackgroundEffects';
import Login from './components/Login';
import AccountSettings from './components/AccountSettings';
import NotificationsSettings from './components/NotificationsSettings';
import SupportModal from './components/SupportModal';
import LocationSettings from './components/LocationSettings';
import { Dock, DockIcon, DockItem, DockLabel } from './components/Dock';
import { mockSoil, mockWeather, mockAlerts, mockRecommendations, mockPrices } from './data/MockData';
import { getCropImage as getCropImageUtil } from './utils/imageUtils';
import { getAllCrops, getCropData } from './data/cropDatabase';

const navItems = [
  { id: 'dashboard', labelKey: 'dashboard', icon: Home },
  { id: 'recommendations', labelKey: 'crops', icon: Sprout },
  { id: 'schedule', labelKey: 'schedule', icon: Calendar },
  { id: 'market', labelKey: 'market', icon: LineChart },
  { id: 'chat', labelKey: 'chat', icon: MessageCircle },
  { id: 'profile', labelKey: 'profile', icon: User }
];

const normalize = (value, min, max) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  const range = max - min;
  if (range === 0) return 0;
  const normalized = ((value - min) / range) * 100;
  if (!Number.isFinite(normalized)) return 0;
  return Math.min(97, Math.max(3, normalized));
};

const toNumericValue = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    if (!cleaned) return null;
    return Number(cleaned);
  }
  return null;
};

const computeMatch = (item, maxProfit = 0) => {
  const raw =
    toNumericValue(item.match_percentage) ??
    toNumericValue(item.match_score) ??
    toNumericValue(item.probability) ??
    toNumericValue(item.score) ??
    toNumericValue(item.match);
  if (Number.isFinite(raw)) {
    return Math.min(100, Math.max(0, raw > 1 ? raw : raw * 100));
  }
  const confidence = Math.min(100, Math.max(0, toNumericValue(item.confidence) ?? 0));
  const suitability = Math.min(100, Math.max(0, toNumericValue(item.suitability_score) ?? 0));
  const profitVal = Math.max(0, toNumericValue(item.net_profit) ?? 0);
  const profitScore = maxProfit > 0 ? Math.min(100, Math.round((profitVal / maxProfit) * 100)) : 0;
  const weighted = 0.5 * confidence + 0.3 * suitability + 0.2 * profitScore;
  return Math.round(Math.min(100, Math.max(0, weighted)));
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true' || 
           localStorage.getItem('user') !== null;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [gameState, setGameState] = useState('locating');
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [manualLanguage, setManualLanguage] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const hasInitialized = useRef(false);
  const { language, setLanguage, t } = useLanguage();

  const manualEntryMessage = t('error.unableAuto');
  const fetchFailedMessage = t('error.fetchFailed');

  const hydratePrediction = useCallback(
    (payload) => {
      setLocation(payload.location);
      setWeatherData(payload.weather_data);
      setSoilData(payload.soil_data);
      setMarketData(payload.market_data);
      setPredictions(payload.predictions);
      setGameState('results');
      toast.success(t('analysis.readyToast'), { toastId: 'data-ready' });
    },
    [t]
  );

  const fetchAllData = useCallback(
    async (lat, lon) => {
      setGameState('analyzing');
      setError(null);

      try {
        if (DEMO_MODE) {
          hydratePrediction(demoPredictionPayload);
          return;
        }

        const predictionData = await apiService.getCropPrediction(lat, lon);
        if (predictionData.success) {
          hydratePrediction(predictionData);
        } else {
          throw new Error(predictionData.error || 'Failed to fetch predictions');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(fetchFailedMessage);
        setGameState('error');
        toast.error(fetchFailedMessage);
      }
    },
    [fetchFailedMessage, hydratePrediction]
  );

  const initializeApp = useCallback(() => {
    if (DEMO_MODE) {
      setCoordinates({ lat: 18.094, lon: 78.267 });
      setGameState('analyzing');
      setTimeout(() => hydratePrediction(demoPredictionPayload), 600);
      return;
    }

    if (!navigator.geolocation) {
      setError(manualEntryMessage);
      setGameState('error');
      return;
    }

    setGameState('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        fetchAllData(latitude, longitude);
      },
      (geoError) => {
        console.error('Geolocation error:', geoError);
        setError(manualEntryMessage);
        setGameState('error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [fetchAllData, hydratePrediction, manualEntryMessage]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeApp();
    }

    if (process.env.NODE_ENV === 'production') {
      register({
        onUpdate: (registration) => {
          toast.info('New version available! Click to update.', {
            onClick: () => {
              if (registration?.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });
    }
  }, [initializeApp]);

  useEffect(() => {
    if (!location || manualLanguage) return;
    const inferred = inferLanguageFromLocation(location);
    if (inferred && inferred !== language) {
      setLanguage(inferred);
    }
  }, [location, manualLanguage, language, setLanguage]);

  const soilOverview = useMemo(() => {
    if (!soilData?.soil_properties) return mockSoil;
    const nitrogen = normalize(soilData.soil_properties.nitrogen?.mean ?? 0.45, 0.2, 0.8);
    const phosphorus = normalize(soilData.soil_properties.phh2o?.mean ?? 6.4, 4.5, 8.5);
    const potassium = normalize(soilData.soil_properties.soc?.mean ?? 0.9, 0.2, 1.6);
    const score = Math.round((nitrogen + phosphorus + potassium) / 3);
    return {
      score,
      nutrients: {
        nitrogen: Math.round(nitrogen),
        phosphorus: Math.round(phosphorus),
        potassium: Math.round(potassium)
      }
    };
  }, [soilData]);

  const weatherOverview = useMemo(() => {
    if (!weatherData?.current) return mockWeather;
    return {
      temperature: Math.round(weatherData.current.temperature ?? mockWeather.temperature),
      condition: weatherData.current.description || mockWeather.condition,
      humidity: weatherData.current.humidity ?? mockWeather.humidity,
      wind: weatherData.current.wind_speed ?? mockWeather.wind
    };
  }, [weatherData]);

  const alertList = useMemo(() => {
    const custom = [];
    if (marketData?.market_analysis?.trend === 'down') {
      custom.push({
        id: 'market',
        title: '📉 Market Price Update',
        description: `${marketData.market_analysis.market_status} sentiment this week.`
      });
    }
    if (weatherData?.current?.humidity > 80) {
      custom.push({
        id: 'humidity',
        title: '💧 Humidity Alert',
        description: 'High humidity forecast — schedule a protective spray.'
      });
    }
    return [...custom, ...mockAlerts].slice(0, 3);
  }, [marketData, weatherData]);

  const recommendationList = useMemo(() => {
    // If no predictions, use expanded mock data with all crops
    if (!predictions?.top_recommendations?.length) {
      // Combine mock recommendations with additional crops from database
      const allCrops = getAllCrops();
      const mockCropNames = new Set(mockRecommendations.map(r => r.title.toLowerCase()));
      const additionalCrops = allCrops
        .filter(c => !mockCropNames.has(c.name.toLowerCase()))
        .slice(0, 45) // Add 45 more crops to reach 50+
        .map((crop, idx) => {
          return {
            id: mockRecommendations.length + idx + 1,
            title: crop.name,
            season: crop.season,
            match: Math.floor(Math.random() * 20) + 70, // Random match between 70-90%
            image: getCropImageUtil(crop.name),
            marketPrice: crop.price,
            priceChange: crop.change,
            waterNeed: crop.waterNeed,
            duration: crop.duration,
            roi: crop.roi,
            emoji: crop.emoji,
            soilType: crop.soilType
          };
        });
      
      // Enhance mock recommendations with database data
      const enhancedMock = mockRecommendations.map(rec => {
        const cropData = getCropData(rec.title);
        return {
          ...rec,
          marketPrice: cropData?.price || 2150,
          priceChange: cropData?.change || 4.2,
          waterNeed: cropData?.waterNeed,
          duration: cropData?.duration,
          roi: cropData?.roi,
          emoji: cropData?.emoji,
          soilType: cropData?.soilType
        };
      });
      
      return [...enhancedMock, ...additionalCrops];
    }
    
    const maxProfit = Math.max(
      ...predictions.top_recommendations.map((i) => Math.max(0, toNumericValue(i.net_profit) ?? 0)),
      1
    );
    
    // Get all crops and add them to recommendations
    const allCrops = getAllCrops();
    const predictionCrops = predictions.top_recommendations.map((item) => {
      const cropData = getCropData(item.crop);
      return {
        id: item.rank,
        title: item.crop,
        season: item.season || marketData?.season || cropData?.season || 'Rabi',
        match: computeMatch(item, maxProfit),
        image: getCropImageUtil(item.crop, item.image_url),
        marketPrice: cropData?.price,
        priceChange: cropData?.change,
        waterNeed: cropData?.waterNeed,
        duration: cropData?.duration,
        roi: cropData?.roi,
        emoji: cropData?.emoji,
        soilType: cropData?.soilType
      };
    });
    
    // Add more crops from database to reach 50+
    const predictionCropNames = new Set(predictionCrops.map(c => c.title.toLowerCase()));
    const additionalCrops = allCrops
      .filter(c => !predictionCropNames.has(c.name.toLowerCase()))
      .slice(0, Math.max(0, 50 - predictionCrops.length))
      .map((crop, idx) => ({
        id: predictionCrops.length + idx + 1,
        title: crop.name,
        season: crop.season,
        match: Math.floor(Math.random() * 20) + 70,
        image: getCropImageUtil(crop.name),
        marketPrice: crop.price,
        priceChange: crop.change,
        waterNeed: crop.waterNeed,
        duration: crop.duration,
        roi: crop.roi,
        emoji: crop.emoji,
        soilType: crop.soilType
      }));
    
    return [...predictionCrops, ...additionalCrops];
  }, [marketData, predictions]);

  const chatContext = {
    state: location?.state,
    district: location?.district,
    soil_type: soilData?.soil_type,
    season: marketData?.season,
    top_crops: predictions?.top_recommendations?.map((crop) => crop.crop) || [],
    temperature: weatherData?.current?.temperature,
    humidity: weatherData?.current?.humidity
  };

  const handleLanguageSelect = (value) => {
    setManualLanguage(true);
    setLanguage(value);
  };

  const handleSync = () => {
    if (coordinates.lat && coordinates.lon) {
      fetchAllData(coordinates.lat, coordinates.lon);
    } else {
      initializeApp();
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const handleUpdateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully!');
  };

  const handleLocationUpdate = useCallback(async (locationData) => {
    // Prevent duplicate calls with the same coordinates
    if (coordinates.lat === locationData.coordinates.lat && 
        coordinates.lon === locationData.coordinates.lon) {
      toast.info('This location is already set');
      return;
    }

    try {
      // Update coordinates state
      setCoordinates(locationData.coordinates);
      
      // Update location state with the new location data
      setLocation({
        state: locationData.state,
        district: locationData.district,
        area: locationData.area || locationData.district,
        village: locationData.area || '',
        ...locationData
      });
      
      // Fetch all data for the new location
      await fetchAllData(locationData.coordinates.lat, locationData.coordinates.lon);
      
      toast.success(`Location updated to ${locationData.district}, ${locationData.state}`);
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location data');
    }
  }, [coordinates.lat, coordinates.lon, fetchAllData]);

  const isLoading = gameState !== 'results';

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Login onLogin={handleLogin} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <BackgroundEffects />
      <div className="min-h-screen pb-24 relative">
        <div className="mx-auto max-w-5xl space-y-2 px-4 pt-3 pb-10">
          <div className="flex flex-wrap items-center justify-end gap-3">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                {user.name || user.email}
              </div>
            )}
            <select
              value={language}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
              <option value="as">অসমীয়া (Assamese)</option>
              <option value="ur">اردو (Urdu)</option>
            </select>
            <button
              onClick={handleSync}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-cyan-500" />
              Sync Data
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          {activeScreen === 'dashboard' && (
            <div className="space-y-2">
              <LocationSummary
                location={location}
                coordinates={coordinates}
                soilType={soilData?.soil_type || 'Red Loam Mix'}
                weatherCondition={weatherOverview?.condition}
                onSync={handleSync}
              />
              <Dashboard 
                soil={soilOverview} 
                weather={weatherOverview} 
                alerts={alertList} 
                loading={isLoading} 
                locationName={(location?.area || location?.village) || 'Your Location'}
                soilData={soilData}
                marketData={marketData}
                predictions={predictions}
              />
            </div>
          )}

          {activeScreen === 'schedule' && (
            <Schedule 
              cropName={predictions?.top_recommendations?.[0]?.crop} 
              soilData={soilData}
              predictions={predictions}
            />
          )}

          {activeScreen === 'recommendations' && <Recommendations items={recommendationList} />}

          {activeScreen === 'market' && (
            <MarketBoard
              marketData={marketData}
              recommendations={recommendationList}
              fallbackPrices={mockPrices}
            />
          )}

          {activeScreen === 'chat' && <Chatbot language={language} userContext={chatContext} />}

          {activeScreen === 'profile' && (
            <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Farmer Profile</h2>
                {user && (
                  <div className="flex items-center gap-3 mt-4">
                    {user.picture && (
                      <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full border-2 border-emerald-200" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowAccountSettings(true)}
                  className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{t('profile.account') || 'Account Settings'}</span>
                  <span className="text-cyan-500">›</span>
                </button>
                
                <button
                  onClick={() => setShowLocationSettings(true)}
                  className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{t('profile.location') || 'Location'}</span>
                  <span className="text-cyan-500">›</span>
                </button>
                
                <button
                  onClick={() => setShowNotifications(true)}
                  className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{t('profile.notifications') || 'Notifications'}</span>
                  <span className="text-cyan-500">›</span>
                </button>
                
                <button
                  onClick={() => {
                    toast.info('Language settings available in the header dropdown!');
                  }}
                  className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{t('profile.language') || 'App Language'}</span>
                  <span className="text-cyan-500">›</span>
                </button>
                
                <button
                  onClick={() => setShowSupport(true)}
                  className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{t('profile.support') || 'Support & Help'}</span>
                  <span className="text-cyan-500">›</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  {t('profile.logout') || 'Sign out'}
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white backdrop-blur-md shadow-lg">
          <Dock 
            magnification={60} 
            distance={120}
            panelHeight={64}
            className="dock-navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              const label = t(`navTabs.${item.labelKey}`);
              return (
                <DockItem key={item.id}>
                  <DockLabel>{label}</DockLabel>
                  <DockIcon>
                    <button
                      onClick={() => setActiveScreen(item.id)}
                      className="flex h-full w-full flex-col items-center justify-center gap-1"
                      aria-label={label}
                    >
                      <span
                        className={`rounded-xl px-3 py-2 transition-all ${
                          isActive ? 'bg-cyan-50 text-cyan-600 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={`text-xs font-semibold ${isActive ? 'text-cyan-600' : 'text-slate-700'}`}>{label}</span>
                    </button>
                  </DockIcon>
                </DockItem>
              );
            })}
          </Dock>
        </nav>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" limit={3} />
        
        {/* Modals */}
        {showAccountSettings && (
          <AccountSettings
            user={user}
            onClose={() => setShowAccountSettings(false)}
            onUpdate={handleUpdateUser}
          />
        )}
        {showLocationSettings && (
          <LocationSettings
            currentLocation={location}
            onClose={() => setShowLocationSettings(false)}
            onLocationUpdate={handleLocationUpdate}
          />
        )}
        {showNotifications && (
          <NotificationsSettings onClose={() => setShowNotifications(false)} />
        )}
        {showSupport && (
          <SupportModal onClose={() => setShowSupport(false)} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;

