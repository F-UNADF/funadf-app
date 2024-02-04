<template>
    <ion-card color="primary">
        <ion-card-header>
            <div class="avatar">
                <ion-img :src=getAvatar alt="Avatar {{ association.name }}"></ion-img>
            </div>
            <ion-card-title>{{ association.name }}</ion-card-title>
            <ion-chip>
                <i class="material-icons mr-3">account_box</i>
                <ion-label>{{ association.id }}</ion-label>
            </ion-chip>
        </ion-card-header>
        <ion-list lines="full">
            <ion-item color="primary" v-if="!!association.email">
                <i class="material-icons mr-3">mail</i>
                <a href="mailto: {{ association.email }}" color="light">{{ association.email }}</a>
            </ion-item>
            <ion-item color="primary" v-if="!!association.phone">
                <i class="material-icons mr-3">phone</i>
                <a href="tel: {{ association.phone }}">{{ association.phone }}</a>
            </ion-item>
            <ion-item color="primary" v-if="!!association.town">
                <i class="material-icons mr-3">location_on</i>
                {{ association.town }}
            </ion-item>
        </ion-list>
    </ion-card>
</template>

<script>

import { IonCard, IonCardTitle, IonList, IonChip, IonCardHeader, IonLabel, IonItem } from '@ionic/vue';

export default {
    name: "AssociationShowComponent",
    components: { IonCard, IonCardTitle, IonList, IonChip, IonCardHeader, IonLabel, IonItem },
    props: {
        association: Object,
    },
    computed: {
        getAvatar() {
            let base_url = 'https://add-fnadf.fr';
            if (process.env.NODE_ENV === 'development') {
                base_url = 'http://myloc.me:3000';
            }
            return base_url + '/logos/' + this.association.id + '.png';
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