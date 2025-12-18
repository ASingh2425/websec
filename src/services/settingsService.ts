
import { AppSettings } from '../types';

const SETTINGS_KEY = 'websec_settings';

const defaultSettings: AppSettings = {
  highContrast: false,
  soundEffects: true,
  telemetry: false,
};

export const settingsService = {
  getSettings(): AppSettings {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        // Merge with defaults to ensure all keys are present after an update
        return { ...defaultSettings, ...JSON.parse(storedSettings) };
      }
    } catch (e) {
      console.error("Failed to parse settings from localStorage", e);
    }
    return defaultSettings;
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  },

  applySettings(settings: AppSettings) {
    // Apply High Contrast Mode by adding/removing a class to the root element
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  },
};
