<template>
  <div class="app-screen">
    <h1 class="app-title">Cotisations</h1>
    <p class="app-subtitle">Montants et moyens de paiement des cotisations annuelles des Assemblées de Dieu.</p>

    <!-- Pastorales : la plus fréquente, en premier -->
    <ion-card class="fee-card">
      <h2 class="fee-title">Cotisation pastorale</h2>
      <p class="fee-text">
        Obligatoire pour les pasteurs de l’UNADF, elle ouvre le droit de vote pour l’année en cours.
      </p>

      <ul class="tariffs">
        <li v-for="t in tariffs" :key="t.label" class="tariff">
          <div>
            <span class="tariff-label">{{ t.label }}</span>
            <span class="tariff-detail">{{ t.detail }}</span>
          </div>
          <strong class="tariff-amount">{{ t.amount }}</strong>
        </li>
      </ul>

      <div class="pay-buttons">
        <ion-button expand="block" @click="openLink(links.pastoral2026)">
          Payer la cotisation 2026
          <ion-icon slot="end" :icon="openOutline" aria-hidden="true" />
        </ion-button>
        <ion-button expand="block" fill="outline" @click="openLink(links.pastoral2025)">
          Payer la cotisation 2025
          <ion-icon slot="end" :icon="openOutline" aria-hidden="true" />
        </ion-button>
      </div>
      <p class="pay-note">Paiement sécurisé sur HelloAsso.</p>
    </ion-card>

    <ion-card class="fee-card">
      <h2 class="fee-title">Cotisation nationale des associations cultuelles</h2>
      <p class="fee-text">
        <strong>13,50&nbsp;€ par PAFRC</strong>, personne adulte fréquentant régulièrement le culte.
        Elle se règle par virement bancaire ou sur HelloAsso.
      </p>
      <div class="pay-buttons">
        <ion-button expand="block" @click="openLink(links.national2026)">
          Payer la cotisation 2026
          <ion-icon slot="end" :icon="openOutline" aria-hidden="true" />
        </ion-button>
        <ion-button expand="block" fill="outline" @click="openLink(links.national2025)">
          Payer la cotisation 2025
          <ion-icon slot="end" :icon="openOutline" aria-hidden="true" />
        </ion-button>
      </div>
    </ion-card>

    <ion-card class="fee-card">
      <h2 class="fee-title">Entraide pastorale</h2>
      <p class="fee-text">
        <strong>50&nbsp;€ par an</strong> pour soutenir les familles pastorales qui traversent des difficultés.
        À régler par virement :
      </p>
      <div class="iban">
        <div class="iban-text">
          <span class="iban-label">IBAN</span>
          <span class="iban-value">{{ entraideIban }}</span>
        </div>
        <ion-button fill="clear" class="copy-btn" aria-label="Copier l’IBAN" @click="copyIban">
          <ion-icon slot="icon-only" :icon="copied ? checkmarkOutline : copyOutline" />
        </ion-button>
      </div>
    </ion-card>

    <h2 class="app-section-title">Cotisations régionales</h2>
    <p class="region-hint">
      Leur montant dépend de la région de votre assemblée. Écrivez au secrétariat de votre région pour en savoir plus.
    </p>
    <ion-list class="app-inset-list">
      <ion-item v-for="region in regions" :key="region.email" :href="`mailto:${region.email}`" :detail="false">
        <ion-label class="ion-text-wrap">
          {{ region.name }}
          <p>{{ region.email }}</p>
        </ion-label>
        <ion-icon slot="end" :icon="mailOutline" class="mail-icon" aria-hidden="true" />
      </ion-item>
    </ion-list>
  </div>
</template>

<script>
import { IonCard, IonButton, IonIcon, IonList, IonItem, IonLabel } from "@ionic/vue";
import { openOutline, copyOutline, checkmarkOutline, mailOutline } from "ionicons/icons";
import { Browser } from "@capacitor/browser";
import { tapLight } from "@/utils/haptics";

export default {
  name: "CotisationsPage",
  components: { IonCard, IonButton, IonIcon, IonList, IonItem, IonLabel },
  data() {
    return {
      copied: false,
      links: {
        national2025: "https://tinyurl.com/mrcrawxu",
        national2026: "https://tinyurl.com/3eemmunb",
        pastoral2025: "https://tinyurl.com/f6779xpf",
        pastoral2026: "https://tinyurl.com/338u452x",
      },
      entraideIban: "FR76 1027 8079 4900 0204 7510 123",
      tariffs: [
        { label: "Pasteurs reconnus", detail: "AEM et APE", amount: "30 €" },
        { label: "Pasteurs en formation", detail: "Stagiaires, PP1, PP2", amount: "25 €" },
        { label: "Pasteurs retraités", detail: "Jusqu’à 80 ans", amount: "15 €" },
      ],
      regions: [
        { name: "Aquitaine", email: "sec.aquitaine@addfrance.fr" },
        { name: "Bretagne", email: "sec.bretagne@addfrance.fr" },
        { name: "Centre", email: "sec.centre@addfrance.fr" },
        { name: "Grand-Est", email: "sec.est@addfrance.fr" },
        { name: "Hauts-de-France", email: "sec.hdf@addfrance.fr" },
        { name: "Languedoc-Roussillon", email: "sec.languedoc@addfrance.fr" },
        { name: "Midi-Pyrénées", email: "sec.midipyrenees@addfrance.fr" },
        { name: "Normandie", email: "sec.normandie@addfrance.fr" },
        { name: "Provence-Alpes-Côte d’Azur-Corse", email: "sec.pacacorse@addfrance.fr" },
        { name: "Paris Île-de-France", email: "sec.parisidf@addfrance.fr" },
        { name: "Rhône-Alpes-Bourgogne", email: "sec.rab@addfrance.fr" },
        { name: "Val de Loire", email: "sec.valdeloire@addfrance.fr" },
      ],
    };
  },
  methods: {
    openLink(url) {
      Browser.open({ url }).catch(() => window.open(url, "_blank", "noopener,noreferrer"));
    },
    async copyIban() {
      const value = this.entraideIban.replace(/\s/g, "");
      try {
        await navigator.clipboard.writeText(value);
        this.copied = true;
        tapLight();
        this.$root.presentToast("IBAN copié", "success");
        setTimeout(() => (this.copied = false), 2000);
      } catch (e) {
        this.$root.presentToast("Copie impossible : sélectionnez l’IBAN à la main.", "warning");
      }
    },
  },
  setup() {
    return { openOutline, copyOutline, checkmarkOutline, mailOutline };
  },
};
</script>

<style scoped>
.fee-card {
  margin: 0 0 12px;
  padding: 16px;
  font-size: 1rem;
}

.fee-title {
  margin: 0 0 6px;
  font-size: 1.125rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--app-text);
}

.fee-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--app-text);
}

.tariffs {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--app-border);
}

.tariff {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--app-border);
}

.tariff-label {
  display: block;
  font-weight: 600;
  color: var(--app-text);
}

.tariff-detail {
  display: block;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}

.tariff-amount {
  font-size: 1.0625rem;
  color: var(--app-text);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.pay-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.pay-buttons ion-button {
  margin: 0;
  min-height: 48px;
  --border-radius: var(--app-radius-control);
  font-weight: 600;
}

.pay-note {
  margin: 10px 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--app-text-muted);
}

.iban {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 6px 10px 14px;
  border-radius: var(--app-radius-control);
  background: var(--app-accent-soft);
}

.iban-text {
  flex: 1;
  min-width: 0;
}

.iban-label {
  display: block;
  font-size: 0.8125rem;
  color: var(--app-text-muted);
}

.iban-value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--app-text);
  font-variant-numeric: tabular-nums;
  user-select: all;
  overflow-wrap: anywhere;
}

.copy-btn {
  --color: var(--ion-color-primary);
  min-width: 44px;
  min-height: 44px;
  margin: 0;
}

.region-hint {
  margin: -4px 4px 10px;
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--app-text-muted);
}

ion-label p {
  color: var(--app-text-muted);
}

.mail-icon {
  color: var(--ion-color-primary);
  font-size: 20px;
}
</style>
