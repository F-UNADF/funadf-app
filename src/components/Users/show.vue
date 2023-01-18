<template>
    <ion-card color="primary">
        <ion-card-header>
            <div class="avatar">
                <img :src=user.avatar alt="Avatar User">
            </div>
            <ion-card-title>{{ user.fullname }}</ion-card-title>
            <ion-chip>
                <i class="material-icons">account_box</i>
                <ion-label>{{ user.id }}</ion-label>
            </ion-chip>
            <ion-chip><i class="material-icons">bookmark</i>
                <ion-label>{{ user.level }}</ion-label>
            </ion-chip>
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                    <ion-chip>
                        <i class="material-icons">mail</i>
                        <ion-label>
                            <a href="mailto: {{ user.email }}">{{ user.email }}</a>
                        </ion-label>
                    </ion-chip>
                </ion-item>
                <ion-item>
                    <ion-chip>
                        <i class="material-icons">phone</i>
                        <ion-label>
                            <a href="tel: {{ user.phone }}">{{ user.phone }}</a>
                        </ion-label>
                    </ion-chip>
                </ion-item>
                <ion-item>
                    <ion-chip>
                        <i class="material-icons">location_on</i>
                        <ion-label>
                            {{ user.town }}
                        </ion-label>
                    </ion-chip>
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>

    <ion-card color="secondary">
        <!-- STRUCUTRE -->
        <ion-card-header>
            <ion-card-subtitle>
                <i class="material-icons">location_on</i> {{ church.town }}
            </ion-card-subtitle>
            <ion-card-title>{{ church.name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-item>
                {{ church.address_1 }}<br>
                {{ church.zipcode }} {{ church.town }}
            </ion-item>
            <ion-item v-if="(church.email)">
                <ion-label class="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated"><a
                        href="mailto: {{ church.email }}">{{ church.email }}</a></ion-label>
            </ion-item>
            <ion-item v-if="(church.phone)">
                <ion-label><a href="tel: {{ church.phone }}">{{ church.phone }}</a></ion-label>
            </ion-item>
        </ion-card-content>
    </ion-card>
</template>

<script>

import { mapGetters } from "vuex";
import sessionStore from "@/store/modules/sessionStore";
import { IonCardHeader, IonCardSubtitle, IonLabel, IonItem, IonCard } from '@ionic/vue';

export default {
    name: "UserShowComponent",
    components: { IonCardSubtitle, IonCardHeader, IonLabel, IonItem, IonCard },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
            church: 'getChurch',
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
.avatar img {
    display: block;
    width: 75%;
    margin: 0 auto 30px;
    border-radius: 100%;
    overflow: hidden;
    padding: 0;
}
</style>