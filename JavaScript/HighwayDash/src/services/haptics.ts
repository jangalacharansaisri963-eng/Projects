/**
 * Haptic Vibration Feedback Service
 * Provides tactile rumble on mobile browsers when touching controls, near misses, and crashes.
 */

let vibrationEnabled = true;

export const setVibrationEnabled = (enabled: boolean) => {
  vibrationEnabled = enabled;
};

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'double' | 'success' | 'boost') => {
  if (!vibrationEnabled) return;
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(28);
        break;
      case 'heavy':
        navigator.vibrate([40, 30, 70]);
        break;
      case 'double':
        navigator.vibrate([18, 30, 18]);
        break;
      case 'success':
        navigator.vibrate([20, 40, 40]);
        break;
      case 'boost':
        navigator.vibrate([15, 15, 15, 15, 30]);
        break;
    }
  } catch {
    // Ignore unsupported browser or restricted context
  }
};
