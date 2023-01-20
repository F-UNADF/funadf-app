<template>
    <ion-card color="primary">
        <ion-card-content>
            <qrcode-vue :value="user.passphrase" size="300" render-as="svg" class="qrcode"></qrcode-vue>
        </ion-card-content>
        <ion-card-header style="text-align: center;">
            <ion-card-title>{{ user.fullname }}</ion-card-title>
            <hr />
            <ion-chip>
                <i class="material-icons">account_box</i>
                <ion-label>{{ user.id }}</ion-label>
            </ion-chip>
            <ion-chip><i class="material-icons">bookmark</i>
                <ion-label>{{ user.level }}</ion-label>
            </ion-chip>
        </ion-card-header>
    </ion-card>
</template>

<script>

import { mapGetters } from "vuex";
import { IonCard } from '@ionic/vue';
import QrcodeVue from 'qrcode.vue'

export default {
    name: "UserCardComponent",
    components: { IonCard, QrcodeVue },
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

<style scoped>
.qrcode {
    max-width: 100%;
    margin: 10px auto;
    display: block;
}
</style>