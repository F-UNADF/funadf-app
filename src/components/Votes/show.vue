<template>
  <div class="app-screen vote-screen">
    <list-skeleton v-if="status === 'loading'" variant="row" :count="5" />

    <screen-state v-else-if="status === 'error'" kind="error" title="Impossible de charger ce vote" @action="load" />

    <template v-else>
      <header class="vote-header">
        <h1 class="app-title">{{ campaign.name }}</h1>
        <p class="app-subtitle">
          {{ structure && structure.name }}<template v-if="meeting && meeting.name"> — {{ meeting.name }}</template>
        </p>
        <p v-if="campaign.description" class="vote-description">{{ campaign.description }}</p>
      </header>

      <div v-if="!present" class="notice">
        <ion-icon :icon="alertCircleOutline" aria-hidden="true" />
        <p>Vous n’êtes pas inscrit comme présent à ce rassemblement : vous ne pouvez pas voter.</p>
      </div>

      <template v-else>
        <!-- Questions -->
        <section v-for="(result, index) in editResult" :key="result.motion_id" class="motion"
          :aria-labelledby="`motion-${result.motion_id}`">
          <p class="motion-step">Question {{ index + 1 }} sur {{ editResult.length }}</p>
          <h2 :id="`motion-${result.motion_id}`" class="motion-name">{{ motionOf(result).name }}</h2>

          <!-- Réponse libre -->
          <ion-list v-if="kindOf(result) === 'free'" class="app-inset-list">
            <ion-item>
              <ion-textarea v-model="result.vote" label="Votre réponse" label-placement="stacked" :auto-grow="true"
                placeholder="Écrivez votre réponse" enterkeyhint="done" />
            </ion-item>
          </ion-list>

          <!-- Un seul choix : boutons radio -->
          <ion-list v-else-if="maxOf(result) <= 1" class="app-inset-list">
            <ion-radio-group :value="firstVote(result)" :allow-empty-selection="true"
              @ionChange="setSingle(result, $event.detail.value)">
              <ion-item v-for="choice in choicesOf(result)" :key="choice">
                <ion-radio :value="choice" justify="space-between">{{ choice }}</ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>

          <!-- Plusieurs choix : cases à cocher -->
          <template v-else>
            <p class="motion-hint">Jusqu’à {{ maxOf(result) }} choix</p>
            <ion-list class="app-inset-list">
              <ion-item v-for="choice in choicesOf(result)" :key="choice">
                <ion-checkbox justify="space-between" :checked="isChecked(result, choice)"
                  :disabled="isFull(result) && !isChecked(result, choice)" @ionChange="toggle(result, choice)">
                  {{ choice }}
                </ion-checkbox>
              </ion-item>
            </ion-list>
          </template>
        </section>

        <!-- Bulletins -->
        <section class="motion">
          <h2 class="app-section-title ballots-title">Mes bulletins</h2>
          <p class="motion-hint">Cochez les bulletins avec lesquels vous votez.</p>
          <ion-list class="app-inset-list">
            <template v-for="voter in editVoters" :key="`${voter.resource_type}-${voter.resource_id}`">
              <ion-item v-if="!hasVoted(voter)">
                <ion-checkbox v-model="voter.selected" justify="space-between">
                  <span class="ballot-name">{{ voter.name }}</span>
                  <span class="ballot-kind">{{ voter.is_consultative ? 'Vote consultatif' : 'Vote comptabilisé' }}</span>
                </ion-checkbox>
              </ion-item>
              <ion-item v-else>
                <ion-label class="ion-text-wrap">
                  <span class="ballot-name">{{ voter.name }}</span>
                  <p>A déjà voté</p>
                </ion-label>
                <ion-icon slot="end" :icon="checkmarkCircle" color="success" aria-hidden="true" />
              </ion-item>
            </template>
          </ion-list>
        </section>

        <div class="app-action-bar">
          <ion-button expand="block" :disabled="sending || availableVoters.length === 0" @click="confirmVote">
            <ion-spinner v-if="sending" name="crescent" />
            <span v-else>{{ availableVoters.length === 0 ? 'Vous avez déjà voté' : 'Valider mon vote' }}</span>
          </ion-button>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSpinner,
  alertController,
} from "@ionic/vue";
import { alertCircleOutline, checkmarkCircle } from "ionicons/icons";
import { mapGetters } from "vuex";
import ScreenState from "../Common/ScreenState.vue";
import ListSkeleton from "../Common/ListSkeleton.vue";
import { success } from "@/utils/haptics";

const NEUTRAL = ["Oui", "Non", "Neutre"];
const BINARY = ["Oui", "Non"];

export default {
  name: "VoteShow",
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonButton,
    IonIcon,
    IonSpinner,
    ScreenState,
    ListSkeleton,
  },
  data() {
    return {
      status: "loading",
      sending: false,
      editResult: [],
      editVoters: [],
    };
  },
  computed: {
    ...mapGetters("votesStore", {
      campaign: "getCampaign",
      motions: "getMotions",
      results: "getResults",
      voters: "getVoters",
      meeting: "getMeeting",
      structure: "getStructure",
      present: "getPresent",
    }),
    availableVoters() {
      return this.editVoters.filter((v) => !this.hasVoted(v));
    },
  },
  methods: {
    async load() {
      this.status = "loading";
      try {
        await this.$store.dispatch("votesStore/getCampaign", this.$route.params.campaign_id);
        this.status = "ready";
      } catch (e) {
        this.status = "error";
      }
    },
    motionOf(result) {
      return (Array.isArray(this.motions) && this.motions.find((m) => m.id === result.motion_id)) || {};
    },
    kindOf(result) {
      return this.motionOf(result).kind;
    },
    maxOf(result) {
      return result.max_choices || 1;
    },
    choicesOf(result) {
      const kind = this.kindOf(result);
      if (kind === "neutral") return NEUTRAL;
      if (kind === "binary") return BINARY;
      return (result.choices || "").split(",").map((c) => c.trim()).filter(Boolean);
    },
    hasVoted(voter) {
      return !(voter.has_voted === null || voter.has_voted === 0 || voter.has_voted === undefined);
    },
    firstVote(result) {
      return Array.isArray(result.vote) ? result.vote[0] : undefined;
    },
    isChecked(result, choice) {
      return Array.isArray(result.vote) && result.vote.includes(choice);
    },
    isFull(result) {
      return Array.isArray(result.vote) && result.vote.length >= this.maxOf(result);
    },
    // Le serveur attend un tableau de choix (ou un texte pour une réponse libre)
    setSingle(result, value) {
      result.vote = value ? [value] : null;
    },
    toggle(result, choice) {
      const current = Array.isArray(result.vote) ? result.vote : [];
      if (current.includes(choice)) {
        result.vote = current.filter((c) => c !== choice);
      } else if (current.length < this.maxOf(result)) {
        result.vote = [...current, choice];
      }
    },
    isAnswered(result) {
      if (this.kindOf(result) === "free") return typeof result.vote === "string" && result.vote.trim() !== "";
      return Array.isArray(result.vote) && result.vote.length > 0;
    },
    async confirmVote() {
      const selected = this.editVoters.filter((v) => v.selected === true);
      if (selected.length === 0) {
        this.$root.presentToast("Cochez au moins un bulletin dans « Mes bulletins ».", "warning");
        return;
      }
      const unanswered = this.editResult.filter((r) => !this.isAnswered(r)).length;
      const ballots = selected.length > 1 ? `${selected.length} bulletins` : "1 bulletin";
      let message = `Vous votez avec ${ballots}. Un vote enregistré ne peut plus être modifié.`;
      if (unanswered > 0) {
        message = `${unanswered > 1 ? `${unanswered} questions sont restées` : "Une question est restée"} sans réponse. ${message}`;
      }

      const alert = await alertController.create({
        header: "Confirmer votre vote",
        message,
        buttons: [
          { text: "Annuler", role: "cancel" },
          { text: "Voter", role: "confirm" },
        ],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role === "confirm") this.sendVote();
    },
    async sendVote() {
      this.sending = true;
      try {
        await this.$store.dispatch("votesStore/vote", {
          campaign_id: this.$route.params.campaign_id,
          results: this.editResult,
          voters: this.editVoters,
        });
        success();
        this.$root.presentToast("Votre vote a été enregistré.", "success");
        this.$router.push({ name: "VotesIndex" });
      } catch (e) {
        this.$root.presentToast("Votre vote n’a pas été enregistré. Vérifiez votre connexion et réessayez.", "danger");
      } finally {
        this.sending = false;
      }
    },
  },
  watch: {
    results: {
      handler() {
        this.editResult = JSON.parse(JSON.stringify(this.results || []));
      },
      deep: true,
      immediate: true,
    },
    voters: {
      handler() {
        const list = Array.isArray(this.voters) ? JSON.parse(JSON.stringify(this.voters)) : [];
        list.forEach((voter) => {
          voter.selected = false;
        });
        // Un seul bulletin possible : il est coché d'office
        const open = list.filter((v) => !this.hasVoted(v));
        if (open.length === 1) open[0].selected = true;
        this.editVoters = list;
      },
      deep: true,
      immediate: true,
    },
  },
  setup() {
    return { alertCircleOutline, checkmarkCircle };
  },
  created() {
    if (null === localStorage.getItem("token")) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }
    this.load();
  },
};
</script>

<style scoped>
.vote-screen {
  padding-bottom: 0;
}

.vote-description {
  margin: 0 0 8px;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--app-text);
}

.notice {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: var(--app-radius-card);
  background: rgba(var(--ion-color-warning-rgb), 0.14);
  color: var(--app-text);
}

.notice ion-icon {
  flex: 0 0 auto;
  font-size: 22px;
  color: var(--ion-color-warning-shade);
}

.notice p {
  margin: 0;
  line-height: 1.45;
}

.motion {
  margin-top: 24px;
}

.motion-step {
  margin: 0 4px 2px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--app-text-muted);
}

.motion-name {
  margin: 0 4px 10px;
  font-size: 1.125rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--app-text);
}

.motion-hint {
  margin: -4px 4px 10px;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}

.ballots-title {
  margin-top: 0;
}

.app-inset-list ion-item {
  --min-height: 52px;
}

ion-radio,
ion-checkbox {
  width: 100%;
  font-size: 1rem;
}

.ballot-name {
  display: block;
  font-weight: 600;
}

.ballot-kind {
  display: block;
  margin-top: 2px;
  font-size: 0.8125rem;
  color: var(--app-text-muted);
}

ion-label p {
  color: var(--app-text-muted);
}

.app-action-bar {
  margin-top: 24px;
}

.app-action-bar ion-button {
  --border-radius: var(--app-radius-control);
  font-weight: 600;
}
</style>
