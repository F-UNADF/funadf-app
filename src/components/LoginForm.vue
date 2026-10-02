<template>
  <div class="login-shell">
    <div class="brand">
      <img src="/assets/ADD-plus-Bicouleur.svg" alt="ADD+" class="logo" />
      <h1 class="login-title">Connexion</h1>
      <p class="login-subtitle">L’espace des pasteurs et des églises des Assemblées de Dieu de France.</p>
    </div>

    <form class="login-form" novalidate @submit.prevent="login">
      <ion-list class="app-inset-list">
        <ion-item>
          <ion-input v-model="credential.email" label="Adresse e-mail" label-placement="stacked" name="email"
            type="email" inputmode="email" autocomplete="username" autocapitalize="off" spellcheck="false"
            enterkeyhint="next" placeholder="nom@exemple.fr" :disabled="loading" @keydown.enter.prevent="focusPassword" />
        </ion-item>
        <ion-item>
          <ion-input ref="password" v-model="credential.password" label="Mot de passe" label-placement="stacked"
            name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password"
            enterkeyhint="go" :disabled="loading" @keydown.enter.prevent="login">
            <ion-button slot="end" fill="clear" class="toggle-pass" :disabled="loading"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              @click="showPassword = !showPassword">
              <ion-icon slot="icon-only" :icon="showPassword ? eyeOffOutline : eyeOutline" aria-hidden="true" />
            </ion-button>
          </ion-input>
        </ion-item>
      </ion-list>

      <p v-if="error" class="login-error" role="alert">
        <ion-icon :icon="alertCircleOutline" aria-hidden="true" />
        <span>{{ error }}</span>
      </p>

      <ion-button type="submit" expand="block" class="login-btn"
        :disabled="loading || !credential.email || !credential.password">
        <ion-spinner v-if="loading" name="crescent" />
        <span v-else>Se connecter</span>
      </ion-button>

      <ion-button fill="clear" expand="block" class="forgot-btn" @click="forgotPassword">
        Mot de passe oublié&nbsp;?
      </ion-button>
    </form>
  </div>
</template>

<script>
import { IonList, IonItem, IonInput, IonButton, IonIcon, IonSpinner } from "@ionic/vue";
import { eyeOutline, eyeOffOutline, alertCircleOutline } from "ionicons/icons";
import { Browser } from "@capacitor/browser";
import { BASE_URL } from "@/utils/format";

export default {
  name: "LoginComponent",
  components: { IonList, IonItem, IonInput, IonButton, IonIcon, IonSpinner },
  data() {
    return {
      credential: {
        email: "",
        password: "",
      },
      showPassword: false,
      loading: false,
      error: "",
    };
  },
  beforeCreate() {
    // Déjà connecté : direction les actualités
    if (localStorage.getItem("token")) {
      this.$router.replace({ name: "Feed" });
    }
  },
  methods: {
    focusPassword() {
      const input = this.$refs.password && this.$refs.password.$el;
      if (input && input.setFocus) input.setFocus();
    },
    forgotPassword() {
      const url = `${BASE_URL}/mot-de-passe-oublie`;
      Browser.open({ url }).catch(() => window.open(url, "_blank"));
    },
    async login() {
      if (this.loading || !this.credential.email || !this.credential.password) return;

      this.loading = true;
      this.error = "";
      try {
        await this.$store.dispatch("sessionStore/login", {
          email: this.credential.email.trim(),
          password: this.credential.password,
        });
        await this.$store.dispatch("sessionStore/fetchUser");
        this.$router.replace({ name: "Feed" });
      } catch (e) {
        this.error = e && e.response
          ? "Adresse e-mail ou mot de passe incorrect."
          : "Connexion au serveur impossible. Vérifiez votre accès à internet.";
      } finally {
        this.loading = false;
      }
    },
  },
  setup() {
    return { eyeOutline, eyeOffOutline, alertCircleOutline };
  },
};
</script>

<style scoped>
.login-shell {
  max-width: 420px;
  margin: 0 auto;
  /* pas d'en-tête sur cet écran : on réserve la zone de l'encoche et de la barre de gestes */
  padding: calc(48px + var(--ion-safe-area-top, 0px)) var(--app-gutter) calc(32px + var(--ion-safe-area-bottom, 0px));
}

.brand {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  width: 120px;
  height: auto;
}

.login-title {
  margin: 28px 0 6px;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--app-text);
}

.login-subtitle {
  margin: 0 auto;
  max-width: 30ch;
  font-size: 0.9375rem;
  line-height: 1.45;
  color: var(--app-text-muted);
}

.toggle-pass {
  --color: var(--app-text-muted);
  min-width: 44px;
  min-height: 44px;
  margin: 0;
}

.login-error {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 12px 4px 0;
  font-size: 0.9375rem;
  line-height: 1.4;
  color: var(--ion-color-danger);
}

.login-error ion-icon {
  flex: 0 0 auto;
  font-size: 20px;
}

.login-btn {
  margin: 20px 0 0;
  min-height: 50px;
  --border-radius: var(--app-radius-control);
  font-weight: 600;
}

.forgot-btn {
  margin-top: 8px;
  min-height: 44px;
  font-weight: 600;
}
</style>
