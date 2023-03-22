<template>
  <ion-content @swipeleft="goBack()">
    <ion-card>
      <ion-card-header text-center>
        <ion-card-title>{{ campaign.name }}</ion-card-title>
        <h3>Bulletin de vote :</h3>
      </ion-card-header>

      <ion-card-content>
        <form ref="vote">
          <div v-for="result in this.editResult" :key="result.motion_id">
            <ion-label position="stacked">
              {{ getMotionName(result.motion_id) }}
            </ion-label>

            <div v-if="getMotionKind(result.motion_id) === 'neutral'">
              <ion-radio-group v-model="result.vote">
                <ion-item>
                  <ion-label>Oui</ion-label>
                  <ion-radio value="Oui"></ion-radio>
                </ion-item>
                <ion-item>
                  <ion-label>Non</ion-label>
                  <ion-radio value="Non"></ion-radio>
                </ion-item>
                <ion-item class="neutre">
                  <ion-label>Neutre</ion-label>
                  <ion-radio value="Neutre"></ion-radio>
                </ion-item>
              </ion-radio-group>
            </div>

            <div v-if="getMotionKind(result.motion_id) === 'binary'">
              <ion-radio-group v-model="result.vote">
                <ion-item>
                  <ion-label>Oui</ion-label>
                  <ion-radio value="Oui"></ion-radio>
                </ion-item>
                <ion-item>
                  <ion-label>Non</ion-label>
                  <ion-radio value="Non"></ion-radio>
                </ion-item>
              </ion-radio-group>
            </div>

            <div v-if="getMotionKind(result.motion_id) === 'free'">
              <ion-item>
                <ion-input v-model="result.vote" placeholder="Reponse libre"></ion-input>
              </ion-item>
            </div>
          </div>
        </form>

      </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-header text-center>
        <ion-card-title>Mes bulletins</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div v-for="voter in this.editVoters" :key="voter.resource_id">
          <ion-item v-if="voter.has_voted === 0">
            <ion-checkbox slot="start" v-model="voter.selected"></ion-checkbox>
            <ion-label>
              {{ voter.name }}
              <small v-if="!voter.is_consultative">(Vote comptabilisé)</small>
              <small v-if="voter.is_consultative">(Vote consultatif)</small>
            </ion-label>
          </ion-item>
          <ion-item v-else>
            <ion-label color="warning">
              <b>{{ voter.name }}</b> a déjà voté
            </ion-label>
          </ion-item>
        </div>
      </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-content>
        <ion-button expand="block" @click="goVote()">Valider</ion-button>
      </ion-card-content>
    </ion-card>
  </ion-content>
</template>


<script>

import { IonInput, IonItem, IonLabel, IonRadioGroup, IonRadio, IonCheckbox } from '@ionic/vue';
import { mapGetters } from "vuex";

export default {
  name: "VoteShow",
  components: { IonInput, IonItem, IonLabel, IonRadioGroup, IonRadio, IonCheckbox },
  computed: {
    ...mapGetters({
      campaign: 'getCampaign',
      user: 'getUser',
      motions: 'getMotions',
      results: 'getResults',
      voters: 'getVoters',
      token: 'getToken',
    }),

  },
  methods: {
    goBack: function () {
      this.$router.go(-1);
    },
    goVote: function () {
      console.log(this.editResult);

      if (this.editVoters.some(voter => voter.selected === true) === false) {
        this.$root.presentToast('Merci de sélectionner au moins un bulletin !', 'warning');
        return;
      }


      this.$store.dispatch('vote', { campaign_id: this.$route.params.campaign_id, results: this.editResult, voters: this.editVoters })
        .then(() => {
          this.$root.presentToast('Votre vote a été pris en compte !');
          this.$router.push({ name: 'VotesIndex' });
        })
    },
    getMotionName: function (motion_id) {
      return this.motions.find(motion => motion.id === motion_id).name;
    },
    getMotionKind: function (motion_id) {
      return this.motions.find(motion => motion.id === motion_id).kind;
    },
  },
  watch: {
    results: {
      handler: function () {
        this.editResult = [];
        this.editResult = JSON.parse(JSON.stringify(this.results));
      },
      deep: true,
    },
    voters: {
      handler: function () {
        this.editVoters = [];
        this.editVoters = JSON.parse(JSON.stringify(this.voters));
        this.editVoters.forEach(voter => {
          voter.selected = false;
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      editResult: [],
      editVoters: [],
    };
  },
  beforeCreate: function () {
    this.$store.dispatch('getConnectedUser');
    this.$store.dispatch('getCampaign', this.$route.params.campaign_id);

    if (null === token || null === this.user) {
      this.$router.push({ name: 'Login', replace: true });
    }
  },
};
</script>

<style>
ion-radio-group {
  display: flex;
  flex-direction: row;
  justify-content: start;
  flex-wrap: wrap;
}

ion-radio-group>ion-item {
  flex: 1;
}

ion-radio-group>ion-item.neutre {
  flex: 1 1;
}
</style>