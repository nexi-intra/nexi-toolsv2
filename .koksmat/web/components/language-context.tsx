'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type SupportedLanguage = "en" | "da" | "it";

type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
};

// Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider
type LanguageProviderProps = {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
};

export function LanguageProvider({ children, initialLanguage = 'en' }: LanguageProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


