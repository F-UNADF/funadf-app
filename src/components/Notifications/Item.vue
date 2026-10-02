<template>
  <ion-item class="notif-item" :class="{ unread: !notification.read }" button :detail="false"
    @click="$emit('click', notification)">
    <div slot="start" class="notif-icon" aria-hidden="true">
      <ion-icon :icon="icon" />
    </div>

    <ion-label class="ion-text-wrap">
      <span class="notif-title">{{ title }}</span>
      <p class="notif-meta">
        <span v-if="!notification.read" class="visually-hidden">Non lue. </span>
        {{ kindLabel }}<template v-if="sender"> de {{ sender }}</template>
      </p>
    </ion-label>

    <div slot="end" class="notif-end">
      <time class="notif-time" :datetime="notification.created_at">{{ ago }}</time>
      <span v-if="!notification.read" class="unread-dot" aria-hidden="true"></span>
    </div>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { newspaperOutline, calendarOutline, checkboxOutline, notificationsOutline } from "ionicons/icons";
import { timeAgo } from "@/utils/format";

const KINDS = {
  Post: { icon: newspaperOutline, label: "Actualité" },
  Event: { icon: calendarOutline, label: "Événement" },
  VoteCampaign: { icon: checkboxOutline, label: "Vote" },
};

export default {
  name: "NotificationItem",
  components: { IonItem, IonLabel, IonIcon },
  props: {
    notification: { type: Object, required: true },
  },
  emits: ["click"],
  computed: {
    kind() {
      return KINDS[this.notification.notifiable_type] || { icon: notificationsOutline, label: "Notification" };
    },
    icon() {
      return this.kind.icon;
    },
    kindLabel() {
      return this.kind.label;
    },
    // Actualités et événements ont un titre, les campagnes de vote un nom
    title() {
      const n = this.notification.notifiable || {};
      return n.title || n.name || "Nouvelle notification";
    },
    sender() {
      return this.notification.sender && this.notification.sender.name;
    },
    ago() {
      return timeAgo(this.notification.created_at);
    },
  },
};
</script>

<style scoped>
.notif-item {
  --background: var(--ion-background-color);
  --padding-start: 16px;
  --inner-padding-end: 14px;
  --min-height: 72px;
}

.notif-item.unread {
  --background: var(--app-accent-soft);
}

.notif-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-inline-end: 14px;
  border-radius: 10px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  color: var(--ion-color-primary);
  font-size: 18px;
}

.notif-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9375rem;
  line-height: 1.3;
  font-weight: 500;
  color: var(--app-text);
}

.unread .notif-title {
  font-weight: 700;
}

.notif-meta {
  margin-top: 3px;
  font-size: 0.8125rem;
  color: var(--app-text-muted);
}

.notif-end {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  align-self: flex-start;
  padding-top: 14px;
}

.notif-time {
  font-size: 0.75rem;
  color: var(--app-text-muted);
  white-space: nowrap;
}

.unread-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--ion-color-danger);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
