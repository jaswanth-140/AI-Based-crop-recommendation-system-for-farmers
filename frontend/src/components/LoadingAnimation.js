import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LoadingAnimation = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="loading-container"
    >
      <div className="loading-content">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        >
          <Sparkles size={48} />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="loading-title"
        >
          {title}
        </motion.h2>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="loading-subtitle"
          >
            {subtitle}
          </motion.p>
        )}
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="loading-dots"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="loading-dot"
            />
          ))}
        </motion.div>
      </div>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }
        
        .loading-content {
          max-width: 400px;
        }
        
        .loading-spinner {
          color: #10b981;
          margin-bottom: 2rem;
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.5));
        }
        
        .loading-title {
          font-size: 1.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, #10b981, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        
        .loading-subtitle {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        
        .loading-dots {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        
        .loading-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          opacity: 0.7;
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingAnimation;