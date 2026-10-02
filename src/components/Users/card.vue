<template>
  <div class="app-screen">
    <h1 class="app-title">Ma carte pastorale</h1>

    <!-- La carte : seul endroit de l'app, avec l'en-tête de démarrage, qui porte le dégradé de marque -->
    <article class="pastoral-card" aria-label="Carte pastorale des Assemblées de Dieu">
      <div class="card-top">
        <img src="/assets/ADD-plus-Blanc.svg" alt="ADD+" class="card-logo" />
        <span class="card-kind">Carte pastorale</span>
      </div>

      <div class="card-identity">
        <app-avatar :src="avatarUrl" :name="displayName" :size="68" class="card-photo" />
        <div class="card-text">
          <p class="card-name">{{ displayName || '—' }}</p>
          <p class="card-meta">
            <template v-if="user.level">{{ user.level }}<br></template>
            N° {{ memberNumber }}
          </p>
        </div>
      </div>

      <p class="card-org">Assemblées de Dieu de France</p>
    </article>

    <h2 class="app-section-title">Cotisations pastorales</h2>
    <p class="section-hint">La cotisation réglée ouvre le droit de vote pour l’année.</p>

    <div v-if="loading && fees.length === 0" class="years" aria-busy="true" aria-label="Chargement des cotisations">
      <ion-skeleton-text v-for="year in years" :key="year" animated class="year-skeleton" />
    </div>

    <!-- Échec sans données en cache : on n’affiche pas « Non réglée » pour des années inconnues -->
    <ul v-else-if="!feesUnknown" class="years">
      <li v-for="year in years" :key="year" class="year" :class="paid(year) ? 'is-paid' : 'is-due'">
        <span class="year-number">{{ year }}</span>
        <span class="year-status">
          <ion-icon :icon="paid(year) ? checkmarkCircle : closeCircleOutline" aria-hidden="true" />
          {{ paid(year) ? 'Réglée' : 'Non réglée' }}
        </span>
      </li>
    </ul>

    <p v-if="failed" class="section-hint error-hint">
      {{ feesUnknown ? 'Les cotisations n’ont pas pu être chargées.' : 'Les cotisations n’ont pas pu être mises à jour.' }}
      <a href="#" @click.prevent="loadProfile">Réessayer</a>
    </p>

    <ion-button v-if="!loading && !feesUnknown && !paid(years[0])" expand="block" fill="outline" class="pay-btn" router-link="/cotisations">
      Régler ma cotisation {{ years[0] }}
    </ion-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { IonIcon, IonButton, IonSkeletonText } from "@ionic/vue";
import { checkmarkCircle, closeCircleOutline } from "ionicons/icons";
import AppAvatar from "../Common/AppAvatar.vue";
import { BASE_URL } from "@/utils/format";

export default {
  name: "UserCardComponent",
  components: { IonIcon, IonButton, IonSkeletonText, AppAvatar },
  data() {
    const currentYear = new Date().getFullYear();
    return {
      years: Array.from({ length: 6 }, (_, i) => currentYear - i),
      loading: true,
      failed: false,
    };
  },
  computed: {
    ...mapGetters("sessionStore", {
      user: "getUser",
    }),
    ...mapGetters("profilStore", {
      storeFees: "getFees",
    }),
    fees() {
      return Array.isArray(this.storeFees) ? this.storeFees : [];
    },
    feesUnknown() {
      return this.failed && this.fees.length === 0;
    },
    displayName() {
      return [this.user.lastname, this.user.firstname].filter(Boolean).join(" ");
    },
    memberNumber() {
      return this.user.id ? String(this.user.id).padStart(5, "0") : "—";
    },
    avatarUrl() {
      return this.user.id ? `${BASE_URL}/avatars/${this.user.id}.png?cache=v1` : "";
    },
  },
  methods: {
    paid(year) {
      return this.fees.some((fee) => fee.what === String(year));
    },
    async loadProfile() {
      this.loading = true;
      this.failed = false;
      try {
        await this.$store.dispatch("profilStore/getProfile");
      } catch (e) {
        this.failed = true;
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    if (null === localStorage.getItem("token")) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }
    this.$store.dispatch("sessionStore/fetchUser");
    this.loadProfile();
  },
  setup() {
    return { checkmarkCircle, closeCircleOutline };
  },
};
</script>

<style scoped>
.pastoral-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1.586;
  max-width: 420px;
  margin: 0 auto;
  padding: 18px 20px;
  border-radius: 20px;
  overflow: hidden;
  color: var(--app-on-brand);
  /* voile sombre en bas pour que le texte blanc tienne le contraste sur tout le dégradé */
  background:
    linear-gradient(to top, rgba(15, 16, 83, 0.6), rgba(15, 16, 83, 0.2) 75%),
    var(--app-brand-gradient);
  box-shadow: 0 12px 32px rgba(var(--ion-color-primary-rgb), 0.28);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-logo {
  height: 30px;
  width: auto;
}

.card-kind {
  font-size: 0.8125rem;
  font-weight: 600;
  opacity: 0.95;
}

.card-identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.card-photo {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85);
  --app-accent-soft: rgba(255, 255, 255, 0.2);
  --app-accent-ink: #ffffff;
}

.card-text {
  min-width: 0;
}

.card-name {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.card-meta {
  margin: 4px 0 0;
  font-size: 0.875rem;
  line-height: 1.35;
  font-variant-numeric: tabular-nums;
}

.card-org {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.9;
}

.section-hint {
  margin: -4px 4px 12px;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}

.error-hint {
  margin-top: 12px;
}

.error-hint a {
  color: var(--ion-color-primary);
  font-weight: 600;
}

.years {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.year,
.year-skeleton {
  border-radius: var(--app-radius-control);
  min-height: 64px;
  margin: 0;
}

.year {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
}

.year-number {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--app-text);
  font-variant-numeric: tabular-nums;
}

.year-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.is-paid .year-status {
  color: var(--ion-color-success);
}

.is-due .year-status {
  color: var(--app-text-muted);
}

.pay-btn {
  margin: 20px 0 0;
  min-height: 48px;
  --border-radius: var(--app-radius-control);
  font-weight: 600;
}
</style>
