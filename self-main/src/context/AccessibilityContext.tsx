import React, { createContext, useContext, useState, useEffect } from 'react';

type FontScale = 'small' | 'normal' | 'large';

interface AccessibilityContextProps {
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  increaseFontSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontScale, setFontScaleState] = useState<FontScale>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const setFontScale = (scale: FontScale) => {
    setFontScaleState(scale);
    localStorage.setItem('gov-portal-font-scale', scale);
  };

  const decreaseFontSize = () => setFontScale('small');
  const resetFontSize = () => setFontScale('normal');
  const increaseFontSize = () => setFontScale('large');

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const newVal = !prev;
      localStorage.setItem('gov-portal-high-contrast', String(newVal));
      return newVal;
    });
  };

  // Load saved choices from localStorage
  useEffect(() => {
    const savedScale = localStorage.getItem('gov-portal-font-scale') as FontScale;
    if (savedScale && ['small', 'normal', 'large'].includes(savedScale)) {
      setFontScaleState(savedScale);
    }

    const savedContrast = localStorage.getItem('gov-portal-high-contrast');
    if (savedContrast === 'true') {
      setHighContrast(true);
    }
  }, []);

  // Sync state with DOM attributes
  useEffect(() => {
    const root = document.documentElement;
    
    // Manage font scaling classes
    root.classList.remove('font-scale-small', 'font-scale-normal', 'font-scale-large');
    if (fontScale === 'small') {
      root.classList.add('font-scale-small');
      root.style.fontSize = '14px';
    } else if (fontScale === 'large') {
      root.classList.add('font-scale-large');
      root.style.fontSize = '18px';
    } else {
      root.classList.add('font-scale-normal');
      root.style.fontSize = '16px';
    }

    // Manage high contrast styling class
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [fontScale, highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        setFontScale,
        decreaseFontSize,
        resetFontSize,
        increaseFontSize,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
