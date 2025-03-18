<template>
    <ion-page>
        <ion-content>
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
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
            <ion-card color="transparent">
                <ion-button expand="block" @click="doRefresh()">Rafraichir la liste</ion-button>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script>

import { mapGetters } from "vuex";
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonRefresher, IonRefresherContent } from '@ionic/vue';

export default {
    name: "VotesIndex",
    components: { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonRefresher, IonRefresherContent },
    computed: {
        ...mapGetters('votesStore', {
            items: 'getItems',
            token: 'getToken',
            user: 'getUser',
        }),
    },
    methods: {
        handleRefresh: function (event) {
            this.$store.dispatch('votesStore/items').then(() => {
                setTimeout(() => {
                    event.detail.complete();
                }, 2000);
            });
        },
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
        if (null === localStorage.getItem('token')) {
            this.$router.push({ name: 'Login', replace: true });
        }
        this.$store.dispatch('sessionStore/fetchUser');
        this.$store.dispatch('votesStore/items');
    },
};
</script>
