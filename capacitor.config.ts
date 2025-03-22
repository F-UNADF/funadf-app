import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.funadf.app',
  appName: 'ADD+',
  webDir: 'dist',
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
  ,
  android: {
    buildOptions: {
      keystorePath: 'undefined',
      keystoreAlias: 'undefined',
    }
  }
};

export default config;
