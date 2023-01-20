<template>
    <ion-content>
        <ion-card>
            <ion-card-content style="text-align: center;">
                <h1>Développement en cours</h1>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>

<script>

import { mapGetters } from "vuex";

export default {
    name: "UserShowComponent",
    computed: {
        ...mapGetters({
            user: 'getUser',
        }),
    },
    beforeCreate: function () {
        this.$store.dispatch('getConnectedUser');
    },
};
</script>
