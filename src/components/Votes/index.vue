<template>
    <ion-content>
        <ion-refresher slot="fixed" @ionRefresh="doRefresh">
            <ion-refresher-content pullingIcon="arrow-down" pullingText="Tirer pour actualiser" refreshingSpinner="crescent"
                refreshingText="Actualisation...">
            </ion-refresher-content>
        </ion-refresher>

        <ion-card v-for="item in items" :key="item.id">
            <ion-card-header>
                <ion-card-title>{{ item.campaign_name }}</ion-card-title>
                <ion-card-subtitle>{{ item.structure_name }}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
                <ion-button v-if="item.campaign_state === 'opened'" expand="block" @click="goVote(item)">Voter
                    !</ion-button>
                <ion-button v-else expand="block" disabled>Vote indisponible</ion-button>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>

<script>

import { mapGetters } from "vuex";
import { IonContent, IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

export default {
    name: "VotesIndex",
    components: { IonContent, IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent },
    computed: {
        ...mapGetters({
            items: 'getItems',
            user: 'getUser',
            token: 'getToken',
        }),
    },
    methods: {
        goVote: function (item) {
            this.$store.commit('setItem', item);
            this.$store.dispatch('getCampaign', item.campaign_id);
            this.$router.push({ name: 'VoteShow', params: { campaign_id: item.campaign_id } });
        },
        doRefresh: function (event) {
            this.$store.dispatch('items');
            event.detail.complete();
        },
    },
    beforeCreate: function () {
        this.$store.dispatch('getConnectedUser');
        this.$store.dispatch('items');

        if (null === token || null === this.user) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>
