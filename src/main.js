import { createApp } from "vue";
import App from "./components/App.vue";
import router from "./router";
import store from "./store/index";

import { IonicVue } from "@ionic/vue";
import { SplashScreen } from "@capacitor/splash-screen";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "@/theme/variables.css";
import "@/theme/custom.css";
import "material-design-icons/iconfont/material-icons.css";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

// Create a new store instance.
const app = createApp(App)
  .use(IonicVue)
  .use(store)
  .use(router);

// Le loader HTML (public/index.html) est déjà affiché : on retire le splash natif
// pour qu'il prenne le relais sans coupure.
SplashScreen.hide({ fadeOutDuration: 250 }).catch(() => {});

// Durée minimale d'affichage du loader, pour éviter un flash au démarrage.
const LOADER_MIN_MS = 900;

function hideAppLoader() {
  const loader = document.getElementById("app-loader");
  if (!loader) return;
  const wait = Math.max(0, LOADER_MIN_MS - performance.now());
  setTimeout(() => {
    loader.classList.add("is-done");
    setTimeout(() => loader.remove(), 500);
  }, wait);
}

router.isReady().then(() => {
  app.mount("#app");
  requestAnimationFrame(hideAppLoader);
});
