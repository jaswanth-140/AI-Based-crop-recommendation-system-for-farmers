import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * RainDrops Component
 * Creates animated rain drops falling from top to bottom
 */
const RainDrops = ({ count = 50 }) => {
  const drops = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-200/80 to-transparent"
          style={{
            left: `${drop.left}%`,
            top: '-10%'
          }}
          animate={{
            top: '110%',
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

/**
 * SunRays Component
 * Creates animated sun rays radiating from center
 */
const SunRays = () => {
  const rays = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 12,
      delay: i * 0.1
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {rays.map((ray) => (
          <motion.div
            key={ray.id}
            className="absolute w-1 h-16 bg-gradient-to-b from-yellow-300/60 to-transparent origin-top"
            style={{
              transform: `rotate(${ray.angle}deg)`,
              left: '50%',
              top: 0
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: ray.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * WeatherParticles Component
 * Renders weather-specific particle effects based on condition
 */
const WeatherParticles = ({ condition }) => {
  if (!condition) return null;

  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
    return <RainDrops count={50} />;
  }

  if (conditionLower.includes('sun') || conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return <SunRays />;
  }

  return null;
};

export default WeatherParticles;

