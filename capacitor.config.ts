import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.funadf.app',
  appName: 'ADD+',
  webDir: 'dist',
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Badge: {
      persist: true,
      autoClear: false
    },
    "SplashScreen": {
      "launchShowDuration": 2000,
      "launchAutoHide": true,
      "backgroundColor": "#251a7a",
      "androidScaleType": "FIT_CENTER",
      "showSpinner": false
    }
  },
  android: {
    webContentsDebuggingEnabled: true
  },
  ios: {
    appendUserAgent: 'MyAppUserAgent',
    overrideUserAgent: 'MyAppUserAgent'
  },
  server: {
    iosScheme: 'http',
  },
};

export default config;
