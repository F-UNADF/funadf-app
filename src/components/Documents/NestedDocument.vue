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
    <ion-item 
      v-for="item in item.documents" 
      :key="item.id" 
      @click="handleClick(item)"
    >
      <i class="material-icons" slot="start">
        {{ item.type === 'url' ? 'link' : 'file_download' }}
      </i>
      <ion-label>{{ item.name }}</ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonList, IonItem, IonLabel } from '@ionic/vue';
import { Browser } from '@capacitor/browser';

export default {
  name: "NestedDocument",
  components: { IonList, IonItem, IonLabel },
  props: {
    item: Object,
  },
  emits: ['downloadDocument'],
  computed: {
  },
  methods: {
    handleClick: async function(item) {
      if (item.type === 'url') {
        await Browser.open({ url: item.url });
      } else {
        let base_url =
          process.env.NODE_ENV === "production"
            ? "https://add-fnadf.fr"
            : "http://app.localhost:3000";
        
        await Browser.open({ url: base_url + item.href });
      }
    }
  },
  data() {
    return {
      isOpen: false,
    };
  },
};
</script>