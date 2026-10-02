<template>
  <profile-view :name="church.name || ''" :caption="caption" :avatar-src="logoUrl" square
    :email="church.email || ''" :phone="church.phone_1 || church.phone || ''" :place="place">
    <template v-if="president">
      <h2 class="app-section-title">Président</h2>
      <ion-list class="app-inset-list">
        <ion-item button detail @click="goToMember(president)">
          <app-avatar slot="start" :src="avatarOf(president.member_id)" :name="president.name" :size="40" />
          <ion-label class="ion-text-wrap">
            <span class="member-name">{{ president.name }}</span>
          </ion-label>
        </ion-item>
      </ion-list>
    </template>
  </profile-view>
</template>

<script>
import { IonList, IonItem, IonLabel } from "@ionic/vue";
import ProfileView from "../Common/ProfileView.vue";
import AppAvatar from "../Common/AppAvatar.vue";
import { BASE_URL } from "@/utils/format";

export default {
  name: "ChurchShowComponent",
  components: { IonList, IonItem, IonLabel, ProfileView, AppAvatar },
  props: {
    church: { type: Object, required: true },
    members: { type: Array, default: () => [] },
  },
  computed: {
    caption() {
      return this.church.id ? `Église n° ${this.church.id}` : "Église";
    },
    place() {
      return [this.church.zipcode, this.church.town].filter(Boolean).join(" ");
    },
    logoUrl() {
      return this.church.id ? `${BASE_URL}/logos/${this.church.id}.png` : "";
    },
    president() {
      return (this.members || []).find((m) => m.role_name === "president");
    },
  },
  methods: {
    avatarOf(id) {
      return `${BASE_URL}/avatars/${id}.png`;
    },
    goToMember(member) {
      this.$router.push({ name: "SearchShow", params: { type: "users", id: member.member_id } });
    },
  },
};
</script>

<style scoped>
.app-avatar[slot="start"] {
  margin-inline-end: 14px;
}

.member-name {
  font-weight: 600;
}
</style>
