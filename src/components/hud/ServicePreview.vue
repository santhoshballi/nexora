<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated(props.service.id)
})

const previewStyle = computed(() => ({
  '--service-color': props.service.color,
  '--accent-color': props.service.accentColor
}))
</script>

<template>
  <div class="service-preview" :style="previewStyle">
    <div class="preview-header">
      <span class="service-icon">{{ service.icon }}</span>
      <div class="service-info">
        <h3 class="service-name">{{ service.name }}</h3>
        <p class="service-tagline">{{ service.tagline }}</p>
      </div>
      <div v-if="isAuthenticated" class="auth-badge">
        <span class="badge-icon">✓</span>
        <span class="badge-text">Unlocked</span>
      </div>
    </div>

    <p class="service-description">{{ service.description }}</p>

    <div class="service-features">
      <span v-for="feature in service.features" :key="feature" class="feature-tag">
        {{ feature }}
      </span>
    </div>

    <div class="preview-footer">
      <span class="enter-hint">Click to enter dimension</span>
      <span class="arrow">→</span>
    </div>

    <!-- Decorative elements -->
    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
  </div>
</template>

<style scoped>
.service-preview {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  background: rgba(10, 10, 21, 0.95);
  border: 1px solid var(--service-color);
  padding: 1.5rem;
  z-index: 30;
  backdrop-filter: blur(10px);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.service-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--service-color), var(--accent-color));
  border-radius: 8px;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.service-info {
  flex: 1;
}

.service-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--service-color);
  letter-spacing: 0.1em;
}

.service-tagline {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.auth-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 4px;
  font-size: 0.625rem;
  color: #00ff41;
}

.badge-icon {
  font-size: 0.875rem;
}

.service-description {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.service-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(var(--service-color), 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.enter-hint {
  font-size: 0.75rem;
  color: var(--service-color);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.arrow {
  color: var(--service-color);
  animation: bounce-right 1s ease-in-out infinite;
}

.corner-decoration {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--service-color);
}

.corner-decoration.top-left {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.corner-decoration.top-right {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
}

.corner-decoration.bottom-left {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
}

.corner-decoration.bottom-right {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

@keyframes bounce-right {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

@media (max-width: 768px) {
  .service-preview {
    bottom: 80px;
    padding: 1rem;
  }

  .service-name {
    font-size: 1rem;
  }

  .service-description {
    font-size: 0.75rem;
  }
}
</style>
