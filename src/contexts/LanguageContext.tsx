
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'hi' | 'bn';

// Define translation key structure
export type TranslationKey = 
  | 'login.title'
  | 'login.username'
  | 'login.password'
  | 'login.submit'
  | 'dashboard.welcome'
  | 'dashboard.busTracking'
  | 'dashboard.students'
  | 'dashboard.routes'
  | 'bus.arriving'
  | 'bus.departed'
  | 'bus.onRoute'
  | 'common.cancel'
  | 'common.save'
  | 'common.edit'
  | 'common.delete'
  | 'common.confirm'
  | 'common.home'
  | 'common.settings';

// Define translations
interface Translations {
  [key: string]: Record<TranslationKey, string>;
}

const translations: Translations = {
  en: {
    'login.title': 'Login to your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'dashboard.welcome': 'Welcome',
    'dashboard.busTracking': 'Bus Tracking',
    'dashboard.students': 'Students',
    'dashboard.routes': 'Routes',
    'bus.arriving': 'Bus arriving at',
    'bus.departed': 'Bus departed from',
    'bus.onRoute': 'On route',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.home': 'Home',
    'common.settings': 'Settings'
  },
  hi: {
    'login.title': 'अपने खाते में लॉगिन करें',
    'login.username': 'उपयोगकर्ता नाम',
    'login.password': 'पासवर्ड',
    'login.submit': 'लॉगिन करें',
    'dashboard.welcome': 'स्वागत है',
    'dashboard.busTracking': 'बस ट्रैकिंग',
    'dashboard.students': 'छात्र',
    'dashboard.routes': 'मार्ग',
    'bus.arriving': 'बस पहुँच रही है',
    'bus.departed': 'बस से प्रस्थान किया',
    'bus.onRoute': 'रास्ते पर',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.confirm': 'पुष्टि करें',
    'common.home': 'होम',
    'common.settings': 'सेटिंग्स'
  },
  bn: {
    'login.title': 'আপনার অ্যাকাউন্টে লগইন করুন',
    'login.username': 'ব্যবহারকারীর নাম',
    'login.password': 'পাসওয়ার্ড',
    'login.submit': 'লগইন করুন',
    'dashboard.welcome': 'স্বাগতম',
    'dashboard.busTracking': 'বাস ট্র্যাকিং',
    'dashboard.students': 'ছাত্রছাত্রী',
    'dashboard.routes': 'রুট',
    'bus.arriving': 'বাস পৌঁছাচ্ছে',
    'bus.departed': 'বাস ছেড়ে গেছে',
    'bus.onRoute': 'পথে আছে',
    'common.cancel': 'বাতিল করুন',
    'common.save': 'সংরক্ষণ করুন',
    'common.edit': 'সম্পাদনা করুন',
    'common.delete': 'মুছুন',
    'common.confirm': 'নিশ্চিত করুন',
    'common.home': 'হোম',
    'common.settings': 'সেটিংস'
  }
};

// Create context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create hook for using this context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
