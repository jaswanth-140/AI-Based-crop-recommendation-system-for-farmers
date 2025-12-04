import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext({
  language: 'te',
  setLanguage: () => {},
  t: (key) => key,
  dictionary: translations.te
});

const getNestedTranslation = (lang, key) => {
  if (!key) return '';
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), lang);
};

export const LanguageProvider = ({ children, defaultLanguage = 'te' }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  const value = useMemo(() => {
    const current = translations[language] || translations.en;
    const fallback = translations.en;

    const t = (key, fallbackText = '') => {
      return getNestedTranslation(current, key) ?? getNestedTranslation(fallback, key) ?? fallbackText ?? key;
    };

    return {
      language,
      setLanguage,
      t,
      dictionary: current
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

