import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.funadf.app',
  appName: 'ADD+',
  webDir: 'dist',
  plugins: {
    // Android 15/16 (targetSdk 36) : edge-to-edge imposé, plus d'opt-out possible.
    // Plugin cœur SystemBars de Capacitor 8 :
    //  - WebView Android < 140 : la WebView est décalée nativement (padding) sous les barres
    //    système, et env(safe-area-inset-*) vaut 0 ;
    //  - WebView >= 140 avec viewport-fit=cover (public/index.html) : plein écran, et
    //    env(safe-area-inset-*) renvoie les vraies valeurs, utilisées par Ionic
    //    (--ion-safe-area-*) pour ion-header/ion-toolbar et ion-tab-bar.
    // 'css' (valeur par défaut) injecte en plus --safe-area-inset-* en secours.
    // initialViewportFitValueHint évite un saut de mise en page au démarrage.
    // Ne pas définir Keyboard.resizeOnFullScreen (incompatible avec cette gestion).
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Badge: {
      persist: true,
      autoClear: false
    },
    // Splash natif (logo sur dégradé, ou sur bleu marine en mode sombre) masqué par
    // src/main.js dès que le loader animé de public/index.html est à l'écran.
    SplashScreen: {
      launchAutoHide: false,
      launchFadeOutDuration: 250,
      backgroundColor: "#251a7a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
  // webContentsDebuggingEnabled non défini : la WebView n'est inspectable (chrome://inspect)
  // que dans les builds debug. Forcé à true, un build release exposait le jeton d'API
  // (localStorage) à quiconque branche le téléphone en USB.
  ios: {
    appendUserAgent: 'MyAppUserAgent',
    overrideUserAgent: 'MyAppUserAgent'
  },
  server: {
    iosScheme: 'http',
  },
};

export default config;
