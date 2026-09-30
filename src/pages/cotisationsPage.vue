<template>
  <ion-page>
    <ion-content fullscreen class="cotisations-page">
      <div class="hero">
        <div class="hero-overlay">
          <p class="hero-kicker">Assemblées de Dieu</p>
          <h1>Cotisations annuelles</h1>
          <p class="hero-text">
            Cette page centralise toutes les informations relatives aux cotisations annuelles
            au sein des Assemblées de Dieu.
          </p>
        </div>
      </div>

      <div class="page-container">
        <ion-card class="glass-card">
          <ion-card-header>
            <ion-card-subtitle>UNADF</ion-card-subtitle>
            <ion-card-title>
              Cotisations nationales des associations cultuelles
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p class="section-text">
              La cotisation nationale est calculée à raison de
              <strong>13,50 € par PAFRC</strong>
              <span class="muted">(personne adulte fréquentant régulièrement le culte)</span>.
            </p>

            <div class="info-block">
              <h3>Modes de règlement</h3>

              <div class="payment-box">
                <div class="payment-row">
                  <span class="payment-label">Virement bancaire</span>
                  <span class="payment-value">via le RIB ci-dessous</span>
                </div>

                <div class="payment-row payment-links">
                  <span class="payment-label">HelloAsso</span>
                  <div class="button-group">
                    <ion-button fill="solid" color="primary" size="default" @click="openLink(links.national2025)">
                      Cotisation 2025
                    </ion-button>

                    <ion-button fill="solid" color="primary" size="default" @click="openLink(links.national2026)">
                      Cotisation 2026
                    </ion-button>
                  </div>
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="glass-card">
          <ion-card-header>
            <ion-card-subtitle>Églises</ion-card-subtitle>
            <ion-card-title>Cotisations régionales</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p class="section-text">
              Le montant de ces cotisations varie selon la région où se situe votre assemblée.
            </p>

            <p class="section-text">
              Pour toute information complémentaire, veuillez contacter le trésorier de votre région :
            </p>

            <div class="region-grid">
              <div v-for="region in regions" :key="region" class="region-chip">
                <a :href="`mailto:${region.email}`" class="region-link">
                  {{ region.name }}
                </a>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="glass-card">
          <ion-card-header>
            <ion-card-subtitle>Pasteurs</ion-card-subtitle>
            <ion-card-title>Cotisations pastorales</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p class="section-text">
              Les cotisations pastorales à l’UNADF sont
              <strong>obligatoires</strong>
              et ouvrent droit au vote pour l’année en cours.
            </p>

            <div class="tarif-list">
              <div class="tarif-item">
                <div>
                  <h3>Pasteurs reconnus</h3>
                  <p>AEM et APE</p>
                </div>
                <strong>30 €</strong>
              </div>

              <div class="tarif-item">
                <div>
                  <h3>Pasteurs en formation</h3>
                  <p>Stagiaires, PP1, PP2</p>
                </div>
                <strong>25 €</strong>
              </div>

              <div class="tarif-item">
                <div>
                  <h3>Pasteurs retraités</h3>
                  <p>Jusqu’à 80 ans</p>
                </div>
                <strong>15 €</strong>
              </div>
            </div>

            <div class="button-group button-group-spaced">
              <ion-button fill="solid" color="primary" @click="openLink(links.pastoral2025)">
                Cotisation 2025
              </ion-button>

              <ion-button fill="solid" color="primary" @click="openLink(links.pastoral2026)">
                Cotisation 2026
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="glass-card highlight-card">
          <ion-card-header>
            <ion-card-subtitle>Soutien fraternel</ion-card-subtitle>
            <ion-card-title>Cotisation à l’entraide pastorale</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p class="section-text">
              Cette cotisation, d’un montant de <strong>50 € par an</strong>,
              contribue au soutien des familles pastorales traversant des difficultés.
            </p>

            <div class="rib-box">
              <span class="rib-label">Virement bancaire</span>
              <code class="rib-value">{{ entraideIban }}</code>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  name: "CotisationsPage"
}
</script>

<script setup>
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from '@ionic/vue';

const links = {
  national2025: 'https://tinyurl.com/mrcrawxu',
  national2026: 'https://tinyurl.com/3eemmunb',
  pastoral2025: 'https://tinyurl.com/f6779xpf',
  pastoral2026: 'https://tinyurl.com/338u452x',
};

const entraideIban = 'FR76 1027 8079 4900 0204 7510 123';

const regions = [
  {
    name: 'Aquitaine',
    email: 'sec.aquitaine@addfrance.fr',
  },
  {
    name: 'Bretagne',
    email: 'sec.bretagne@addfrance.fr',
  },
  {
    name: 'Centre',
    email: 'sec.centre@addfrance.fr',
  },
  {
    name: 'Grand-Est',
    email: 'sec.est@addfrance.fr',
  },
  {
    name: 'Hauts-de-France',
    email: 'sec.hdf@addfrance.fr',
  },
  {
    name: 'Languedoc-Roussillon',
    email: 'sec.languedoc@addfrance.fr',
  },
  {
    name: 'Midi-Pyrénées',
    email: 'sec.midipyrenees@addfrance.fr',
  },
  {
    name: 'Normandie',
    email: 'sec.normandie@addfrance.fr',
  },
  {
    name: 'Provence-Alpes-Côte d’Azur-Corse',
    email: 'sec.pacacorse@addfrance.fr',
  },
  {
    name: 'Paris Île-de-France',
    email: 'sec.parisidf@addfrance.fr',
  },
  {
    name: 'Rhône-Alpes-Bourgogne',
    email: 'sec.rab@addfrance.fr',
  },
  {
    name: 'Val de Loire',
    email: 'sec.valdeloire@addfrance.fr',
  },
];

function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 260px;
  display: flex;
  align-items: flex-end;
  background: var(--app-brand-gradient);
  padding: 24px 20px;
  color: white;
}

.hero-overlay {
  max-width: 760px;
}

.hero-kicker {
  margin: 0 0 6px;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.hero h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
}

.hero-text {
  margin-top: 12px;
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.95;
}

.page-container {
  padding: 18px 14px 32px;
  max-width: 980px;
  margin: 0 auto;
}

.glass-card {
  margin: 0 0 18px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
}

.section-text {
  margin: 0 0 14px;
  line-height: 1.65;
  font-size: 0.98rem;
}

.muted {
  color: #64748b;
}

.info-block h3 {
  margin: 0 0 12px;
  font-size: 1rem;
}

.payment-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border-radius: 18px;
}

.payment-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-label {
  font-size: 0.92rem;
  font-weight: 700;
}

.payment-value {
  font-size: 0.95rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button-group-spaced {
  margin-top: 18px;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.region-chip {
  padding: 12px 14px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
}

.region-link {
  color: var(--ion-color-primary);
  text-decoration: none;
  cursor: pointer;

  padding: 10px 12px;
  display: block;

  border-radius: 14px;
  transition: background-color 0.2s;

  border: 1px solid var(--ion-color-primary);
  text-align: center;
}

.tarif-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.tarif-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 18px;
}

.tarif-item h3 {
  margin: 0 0 4px;
  font-size: 0.98rem;
}

.tarif-item p {
  margin: 0;
  font-size: 0.9rem;
}

.tarif-item strong {
  white-space: nowrap;
  font-size: 1.05rem;
}

.rib-box {
  margin-top: 14px;
  padding: 16px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rib-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.rib-value {
  font-size: 0.98rem;
  line-height: 1.6;
  word-break: break-word;
  white-space: normal;
}

@media (min-width: 768px) {
  .hero {
    min-height: 320px;
    padding: 32px 28px;
  }

  .hero h1 {
    font-size: 2.6rem;
  }

  .hero-text {
    font-size: 1.06rem;
    max-width: 720px;
  }

  .page-container {
    padding: 24px 20px 40px;
  }
}
</style>