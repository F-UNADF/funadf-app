<template>
  <v-snackbar v-model="snackbar" :color="color" multi-line :timeout="5000">
    {{ text }}
    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>

export default {
  name: 'SnackBar',
  props: {
    text: {
      type: String,
      default: 'Quelque chose est arrivé !',
    },
    color: {
      type: String,
      default: 'success',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show: function (val) {
      this.snackbar = val;
    },
  },
  data() {
    return {
      snackbar: false,
    };
  },
}
</script>