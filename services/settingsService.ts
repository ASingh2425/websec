
import { AppSettings } from '../types';

const SETTINGS_KEY = 'websec_settings';

// Updated defaultSettings to include soundEffects property to match AppSettings interface
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
        return { ...defaultSettings, ...JSON.parse(storedSettings) };
      }
    } catch (e) {
      console.error("Failed to parse settings", e);
    }
    return defaultSettings;
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  },

  applySettings(settings: AppSettings) {
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  },
};
