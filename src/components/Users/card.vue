<template>
    <ion-card>
        Afficher un QR CODE
    </ion-card>
</template>

<script>

import {mapGetters} from "vuex";
import sessionStore from "@/store/modules/sessionStore";
import { IonCard } from '@ionic/vue';

export default {
    name: "UserCardComponent",
    components: { IonCard },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
        }),
    },
    beforeCreate: function () {
        if (!this.$store.hasModule('sessionStore')) {
            this.$store.registerModule('sessionStore', sessionStore);
            this.$store.dispatch('sessionStore/getConnectedUser');
        }
    },
};
</script>

<style scoped>
</style>