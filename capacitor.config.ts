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
