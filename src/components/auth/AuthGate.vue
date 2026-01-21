<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  serviceId: {
    type: String,
    required: true
  },
  serviceColor: {
    type: String,
    default: '#7df9ff'
  },
  serviceName: {
    type: String,
    default: 'SERVICE'
  }
})

const emit = defineEmits(['request-auth'])

const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated(props.serviceId)
})

const gateStyle = computed(() => ({
  '--service-color': props.serviceColor
}))

function requestAccess() {
  emit('request-auth')
}
</script>

<template>
  <div v-if="!isAuthenticated" class="auth-gate" :style="gateStyle">
    <div class="gate-content">
      <!-- Lock icon -->
      <div class="lock-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      </div>

      <!-- Message -->
      <h3 class="gate-title">ACCESS RESTRICTED</h3>
      <p class="gate-message">
        Authentication required to access <br />
        <span class="service-name">{{ serviceName }}</span> dashboard
      </p>

      <!-- Unlock button -->
      <button class="unlock-button" @click="requestAccess">
        <span class="button-icon">⚿</span>
        <span class="button-text">AUTHENTICATE</span>
      </button>

      <!-- Decorative scan line -->
      <div class="scan-line"></div>
    </div>

    <!-- Grid pattern background -->
    <div class="grid-pattern"></div>
  </div>
</template>

<style scoped>
.auth-gate {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  background: rgba(10, 10, 21, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-bottom: 1rem;
}

.gate-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.lock-icon {
  width: 40px;
  height: 40px;
  color: var(--service-color);
  margin-bottom: 0.75rem;
  opacity: 0.8;
  animation: pulse 2s ease-in-out infinite;
}

.lock-icon svg {
  width: 100%;
  height: 100%;
}

.gate-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 300;
  color: var(--service-color);
  letter-spacing: 0.3em;
}

.gate-message {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
}

.service-name {
  color: var(--service-color);
  font-weight: 600;
}

.unlock-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--service-color);
  color: var(--service-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.unlock-button:hover {
  background: rgba(125, 249, 255, 0.1);
  box-shadow: 0 0 20px rgba(125, 249, 255, 0.3);
}

.button-icon {
  font-size: 1rem;
}

.button-text {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--service-color), transparent);
  animation: scan 3s ease-in-out infinite;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes scan {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(400px);
    opacity: 0;
  }
}
</style>
