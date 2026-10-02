<template>
  <span class="app-avatar" :class="{ 'is-square': square }" :style="{ width: size + 'px', height: size + 'px', fontSize: size * 0.38 + 'px' }">
    <img v-if="src && !failed" :src="src" :alt="alt" loading="lazy" @error="failed = true" />
    <span v-else class="initials" :aria-label="alt || undefined" :aria-hidden="alt ? undefined : 'true'">{{ letters }}</span>
  </span>
</template>

<script>
import { initials } from "@/utils/format";

// Photo ou logo, avec initiales de secours si l'image est absente ou ne charge pas.
export default {
  name: "AppAvatar",
  props: {
    src: { type: String, default: "" },
    name: { type: String, default: "" },
    alt: { type: String, default: "" },
    size: { type: Number, default: 40 },
    square: { type: Boolean, default: false },
  },
  data() {
    return { failed: false };
  },
  computed: {
    letters() {
      return initials(this.name) || "+";
    },
  },
  watch: {
    src() {
      this.failed = false;
    },
  },
};
</script>

<style scoped>
.app-avatar {
  position: relative;
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 999px;
  background: var(--app-accent-soft);
  color: var(--app-accent-ink);
  font-weight: 700;
  line-height: 1;
}

.app-avatar.is-square {
  border-radius: 28%;
}

.app-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.initials {
  letter-spacing: 0.02em;
}
</style>
