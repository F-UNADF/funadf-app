<template>
  <ion-content @swipeleft="goBack()">
    <ion-card>
      <ion-card-header text-center>
        <h4 class="text-h5 font-weight-bold mb-4">
          <span v-if="meeting" class="text-grey text-h6">Rassemblement : {{ meeting.name }}<br></span>
          Structure : {{ structure.name }}<br>
          <small>Campagne : {{ campaign.name }}</small>
        </h4>
      </ion-card-header>

      <ion-card-content>
        <form ref="vote">
          <div class="motion ion-padding" v-for="result in this.editResult" :key="result.motion_id">
            <ion-label position="stacked" style="font-size: 1.2em; text-align: center;">
              {{ getMotionName(result.motion_id) }}
            </ion-label>


            <ion-list v-if="getMotionKind(result.motion_id) === 'neutral'">
              <ion-item v-for="choice in ['Oui', 'Non', 'Neutre']" v-bind:key="choice">
                <ion-checkbox @ion-change="updateResult(result, choice)" slot="start"
                  :checked="Array.isArray(result.vote) && result.vote.includes(choice)"
                  :disabled="Array.isArray(result.vote) && result.vote.length === result.max_choices && !result.vote.includes(choice)"></ion-checkbox>
                <ion-label>{{ choice }}</ion-label>
              </ion-item>
              <ion-item v-if="result.max_choices > 1">
                <ion-label color="warning">
                  Vous pouvez sélectionner jusqu'à {{ result.max_choices }} choix
                </ion-label>
              </ion-item>
            </ion-list>

            <ion-list v-if="getMotionKind(result.motion_id) === 'binary'">
              <ion-item v-for="choice in ['Oui', 'Non']" v-bind:key="choice">
                <ion-checkbox color="light" @ion-change="updateResult(result, choice)" slot="start"
                  :checked="Array.isArray(result.vote) && result.vote.includes(choice)"
                  :disabled="Array.isArray(result.vote) && result.vote.length === result.max_choices && !result.vote.includes(choice)"></ion-checkbox>
                <ion-label>{{ choice }}</ion-label>
              </ion-item>

              <ion-item v-if="result.max_choices > 1">
                <ion-label color="warning">
                  Vous pouvez sélectionner jusqu'à {{ result.max_choices }} choix
                </ion-label>
              </ion-item>
            </ion-list>

            <div v-if="getMotionKind(result.motion_id) === 'free'">
              <ion-item>
                <ion-input v-model="result.vote" placeholder="Reponse libre"></ion-input>
              </ion-item>
            </div>

            <ion-list v-if="getMotionKind(result.motion_id) === 'choices'">
              <ion-item v-for="choice in result.choices.split(',')" v-bind:key="choice">
                <ion-checkbox @ion-change="updateResult(result, choice)" slot="start"
                  :checked="Array.isArray(result.vote) && result.vote.includes(choice)"
                  :disabled="Array.isArray(result.vote) && result.vote.length === result.max_choices && !result.vote.includes(choice)"></ion-checkbox>
                <ion-label>{{ choice }}</ion-label>
              </ion-item>
            </ion-list>

            <p v-if="getMotionKind(result.motion_id) === 'choices' && result.max_choices > 1" style="margin-top: 15px">
              Vous pouvez sélectionner jusqu'à {{ result.max_choices }} choix
            </p>

            <p v-if="['binary', 'neutral', 'choices'].includes(getMotionKind(result.motion_id))"
              style="margin-top: 15px">
              Pour changer de vote, décochez d'abord votre choix précédent
            </p>
          </div>
        </form>

      </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-header text-center>
        <ion-card-title>Mes bulletins</ion-card-title>
      </ion-card-header>
      <ion-card-content v-if="this.present">
        <div v-for="voter in this.editVoters" :key="voter.resource_id">
          <ion-item v-if="voter.has_voted === null || voter.has_voted === 0">
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
      <ion-card-content color="warning" v-else>
        Vous n'êtes pas présent à ce rassemblement
      </ion-card-content>
    </ion-card>

    <ion-button class="ion-margin" expand="block" @click="goVote()">Valider</ion-button>

  </ion-content>
</template>


<script>

import { IonInput, IonItem, IonLabel, IonCheckbox, IonContent, IonCard, IonCardTitle, IonCardHeader, IonList, IonCardContent, IonButton } from '@ionic/vue';
import { mapGetters } from "vuex";

export default {
  name: "VoteShow",
  components: { IonInput, IonItem, IonLabel, IonCheckbox, IonContent, IonCard, IonCardTitle, IonCardHeader, IonList, IonCardContent, IonButton },
  computed: {
    ...mapGetters('votesStore', {
      campaign: 'getCampaign',
      user: 'getUser',
      motions: 'getMotions',
      results: 'getResults',
      voters: 'getVoters',
      token: 'getToken',
      meeting: 'getMeeting',
      structure: 'getStructure',
      present: 'getPresent',
    }),

  },
  methods: {
    goBack: function () {
      this.$router.go(-1);
    },
    goVote: function () {
      if (this.editVoters.some(voter => voter.selected === true) === false) {
        this.$root.presentToast('Merci de sélectionner au moins un bulletin !', 'danger');
        return;
      }

      if (!confirm('Êtes-vous sûr de vouloir valider votre vote ?')) {
        return;
      }

      this.$store.dispatch('votesStore/vote', { campaign_id: this.$route.params.campaign_id, results: this.editResult, voters: this.editVoters })
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
    updateResult: function (result, value) {
      // value should be in an array for result.vote
      // check if result.vote is an array

      if (Array.isArray(result.vote)) {
        let nbr_vote = result.vote.length;
        // check if value is already in result.vote
        if (result.vote.includes(value)) {
          // remove value from result.vote
          result.vote = result.vote.filter(item => item !== value);
          return false;
        } else {
          // add value to result.vote
          // if result.max_choices is defined, check if result.vote.length < result.max_choices

          if (nbr_vote === result.max_choices) {
            result.vote.shift();
          }
          result.vote.push(value);
          return true;
        }
      } else {
        // if result.vote is not an array, create an array with value
        result.vote = [value];
        return true;
      }
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
    this.$store.dispatch('sessionStore/fetchUser');

    if (this.user === null) {
      this.$router.push({ name: 'Login' });
    }

    this.$store.dispatch('votesStore/getCampaign', this.$route.params.campaign_id);
  },
};
</script>

<style>
ion-radio-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
}

ion-radio-group>ion-item {
  flex: 1;
}

ion-radio-group>ion-item.neutre {
  flex: 1 1;
}

ion-checkbox {
  --size: 32px;
  --background-checked: #015486;
}

ion-checkbox::part(container) {
  border-radius: 6px;
  border: 2px solid #015486;
}


@media (prefers-color-scheme: dark) {
  ion-checkbox {
    --background-checked: #f5f5f5;
  }

  ion-checkbox::part(container) {
    border: 2px solid #f5f5f5;
  }
}

ion-item {
  --border-color: transparent;
}


.motion {
  margin-bottom: 20px;
  border: solid 1px #015486;
  border-radius: 15px
}

@media (prefers-color-scheme: dark) {
  .motion {
    border: solid 1px #f5f5f5;
  }
}

.motion>.label-stacked {
  margin-bottom: 5px;
  display: block;
}
</style>