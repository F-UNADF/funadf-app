<template>
    <ion-content>
        <ion-card color="primary">
            <ion-card-header>
                <div class="avatar">
                    <ion-img :src=getLogo alt="Avatar {{ church.name }}"></ion-img>
                </div>
                <ion-card-title>{{ church.name }}</ion-card-title>
                <ion-chip>
                    <i class="material-icons mr-3">account_box</i>
                    <ion-label>{{ church.id }}</ion-label>
                </ion-chip>
            </ion-card-header>
            <ion-list lines="full">
                <ion-item color="primary" v-if="!!church.email">
                    <i class="material-icons mr-3">mail</i>
                    <a href="mailto: {{ church.email }}" color="light">{{ church.email }}</a>
                </ion-item>
                <ion-item color="primary" v-if="!!church.phone">
                    <i class="material-icons mr-3">phone</i>
                    <a href="tel: {{ church.phone }}">{{ church.phone }}</a>
                </ion-item>
                <ion-item color="primary" v-if="!!church.town">
                    <i class="material-icons mr-3">location_on</i>
                    {{ church.town }}
                </ion-item>
            </ion-list>
        </ion-card>

        <ion-list class="profile-card">
            <ion-item v-if="getPresident"
                @click="$router.push({ name: 'searchShow', params: { id: getPresident.member_id, type: 'users' } })">
                <ion-avatar slot="start">
                    <img :src="getAvatar(getPresident.member_id)" :alt="getPresident.name" />
                </ion-avatar>
                <ion-label style="display: flex;" class="ion-align-items-center">
                    <i class="material-icons" style="margin-right: 10px;">{{ getPresident.icon }}</i>
                    Président : {{ getPresident.name }}
                </ion-label>
                <i class="material-icons" style="margin-left: 10px;">chevron_right</i>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script>

import { IonCard, IonCardTitle, IonList, IonChip, IonCardHeader, IonLabel, IonItem } from '@ionic/vue';

export default {
    name: "ChurcHShowComponent",
    components: { IonCard, IonCardTitle, IonList, IonChip, IonCardHeader, IonLabel, IonItem },
    props: {
        church: Object,
        members: Array,
    },
    computed: {
        getLogo() {
            let base_url = 'https://add-fnadf.fr';
            if (process.env.NODE_ENV === 'development') {
                base_url = 'http://myloc.me:3000';
            }
            return base_url + '/avatars/' + this.church.id + '.png';
        },
        getPresident() {
            return this.members.find(member => member.role_name === 'president');
        },
    },
    methods: {
        getAvatar(id) {
            let base_url = 'https://add-fnadf.fr';
            if (process.env.NODE_ENV === 'development') {
                base_url = 'http://myloc.me:3000';
            }
            return base_url + '/avatars/' + id + '.png';
        },
    },
};
</script>

<style scoped>
.avatar {
    text-align: center;
    min-height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar ion-img {
    display: block;
    width: 75%;
    margin: 0 auto 30px;
    border-radius: 100%;
    overflow: hidden;
    padding: 0;
}

a {
    color: #fff;
    text-decoration: none;
}

.mr-3 {
    margin-right: 10px;
}
</style>