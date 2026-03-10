<template>
    <div class="user-show-content">
        <ion-card class="user-card ion-margin-bottom">
            <div class="avatar">
                <img class="avatar-img" :src="avatarUrl" :alt="`Avatar ${user.lastname} ${user.firstname}`" />
            </div>

            <ion-card-title class="ion-text-center ion-margin-bottom user-title">
                {{ user.lastname }} {{ user.firstname }}
            </ion-card-title>

            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col size="4">
                        <ion-chip color="primary" class="info-chip">
                            <ion-icon :icon="idCard" />
                            <ion-label>{{ getUserId(user.id) }}</ion-label>
                        </ion-chip>
                    </ion-col>

                    <ion-col size="8">
                        <ion-chip color="primary" class="info-chip">
                            <ion-icon :icon="bookmark" />
                            <ion-label>{{ user.level }}</ion-label>
                        </ion-chip>
                    </ion-col>
                </ion-row>
            </ion-grid>

            <ion-list lines="full">
                <ion-item v-if="user.email">
                    <ion-icon slot="start" :icon="mail" />
                    <a :href="`mailto:${user.email}`">{{ user.email }}</a>
                </ion-item>

                <ion-item v-if="user.phone_1">
                    <ion-icon slot="start" :icon="call" />
                    <a :href="`tel:${user.phone_1}`">{{ user.phone_1 }}</a>
                </ion-item>

                <ion-item v-if="user.town">
                    <ion-icon slot="start" :icon="location" />
                    {{ user.town }}
                </ion-item>
            </ion-list>
        </ion-card>

        <ion-card v-if="church" class="church-card">
            <ion-card-header>
                <ion-card-title>{{ church.name }}</ion-card-title>
            </ion-card-header>

            <ion-list lines="full">
                <ion-item v-if="church.town">
                    <ion-icon slot="start" :icon="location" />
                    {{ church.town }}
                </ion-item>

                <ion-item v-if="church.email">
                    <ion-icon slot="start" :icon="mail" />
                    <a :href="`mailto:${church.email}`">{{ church.email }}</a>
                </ion-item>

                <ion-item v-if="church.phone_1">
                    <ion-icon slot="start" :icon="call" />
                    <a :href="`tel:${church.phone_1}`">{{ church.phone_1 }}</a>
                </ion-item>
            </ion-list>
        </ion-card>

        <ion-fab v-if="canEdit" slot="fixed" vertical="bottom" horizontal="end" @click="goToEdit">
            <ion-fab-button color="danger">
                <i class="material-icons">edit</i>
            </ion-fab-button>
        </ion-fab>
    </div>
</template>

<script>
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonLabel,
    IonList,
    IonItem,
    IonFab,
    IonFabButton,
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
} from '@ionic/vue';
import { mail, call, location, idCard, bookmark } from 'ionicons/icons';

export default {
    name: 'UserShowComponent',
    components: {
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonChip,
        IonList,
        IonItem,
        IonLabel,
        IonFab,
        IonFabButton,
        IonRow,
        IonCol,
        IonGrid,
        IonIcon,
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
        church: {
            type: Object,
            default: null,
        },
        canEdit: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            avatarCacheKey: 'v1',
        };
    },
    computed: {
        avatarUrl() {
            const baseUrl =
                process.env.NODE_ENV === 'production'
                    ? 'https://app.addfrance.fr'
                    : 'http://localhost:3000';

            return `${baseUrl}/avatars/${this.user.id}.png?cache=${this.avatarCacheKey}`;
        },
    },
    methods: {
        getUserId(id) {
            return String(id).padStart(5, '0');
        },
        goToEdit() {
            this.$router.push('/user/edit');
        },
    },
    setup() {
        return { mail, call, location, idCard, bookmark };
    },
};
</script>

<style scoped>
.user-show-content {
    --background: var(--ion-background-color);
}

.user-card,
.church-card {
    background: var(--ion-card-background);
}

.avatar {
    text-align: center;
    min-height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
}

.avatar-img {
    display: block;
    width: 140px;
    height: 140px;
    object-fit: cover;
    margin: 0 auto 20px;
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid var(--ion-color-border);
    background: var(--ion-card-background);
}

.user-title {
    color: var(--ion-text-color);
}

.info-chip {
    width: 100%;
    justify-content: center;
}

a {
    color: var(--ion-color-primary);
    text-decoration: none;
}
</style>