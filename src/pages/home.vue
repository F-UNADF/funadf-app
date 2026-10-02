<template>
  <div class="app-screen">
    <user-show v-if="user && user.id" :user="user" :church="currentChurch" :canEdit="true" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserShow from "@/components/Users/show.vue";

// Mon profil (/user)
export default {
  name: "HomePage",
  components: { UserShow },
  computed: {
    ...mapGetters("sessionStore", {
      user: "getUser",
    }),
    ...mapGetters("profilStore", {
      phases: "getPhases",
    }),
    // L'église actuelle : la phase sans date de fin
    currentChurch() {
      return (this.phases || []).filter((phase) => phase.end_at === null)[0] || null;
    },
  },
  created() {
    if (null === localStorage.getItem("token")) {
      this.$router.push("/login");
      return;
    }
    this.$store.dispatch("sessionStore/fetchUser");
    this.$store.dispatch("profilStore/getProfile").catch(() => {});
  },
};
</script>
