<template>
    <ion-card color="primary">
        <ion-card-content>
            <qrcode-vue :value="user.passphrase" size="300" render-as="svg" class="qrcode"></qrcode-vue>

            <ion-row class="ion-justify-content-center">
                <ion-col v-for="(year, index) in years" :key="index">
                    <ion-chip :color="getChipColor(year)">
                        <i class="material-icons">{{ getChipIcon(year) }}</i>
                        {{ year }}
                    </ion-chip>
                </ion-col>
            </ion-row>

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
            fees: 'getFees',
        }),
    },
    methods: {
        hasFeeForYear(year) {
            console.log(year);

            return this.fees.filter(fee => fee.what === year.toString()).length > 0;
        },
        getChipColor(year) {
            return this.hasFeeForYear(year) ? 'success' : 'danger';
        },
        getChipIcon(year) {
            return this.hasFeeForYear(year) ? 'done' : 'close';
        },
    },
    beforeCreate: function () {
        this.$store.dispatch('getConnectedUser');
    },
    data() {
        let years = [];
        let currentYear = new Date().getFullYear();
        for (let i = 0; i < 6; i++) {
            years.push(currentYear - i);
        }
        return {
            years: years,
        }
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