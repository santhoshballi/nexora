<script setup>
import { computed } from 'vue'
import { useServicesStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['select'])

const servicesStore = useServicesStore()
const authStore = useAuthStore()

const services = computed(() => servicesStore.getAllServices)

function isAuthenticated(serviceId) {
  return authStore.isAuthenticated(serviceId)
}

function selectService(serviceId) {
  // Prefetch route for faster navigation
  import('@/views/ServiceDimension.vue')
  emit('select', serviceId)
}

function getServiceStyle(service) {
  return {
    '--service-color': service.color,
    '--accent-color': service.accentColor
  }
}
</script>

<template>
  <div class="mobile-grid">
    <div class="grid-container">
      <button
        v-for="service in services"
        :key="service.id"
        class="service-card"
        :style="getServiceStyle(service)"
        @click="selectService(service.id)"
      >
        <div class="card-glow"></div>

        <div class="card-icon">
          <span>{{ service.icon }}</span>
        </div>

        <h3 class="card-name">{{ service.name }}</h3>
        <p class="card-tagline">{{ service.tagline }}</p>

        <div v-if="isAuthenticated(service.id)" class="card-badge">✓</div>

        <div class="card-corner top-left"></div>
        <div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div>
        <div class="card-corner bottom-right"></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mobile-grid {
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 140px 20px 20px;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a15 0%, #0f0f1a 100%);
  top: 0;
  left: 0;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 500px;
  max-height: calc(100vh - 180px);
  margin: 0 auto;
  overflow: hidden;
}

.service-card {
  position: relative;
  aspect-ratio: 1;
  background: rgba(20, 20, 30, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.15);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 140px;
}

.service-card:active {
  transform: scale(0.95);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, var(--service-color) 0%, transparent 70%);
  opacity: 0.15;
  transition: opacity 0.3s ease;
}

.service-card:active .card-glow {
  opacity: 0.4;
}

.card-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  background: linear-gradient(135deg, var(--service-color), var(--accent-color));
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.card-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--service-color);
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px var(--service-color);
}

.card-tagline {
  margin: 0;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  line-height: 1.2;
}

.card-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 65, 0.2);
  border: 1px solid #00ff41;
  border-radius: 50%;
  font-size: 0.625rem;
  color: #00ff41;
}

.card-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid var(--service-color);
  opacity: 0.5;
}

.card-corner.top-left {
  top: 4px;
  left: 4px;
  border-right: none;
  border-bottom: none;
}

.card-corner.top-right {
  top: 4px;
  right: 4px;
  border-left: none;
  border-bottom: none;
}

.card-corner.bottom-left {
  bottom: 4px;
  left: 4px;
  border-right: none;
  border-top: none;
}

.card-corner.bottom-right {
  bottom: 4px;
  right: 4px;
  border-left: none;
  border-top: none;
}

@media (min-width: 500px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .service-card {
    max-height: 130px;
    padding: 0.8rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .card-name {
    font-size: 0.75rem;
  }

  .card-tagline {
    font-size: 0.55rem;
  }
}
</style>
