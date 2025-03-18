import { createApp } from "vue";
import App from "./components/App.vue";
import router from "./router";
import store from "./store/index";

import { IonicVue } from "@ionic/vue";

// import { PushNotifications } from '@capacitor/push-notifications';

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
import "material-design-icons/iconfont/material-icons.css";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

// const registerPushNotifications = async () => {
//   try {
//     let permStatus = await PushNotifications.checkPermissions();

//     if (permStatus.receive !== 'granted') {
//       permStatus = await PushNotifications.requestPermissions();
//     }

//     if (permStatus.receive === 'granted') {
//       await PushNotifications.register();
//     }
//   } catch (error) {
//     console.error('Push Notification registration error:', error);
//   }
// };

// PushNotifications.addListener('registration', (token) => {
//   console.log('Registration token:', token.value);
// });

// PushNotifications.addListener('registrationError', (error) => {
//   console.error('Error during registration:', error);
// });

// PushNotifications.addListener('pushNotificationReceived', (notification) => {
//   console.log('Notification received:', notification);
// });

// PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
//   console.log('Notification action:', action);
// });

// registerPushNotifications();

// Create a new store instance.
const app = createApp(App)
  .use(IonicVue)
  .use(store)
  .use(router);

router.isReady().then(() => {
  app.mount("#app");
});
