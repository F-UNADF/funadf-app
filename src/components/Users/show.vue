<template>
    <ion-card class="ion-margin-bottom">

        <div class="avatar">
            <ion-img :src=getAvatar :alt="'Avatar' + user.lastname + ' ' + user.firstname"></ion-img>
        </div>

        <ion-card-title class="ion-text-center ion-margin-bottom">
            {{ user.lastname }} {{ user.firstname }}
        </ion-card-title>


        <ion-grid>
            <ion-row class="ion-justify-content-center">
                <ion-col size="4">
                    <ion-chip color="primary">
                        <ion-icon :icon="idCard"></ion-icon>
                        <ion-label>{{ getUserId(user.id) }}</ion-label>
                    </ion-chip>
                </ion-col>
                <ion-col size="8">
                    <ion-chip color="primary">
                        <ion-icon :icon="bookmark"></ion-icon>
                        <ion-label>{{ user.level }}</ion-label>
                    </ion-chip>
                </ion-col>
            </ion-row>
        </ion-grid>


        <ion-list lines="full">
            <ion-item v-if="!!user.email">
                <ion-icon slot="start" :icon="mail"></ion-icon>
                <ion-button fill="clear" :href="'mailto:' + user.email">
                    {{ user.email }}
                </ion-button>
            </ion-item>
            <ion-item v-if="!!user.phone_1">
                <ion-icon slot="start" :icon="call"></ion-icon>
                <ion-button fill="clear" :href="'tel:' + user.phone_1">
                    {{ user.phone_1 }}
                </ion-button>
            </ion-item>
            <ion-item v-if="!!user.town">
                <ion-icon slot="start" :icon="location"></ion-icon>
                {{ user.town }}
            </ion-item>
        </ion-list>
    </ion-card>

    <ion-card v-if="!!church">
        <!-- STRUCUTRE -->
        <ion-card-header>
            <ion-card-title>{{ church.name }}</ion-card-title>
        </ion-card-header>
        <ion-list lines="full">
            <ion-item>
                <ion-icon slot="start" :icon="location"></ion-icon>
                {{ church.town }}
            </ion-item>
            <ion-item v-if="!!church.email">
                <ion-icon slot="start" :icon="mail"></ion-icon>
                <ion-button fill="clear" :href="'mailto:' + church.email">
                    {{ church.email }}
                </ion-button>
            </ion-item>

            <ion-item v-if="!!church.phone_1">
                <ion-icon slot="start" :icon="call"></ion-icon>
                <ion-button fill="clear" :href="'tel:' + church.phone_1">
                    {{ church.phone_1 }}
                </ion-button>
            </ion-item>
        </ion-list>
    </ion-card>

    <ion-fab v-if="this.canEdit === true" slot="fixed" vertical="bottom" horizontal="end"
        @click="this.$router.push('user/edit');">
        <ion-fab-button color="danger">
            <i class="material-icons">edit</i>
        </ion-fab-button>
    </ion-fab>
</template>

<script>
import { IonCard, IonCardHeader, IonCardTitle, IonChip, IonImg, IonLabel, IonList, IonItem, IonFab, IonFabButton, IonRow, IonCol, IonGrid, IonButton, IonIcon } from '@ionic/vue';
import { mail, call, location, idCard, bookmark } from 'ionicons/icons';

export default {
    name: "UserShowComponent",
    components: {
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonChip,
        IonImg,
        IonList,
        IonItem,
        IonLabel,
        IonFab,
        IonRow,
        IonFabButton,
        IonCol,
        IonGrid,
        IonButton,
        IonIcon
    },
    props: {
        user: Object,
        church: Object,
        canEdit: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        getAvatar() {
            let base_url =
                process.env.NODE_ENV === "production"
                    ? "https://add-fnadf.fr"
                    : "http://app.localhost:3000";

            let user_id = this.user.id;
            return base_url + '/avatars/' + user_id + '.png' + '?cache=' + new Date().getTime();
        },
    },
    methods: {
        getUserId(id) {
            return id.toString().padStart(5, '0');
        }
    },
    setup() {
        return { mail, call, location, idCard, bookmark };
    }
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
</style>