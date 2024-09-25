<template>
    <ion-content>
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
                <ion-card-title>{{ item.name }}</ion-card-title>
                <ion-card-subtitle>{{ item.structure.name }}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
                <ion-button v-if="item.state === 'opened'" expand="block" @click="goVote(item)">
                    Voter !
                </ion-button>
                <ion-button v-else expand="block" disabled>Le vote n'a pas démarré</ion-button>
            </ion-card-content>
        </ion-card>
        <ion-button expand="block" @click="doRefresh()">Rafraichir la liste</ion-button>
    </ion-content>
</template>

<script>

import { mapGetters } from "vuex";
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/vue';

export default {
    name: "VotesIndex",
    components: { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton },
    computed: {
        ...mapGetters('votesStore', {
            items: 'getItems',
            token: 'getToken',
            user: 'getUser',
        }),
    },
    methods: {
        goVote: function (item) {
            this.$store.commit('votesStore/setItem', item);
            this.$store.dispatch('votesStore/getCampaign', item.id);
            this.$router.push({ name: 'VoteShow', params: { campaign_id: item.id } });
        },
        doRefresh: function () {
            this.$store.dispatch('votesStore/items');
        },
    },
    beforeCreate: function () {
        this.$store.dispatch('sessionStore/fetchUser');
        this.$store.dispatch('votesStore/items');


        if (null === this.token || null === this.user) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>
