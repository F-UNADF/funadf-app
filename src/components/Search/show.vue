<template>
  <div class="app-screen">
    <div v-if="status === 'loading'" class="loading-head" aria-busy="true" aria-label="Chargement de la fiche">
      <ion-skeleton-text animated class="sk-avatar" />
      <ion-skeleton-text animated style="width: 55%; height: 22px; margin: 16px auto 0" />
      <ion-skeleton-text animated style="width: 30%; height: 14px; margin: 10px auto 24px" />
      <list-skeleton variant="row" :count="3" />
    </div>

    <screen-state v-else-if="status === 'error'" kind="error" title="Impossible d’afficher cette fiche"
      @action="getItem" />

    <template v-else>
      <user-show v-if="searchedUser" :user="searchedUser" :church="searchedChurch" :canEdit="false" />
      <church-show v-else-if="searchedChurch" :church="searchedChurch" :members="structureMembers || []" />
      <association-show v-else-if="searchedAssociation" :association="searchedAssociation"
        :members="structureMembers || []" />
    </template>
  </div>
</template>

<script>
import { IonSkeletonText } from "@ionic/vue";
import axios from "axios";
import UserShow from "@/components/Users/show.vue";
import ChurchShow from "@/components/Churches/show.vue";
import AssociationShow from "@/components/Associations/show.vue";
import ScreenState from "@/components/Common/ScreenState.vue";
import ListSkeleton from "@/components/Common/ListSkeleton.vue";
import { BASE_URL } from "@/utils/format";

export default {
  name: "SearchShow",
  components: { IonSkeletonText, UserShow, ChurchShow, AssociationShow, ScreenState, ListSkeleton },
  data() {
    return {
      status: "loading",
      searchedUser: null,
      searchedChurch: null,
      searchedAssociation: null,
      structureMembers: null,
    };
  },
  methods: {
    async getItem() {
      const { type, id } = this.$route.params;
      if (!type || !id) return;
      this.status = "loading";
      try {
        const res = await axios.get(`${BASE_URL}/api/${type.toLowerCase()}/${id}`);
        this.searchedUser = res.data.user || null;
        if (this.searchedUser) {
          this.searchedUser.gratitudes = res.data.gratitudes;
        }
        this.searchedChurch = res.data.church || null;
        this.searchedAssociation = res.data.association || null;
        this.structureMembers = res.data.members || [];
        this.status = "ready";
      } catch (e) {
        this.status = "error";
      }
    },
  },
  created() {
    if (null === localStorage.getItem("token")) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }
    this.getItem();
  },
  watch: {
    "$route.params": {
      handler(params, old) {
        if (this.$route.name === "SearchShow" && old && (params.id !== old.id || params.type !== old.type)) {
          this.getItem();
        }
      },
    },
  },
};
</script>

<style scoped>
.loading-head {
  padding-top: 24px;
  text-align: center;
}

.sk-avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto;
  border-radius: 999px;
}
</style>
