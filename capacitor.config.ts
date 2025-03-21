import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.funadf.app',
  appName: 'ADD+',
  webDir: 'public',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
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
  }
};

export default config;
