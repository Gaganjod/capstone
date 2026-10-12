'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AccessibilityState {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'OpenDyslexic' | 'Inter' | 'System';
  letterSpacing: 'normal' | 'wide' | 'extra-wide';
  lineSpacing: 'normal' | 'comfortable' | 'large';
  readingSpeed: number;
  audioAutoPlay: boolean;
  highlightReading: boolean;
  highContrast: boolean;
  focusOverlay: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilityState;
  updateSettings: (newSettings: Partial<AccessibilityState>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilityState = {
  fontSize: 'medium',
  fontFamily: 'OpenDyslexic',
  letterSpacing: 'wide',
  lineSpacing: 'comfortable',
  readingSpeed: 1.0,
  audioAutoPlay: true,
  highlightReading: true,
  highContrast: false,
  focusOverlay: false,
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilityState>(defaultSettings);

  const updateSettings = (newSettings: Partial<AccessibilityState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      <div
        className={`min-h-screen transition-all duration-300 ${
          settings.fontFamily === 'OpenDyslexic' ? 'font-opendyslexic' : 'font-sans'
        } ${
          settings.letterSpacing === 'wide'
            ? 'letter-spacing-wide'
            : settings.letterSpacing === 'extra-wide'
            ? 'letter-spacing-extra-wide'
            : ''
        } ${
          settings.lineSpacing === 'comfortable'
            ? 'line-spacing-comfortable'
            : settings.lineSpacing === 'large'
            ? 'line-spacing-large'
            : ''
        } ${settings.highContrast ? 'high-contrast-mode' : ''}`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
