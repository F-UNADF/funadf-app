<template>
  <h1>Comming</h1>
</template>


<script>

import { mapGetters } from "vuex";

export default {
  name: "VoteShow",
  computed: {
    ...mapGetters({
      items: 'getItems',
      user: 'getUser',
    }),
  },
  beforeCreate: function () {
    this.$store.dispatch('getConnectedUser');
    this.$store.dispatch('items');
  },
};
</script>