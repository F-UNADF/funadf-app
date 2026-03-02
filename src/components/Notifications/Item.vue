<template>
  <ion-item class="notif-item" detail="false" :button="true" :class="{ unread: !notification.read }"
    @click="$emit('click', notification)" lines="none">
    <ion-icon aria-hidden="true" :icon="getIcon" slot="start" class="notif-icon"></ion-icon>

    <ion-label class="notif-label">
      <div class="title">{{ notification.notifiable?.title }}</div>
      <div class="sender">{{ notification.sender?.name }}</div>

      <ion-note class="content ion-text-wrap" color="info" v-html="getContent(notification)" />
    </ion-label>

    <div class="meta" slot="end">
      <ion-note class="time" color="medium">{{ getTimeAgo }}</ion-note>
      <ion-icon class="chev" color="medium" :icon="chevronForward"></ion-icon>
    </div>
  </ion-item>
</template>

<script>
import { chevronForward, newspaperOutline, calendarOutline } from 'ionicons/icons'
import { IonLabel, IonNote, IonIcon } from '@ionic/vue'

export default {
  name: 'NotificationItem',
  components: {
    IonLabel,
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
.notif-item {
  --background: transparent;
  --min-height: 64px;
  margin: 8px 10px;
  border-radius: 14px;
  border: 1px solid var(--ion-color-border);
  overflow: hidden;
}

/* Unread = liseré + fond un poil plus clair */
.notif-item.unread {
  --background: rgba(121, 138, 244, 0.08);
  border: 1px solid rgba(121, 138, 244, 0.22);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.10);
}

/* Icon */
.notif-icon {
  font-size: 20px;
  opacity: 0.9;
}

/* Texte */
.notif-label .title {
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-label .sender {
  font-size: 12px;
  margin-top: 2px;
}

.notif-label .content {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.35;
}

/* Meta à droite */
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 11px;
  white-space: nowrap;
}

.chev {
  font-size: 16px;
  opacity: 0.7;
}
</style>