<template>
    <ion-content>
        <user-show :user="this.user" :church="this.church"></user-show>
    </ion-content>
</template>

<script>

import { mapGetters } from "vuex";
import UserShow from '@/components/Users/show.vue';

export default {
    name: "HomePage",
    components: { UserShow },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
            church: 'getChurch',
            token: 'getToken',
        }),
    },
    beforeCreate: function () {
        this.$store.dispatch('sessionStore/getConnectedUser');

        if (null === this.token || null === this.user) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>

<style scoped></style>