import React from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  green: 'from-emerald-400 via-emerald-500 to-emerald-600',
  purple: 'from-fuchsia-400 via-purple-500 to-indigo-600',
  orange: 'from-amber-400 via-orange-500 to-rose-500',
  cyan: 'from-cyan-400 via-sky-500 to-blue-600'
};

const StatsCard = ({ title, value, subtitle, icon, tone = 'green' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{subtitle}</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-white">{value}</span>
            <span className="text-sm text-slate-400">{title}</span>
          </div>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${colorMap[tone]} p-3 text-white shadow-lg`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;

