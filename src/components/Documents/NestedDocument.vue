<template>

  <ion-item @click="isOpen = !isOpen">
    <i class="material-icons" slot="start">
      {{ isOpen ? 'folder_open' : 'folder' }}
    </i>
    <ion-label>{{ item.name }} ({{ item.categories.length + item.documents.length }})</ion-label>
    <i class="material-icons" slot="end">
      {{ isOpen ? 'expand_less' : 'expand_more' }}
    </i>
  </ion-item>


  <ion-list v-if="isOpen" class="ion-margin-start">
    <nested-document v-for="item in item.categories" :key="item.id" :item="item"></nested-document>
  </ion-list>

  <ion-list v-if="isOpen" class="ion-margin-start">
    <ion-item v-for="item in item.documents" :key="item.id" @click="$emit('downloadDocument', item)">
      <i class="material-icons" slot="start">
        file_download
      </i>
      <ion-label>{{ item.name }}</ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonList, IonLabel } from '@ionic/vue';
export default {
  name: "NestedDocument",
  components: { IonList, IonLabel },
  props: {
    item: Object,
  },
  computed: {
  },
  methods: {
  },
  data() {
    return {
      isOpen: false,
    };
  },
};
</script>