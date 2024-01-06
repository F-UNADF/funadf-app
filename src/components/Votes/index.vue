<template>
    <ion-content>
        <ion-refresher slot="fixed" @ionRefresh="doRefresh">
            <ion-refresher-content pullingIcon="arrow-down" pullingText="Tirer pour actualiser" refreshingSpinner="crescent"
                refreshingText="Actualisation...">
            </ion-refresher-content>
        </ion-refresher>

        <ion-card v-if="items.length === 0">
            <ion-card-header>
                <ion-card-title>Aucun vote</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                <ion-button expand="block" @click="$router.push({ name: 'Home' })">Retour</ion-button>
            </ion-card-content>
        </ion-card>

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

export default {
    name: "VotesIndex",
    components: {},
    computed: {
        ...mapGetters({
            items: 'getItems',
            token: 'getToken',
            user: 'getUser',
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


        if (null === this.token || null === this.user) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>
