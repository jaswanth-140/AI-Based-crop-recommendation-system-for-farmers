import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Mail, Smartphone } from 'lucide-react';

const NotificationsSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    weatherAlerts: true,
    priceUpdates: true,
    cropRecommendations: true,
    marketTrends: false,
    emailNotifications: true,
    pushNotifications: true
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-cyan-600" />
              <div>
                <p className="font-semibold text-gray-900">Weather Alerts</p>
                <p className="text-xs text-gray-500">Get notified about weather changes</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('weatherAlerts')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.weatherAlerts ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.weatherAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-cyan-600" />
              <div>
                <p className="font-semibold text-gray-900">Price Updates</p>
                <p className="text-xs text-gray-500">Market price notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('priceUpdates')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.priceUpdates ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.priceUpdates ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-cyan-600" />
              <div>
                <p className="font-semibold text-gray-900">Crop Recommendations</p>
                <p className="text-xs text-gray-500">New crop suggestions</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('cropRecommendations')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.cropRecommendations ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.cropRecommendations ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-cyan-600" />
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
        >
          Save Preferences
        </button>
      </motion.div>
    </motion.div>
  );
};

export default NotificationsSettings;

