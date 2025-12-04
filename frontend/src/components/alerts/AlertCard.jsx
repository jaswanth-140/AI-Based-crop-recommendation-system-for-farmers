import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Droplets, Wind, Sun, Bell, TrendingDown, Info } from 'lucide-react';

/**
 * Alert Card Component
 * Displays visually impactful alert cards with icons and animations
 */
const AlertCard = ({ alert, index = 0 }) => {
  const { title, description, type, priority = 'medium' } = alert || {};

  // Determine alert type and styling
  const getAlertConfig = () => {
    const titleLower = (title || '').toLowerCase();
    const descLower = (description || '').toLowerCase();

    if (titleLower.includes('humidity') || descLower.includes('humidity') || descLower.includes('moisture')) {
      return {
        icon: Droplets,
        gradient: 'from-blue-400 via-cyan-500 to-teal-500',
        bgGradient: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        pulseColor: 'bg-blue-400'
      };
    }
    if (titleLower.includes('wind') || descLower.includes('wind')) {
      return {
        icon: Wind,
        gradient: 'from-teal-400 via-emerald-500 to-green-500',
        bgGradient: 'from-teal-50 to-emerald-50',
        borderColor: 'border-teal-200',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        pulseColor: 'bg-teal-400'
      };
    }
    if (titleLower.includes('temperature') || descLower.includes('temperature') || descLower.includes('heat')) {
      return {
        icon: Sun,
        gradient: 'from-orange-400 via-red-500 to-pink-500',
        bgGradient: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        pulseColor: 'bg-orange-400'
      };
    }
    if (titleLower.includes('market') || descLower.includes('price') || descLower.includes('market')) {
      return {
        icon: TrendingDown,
        gradient: 'from-amber-400 via-yellow-500 to-orange-500',
        bgGradient: 'from-amber-50 to-yellow-50',
        borderColor: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        pulseColor: 'bg-amber-400'
      };
    }
    // Default alert
    return {
      icon: AlertTriangle,
      gradient: 'from-rose-400 via-pink-500 to-red-500',
      bgGradient: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      pulseColor: 'bg-rose-400'
    };
  };

  const config = getAlertConfig();
  const Icon = config.icon;
  const isHighPriority = priority === 'high';

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative min-w-[300px] md:min-w-[320px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${config.borderColor} bg-gradient-to-br ${config.bgGradient}`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-10`}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
        />
      </div>

      {/* Pulsing indicator for high priority */}
      {isHighPriority && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${config.pulseColor} shadow-lg`}
          />
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Header with icon */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
            className={`p-4 rounded-2xl ${config.iconBg} shadow-lg`}
          >
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {isHighPriority ? 'High Priority' : 'Alert'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{description}</p>

        {/* Action indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <Info className="w-4 h-4" />
          <span>Action required</span>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className={`h-1 bg-gradient-to-r ${config.gradient}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
          className="h-full bg-white/30"
        />
      </div>

      {/* Decorative corner */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${config.gradient} opacity-5 rounded-bl-[60px] pointer-events-none`} />
    </motion.div>
  );
};

export default AlertCard;

