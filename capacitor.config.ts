import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'funadf.app',
  appName: 'Pasteurs ADD',
  webDir: 'public',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
