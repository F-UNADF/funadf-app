<template>
    <ion-page>
        <ion-header class="search-header">
            <ion-toolbar class="search-toolbar">
                <ion-searchbar class="directory-searchbar" animated placeholder="Ville, nom, code postal"
                    v-model="search" debounce="500" />
            </ion-toolbar>
        </ion-header>

        <ion-content class="search-content">
            <div class="search-shell">

                <div v-if="search.trim().length < 3" class="state-box">
                    <div class="state-title">Commence ta recherche</div>
                    <div class="state-text">Saisis au moins 3 caractères.</div>
                </div>

                <div v-else-if="loading" class="results-list">
                    <div v-for="n in 4" :key="n" class="result-card skeleton-card">
                        <ion-avatar class="result-avatar">
                            <ion-skeleton-text animated />
                        </ion-avatar>

                        <div class="result-body">
                            <ion-skeleton-text animated style="width: 70%; height: 16px;" />
                            <ion-skeleton-text animated style="width: 40%; height: 12px; margin-top: 8px;" />
                        </div>
                    </div>
                </div>

                <div v-else-if="results.length === 0" class="state-box">
                    <div class="state-title">Aucun résultat</div>
                    <div class="state-text">Essaie un autre nom, une ville ou un code postal.</div>
                </div>

                <div v-else class="results-list">
                    <div v-for="result in results" :key="`${result.model_type}-${result.id}`" class="result-card"
                        @click="goToResult(result)">
                        <ion-avatar class="result-avatar">
                            <img :src="result.photo_url || '/assets/avatar-placeholder.png'" :alt="result.name" />
                        </ion-avatar>

                        <div class="result-body">
                            <div class="result-name">{{ result.name }}</div>
                            <div class="result-subtitle">{{ result.model_type === 'users' ? 'Pasteur' :
                                result.model_type === 'churches' ? 'Église' : 'Association' }}</div>
                        </div>

                        <div class="result-chevron">›</div>
                    </div>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonContent,
    IonAvatar,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonSkeletonText,
} from '@ionic/vue';
import axios from 'axios';

export default {
    name: 'SearchIndex',
    components: {
        IonPage,
        IonContent,
        IonAvatar,
        IonSearchbar,
        IonHeader,
        IonToolbar,
        IonSkeletonText,
    },
    data() {
        return {
            search: '',
            results: [],
            loading: false,
            lastQuery: '',
        };
    },
    methods: {
        baseUrl() {
            return process.env.NODE_ENV === 'production'
                ? 'https://app.addfrance.fr'
                : 'http://localhost:3000';
        },

        goToResult(result) {
            this.$router.push(`/annuaire/${result.model_type}/${result.id}`);
        },

        async searchItems() {
            const query = (this.search || '').trim();

            if (query.length < 3) {
                this.results = [];
                this.loading = false;
                return;
            }

            sessionStorage.setItem('search', query);
            this.lastQuery = query;
            this.loading = true;

            try {
                const res = await axios.get(`${this.baseUrl()}/api/search`, {
                    params: { query },
                });

                if (this.lastQuery === query) {
                    this.results = Array.isArray(res.data) ? res.data : [];
                }
            } catch (e) {
                if (this.lastQuery === query) {
                    this.results = [];
                }
            } finally {
                if (this.lastQuery === query) {
                    this.loading = false;
                }
            }
        },
    },
    watch: {
        search() {
            this.searchItems();
        },
    },
    mounted() {
        this.search = sessionStorage.getItem('search') || '';

        if (this.search.trim().length >= 3) {
            this.searchItems();
        }
    },
};
</script>

<style scoped>
.search-header {
    box-shadow: none;
}

.search-toolbar {
    --background: var(--ion-background-color);
    --border-width: 0;
    padding: 8px 8px 0;
}

.directory-searchbar {
    --background: var(--ion-card-background);
    --color: var(--ion-text-color);
    --placeholder-color: var(--ion-color-step-500);
    --icon-color: var(--ion-color-step-500);
    --clear-button-color: var(--ion-color-step-500);
    --box-shadow: none;
    --border-radius: 16px;
}

.search-content {
    --background: var(--ion-background-color);
}

.search-shell {
    padding: 12px;
}

.results-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.result-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--ion-card-background);
    border: 1px solid var(--ion-color-border);
    border-radius: 18px;
    padding: 12px 14px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.result-card:active {
    transform: scale(0.99);
}

.result-avatar {
    width: 48px;
    height: 48px;
    flex: 0 0 auto;
}

.result-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.result-body {
    min-width: 0;
    flex: 1;
}

.result-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--ion-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.result-subtitle {
    margin-top: 4px;
    font-size: 12px;
    color: var(--ion-color-step-500);
}

.result-chevron {
    font-size: 24px;
    line-height: 1;
    color: var(--ion-color-step-400);
    flex: 0 0 auto;
}

.state-box {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--ion-color-step-500);
    text-align: center;
    padding: 24px;
}

.state-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ion-text-color);
}

.state-text {
    margin-top: 6px;
    font-size: 13px;
    max-width: 260px;
}

.skeleton-card {
    cursor: default;
}
</style>