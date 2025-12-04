import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection = ({ onAction }) => {
  const { t } = useLanguage();
  const badges = t('hero.badges') || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[32px] bg-hero-agro px-6 py-14 md:py-20"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70 backdrop-blur-[1px]" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center text-white">
        <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.45em] text-slate-200">
          <Sparkles className="h-4 w-4 text-neon" />
          Pro Mode
        </div>
        <h1 className="font-poppins text-4xl font-semibold leading-tight text-white md:text-5xl">
          {t('hero.title')}
        </h1>
        <p className="text-base text-slate-200 md:text-lg">{t('hero.subtitle')}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-100"
            >
              {badge}
            </span>
          ))}
        </div>

        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-xl shadow-emerald-500/30 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          {t('hero.cta')}
        </button>
      </div>
    </motion.section>
  );
};

export default HeroSection;

