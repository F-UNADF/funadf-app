<template>
  <ion-item detail="false" :button="true" @click="$emit('click', notification)"
    :color="notification.read ? 'medium' : 'primary'">
    <ion-icon aria-hidden="true" :icon="getIcon" slot="start"></ion-icon>
    <ion-label>
      <strong>{{ notification.notifiable?.title }}</strong>
      <ion-text>{{ notification.sender?.name }}</ion-text><br>
      <ion-note color="medium" class="ion-text-wrap" :v-html="getContent(notification)">
      </ion-note>
    </ion-label>
    <div class="metadata-end-wrapper" slot="end">
      <ion-note color="medium">{{ getTimeAgo }}</ion-note>
      <ion-icon color="medium" :icon="chevronForward"></ion-icon>
    </div>
  </ion-item>
</template>

<script>
import { chevronForward, newspaperOutline, calendarOutline } from 'ionicons/icons'
import { IonItem, IonLabel, IonText, IonNote, IonIcon } from '@ionic/vue'

export default {
  name: 'NotificationItem',
  components: {
    IonItem,
    IonLabel,
    IonText,
    IonNote,
    IonIcon
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  computed: {
    getTimeAgo() {
      let currentDate = new Date(new Date().toUTCString());
      let date = new Date(this.notification.created_at);

      let year = currentDate.getFullYear() - date.getFullYear();
      let month = currentDate.getMonth() - date.getMonth();
      let day = currentDate.getDate() - date.getDate();
      let hour = currentDate.getHours() - date.getHours();
      let minute = currentDate.getMinutes() - date.getMinutes();
      let second = currentDate.getSeconds() - date.getSeconds();

      let createdSecond = (year * 31556926) + (month * 2629746) + (day * 86400) + (hour * 3600) + (minute * 60) + second;

      if (createdSecond >= 31556926) {
        let yearAgo = Math.floor(createdSecond / 31556926);
        return yearAgo + " a";
      } else if (createdSecond >= 2629746) {
        let monthAgo = Math.floor(createdSecond / 2629746);
        return monthAgo + " m";
      } else if (createdSecond >= 86400) {
        let dayAgo = Math.floor(createdSecond / 86400);
        return dayAgo + " j";
      } else if (createdSecond >= 3600) {
        let hourAgo = Math.floor(createdSecond / 3600);
        return hourAgo + " h";
      } else if (createdSecond >= 60) {
        let minuteAgo = Math.floor(createdSecond / 60);
        return minuteAgo + " min";
      } else if (createdSecond < 60) {
        return createdSecond + " s";
      } else if (createdSecond < 0) {
        return "0 s";
      } else {
        return "Maintenant";
      }
    },
    getIcon() {
      switch (this.notification.notifiable_type) {
        case 'Post':
          return newspaperOutline;
        case 'Event':
          return calendarOutline;
        default:
          return 'notifications-outline';
      }
    }
  },
  methods: {
    getContent(notification) {
      if (notification.notifiable_type === 'Post') {
        return `Nouveau post de <strong>${notification.notifiable?.structure?.name}</strong> : ${notification.notifiable?.title}`;
      }
    },
  },
  data() {
    return {
      chevronForward
    }
  }
}
</script>

<style scoped>
ion-label strong {
  display: block;
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
}

ion-label ion-note {
  font-size: 0.9rem;
}
</style>