<template>
    <ion-content>
        <ion-item v-for="item in items" :key="item.id" href="#" @click="goVote(item.campaign_id)">
            <ion-label>{{ item.structure_name }} - {{ item.campaign_name }}</ion-label>
        </ion-item>
    </ion-content>
</template>

<script>

import { mapGetters } from "vuex";

export default {
    name: "VotesIndex",
    computed: {
        ...mapGetters({
            items: 'getItems',
            user: 'getUser',
        }),
    },
    methods: {
        goVote: function (campaign_id) {
            this.$router.push({ name: 'VoteShow', params: { campaign_id: campaign_id } });
        },
    },
    beforeCreate: function () {
        this.$store.dispatch('getConnectedUser');
        this.$store.dispatch('items');
    },
};
</script>
