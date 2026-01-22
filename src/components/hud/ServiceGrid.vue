<script setup>
import { computed, onMounted, ref } from 'vue'
import { useServicesStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import { useAdvancedAnimations } from '@/composables/useAdvancedAnimations.js'
import { useSoundSystem } from '@/composables/useSoundSystem.js'

const emit = defineEmits(['select'])

const servicesStore = useServicesStore()
const authStore = useAuthStore()
const { addMagneticEffect, addFloatingAnimation, addPulseGlow } = useAdvancedAnimations()
const { playSound } = useSoundSystem()

const services = computed(() => servicesStore.getAllServices)
const cardRefs = ref([])

function isAuthenticated(serviceId) {
  return authStore.isAuthenticated(serviceId)
}

function selectService(serviceId) {
  playSound('portal')
  emit('select', serviceId)
}

function handleCardHover(service, isHovering) {
  if (isHovering) {
    playSound('hover')
  }
}

function getServiceStyle(service) {
  return {
    '--service-color': service.color,
    '--accent-color': service.accentColor
  }
}

onMounted(() => {
  // Apply advanced animations to cards
  cardRefs.value.forEach((card, index) => {
    if (card) {
      // Staggered entrance animation
      setTimeout(() => {
        addFloatingAnimation(card, 5, 3 + index * 0.2)
        addMagneticEffect(card)
        addPulseGlow(card, window.getComputedStyle(card).getPropertyValue('--service-color'))
      }, index * 100)
    }
  })
})
</script>

<template>
  <div class="service-grid-overlay">
    <div class="grid-container">
      <div
        v-for="service in services"
        :key="service.id"
        ref="cardRefs"
        class="service-card"
        :style="getServiceStyle(service)"
        @click="selectService(service.id)"
        @mouseenter="handleCardHover(service, true)"
        @mouseleave="handleCardHover(service, false)"
      >
        <!-- Corner brackets -->
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>

        <!-- Icon pill button -->
        <div class="icon-pill">
          <span class="icon">{{ service.icon }}</span>
        </div>

        <!-- Service info -->
        <h3 class="service-name">{{ service.name }}</h3>
        <p class="service-tagline">{{ service.tagline.toUpperCase() }}</p>

        <!-- Authenticated badge -->
        <div v-if="isAuthenticated(service.id)" class="auth-badge">
          <span>✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-grid-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 92%;
  max-width: 1200px;
  max-height: calc(100vh - 180px);
  z-index: 20;
  pointer-events: auto;
  margin-top: 35px;
  overflow: hidden;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  padding: 0;
  height: 100%;
}

.service-card {
  position: relative;
  background: linear-gradient(145deg, rgba(15, 15, 28, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  min-height: 155px;
  max-height: 155px;
  justify-content: center;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--service-color) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.service-card:hover {
  background: linear-gradient(145deg, rgba(20, 20, 35, 0.98) 0%, rgba(15, 15, 25, 0.98) 100%);
  border-color: var(--service-color);
  transform: translateY(-8px) scale(1.03);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.7),
    0 0 40px var(--service-color),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5);
}

.service-card:hover::before {
  opacity: 0.08;
}

/* Corner brackets */
.corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid var(--service-color);
  opacity: 0.4;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover .corner {
  opacity: 1;
  filter: drop-shadow(0 0 8px var(--service-color));
}

.corner.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

.service-card:hover .corner.top-left {
  transform: translate(-2px, -2px);
}

.service-card:hover .corner.top-right {
  transform: translate(2px, -2px);
}

.service-card:hover .corner.bottom-left {
  transform: translate(-2px, 2px);
}

.service-card:hover .corner.bottom-right {
  transform: translate(2px, 2px);
}

/* Icon pill */
.icon-pill {
  width: 75px;
  height: 75px;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--service-color) 0%, var(--accent-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.icon-pill::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%);
  border-radius: 18px;
}

.service-card:hover .icon-pill {
  transform: scale(1.1) translateY(-2px);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.6),
    0 0 35px var(--service-color),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.icon {
  font-size: 2.25rem;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  position: relative;
  z-index: 1;
}

/* Service info */
.service-name {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--service-color);
  letter-spacing: 0.15em;
  text-shadow:
    0 0 20px var(--service-color),
    0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  position: relative;
}

.service-card:hover .service-name {
  text-shadow:
    0 0 30px var(--service-color),
    0 0 60px var(--service-color),
    0 2px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.03);
  letter-spacing: 0.18em;
}

.service-tagline {
  margin: 0;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.12em;
  text-align: center;
  font-weight: 500;
  line-height: 1.3;
  text-transform: uppercase;
  transition: color 0.4s ease;
}

.service-card:hover .service-tagline {
  color: rgba(255, 255, 255, 0.7);
}

/* Auth badge */
.auth-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.15) 0%, rgba(0, 255, 65, 0.25) 100%);
  border: 2px solid #00ff41;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ff41;
  font-size: 0.8rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
  box-shadow:
    0 0 15px rgba(0, 255, 65, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  animation: pulse-badge 2s ease-in-out infinite;
  z-index: 10;
}

.service-card:hover .auth-badge {
  transform: scale(1.1);
  box-shadow:
    0 0 25px rgba(0, 255, 65, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

@keyframes pulse-badge {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(0, 255, 65, 0.6);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .service-grid-overlay {
    width: 94%;
    max-height: calc(100vh - 160px);
  }

  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .service-card {
    min-height: 145px;
    max-height: 145px;
    padding: 20px 16px;
  }

  .icon-pill {
    width: 65px;
    height: 65px;
  }

  .icon {
    font-size: 2rem;
  }

  .service-name {
    font-size: 1rem;
  }

  .auth-badge {
    width: 24px;
    height: 24px;
    top: 10px;
    right: 10px;
    font-size: 0.7rem;
  }
}

@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .service-card {
    min-height: 150px;
    max-height: 150px;
    padding: 22px 18px;
  }

  .icon-pill {
    width: 70px;
    height: 70px;
  }

  .icon {
    font-size: 2.1rem;
  }

  .service-name {
    font-size: 1.05rem;
  }

  .service-tagline {
    font-size: 0.62rem;
  }
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .service-card {
    min-height: 145px;
    max-height: 145px;
    padding: 20px 16px;
  }

  .icon-pill {
    width: 65px;
    height: 65px;
  }

  .icon {
    font-size: 2rem;
  }

  .service-name {
    font-size: 1rem;
  }

  .service-tagline {
    font-size: 0.6rem;
  }
}

@media (max-width: 640px) {
  .service-grid-overlay {
    width: 96%;
    margin-top: 50px;
    max-height: calc(100vh - 120px);
  }

  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 0;
  }

  .service-card {
    padding: 18px 14px;
    gap: 10px;
    min-height: 140px;
    max-height: 140px;
  }

  .icon-pill {
    width: 60px;
    height: 60px;
    border-radius: 16px;
  }

  .icon {
    font-size: 1.8rem;
  }

  .service-name {
    font-size: 0.95rem;
    letter-spacing: 0.12em;
  }

  .service-tagline {
    font-size: 0.58rem;
    letter-spacing: 0.1em;
  }

  .auth-badge {
    width: 22px;
    height: 22px;
    top: 8px;
    right: 8px;
    font-size: 0.65rem;
  }

  .corner {
    width: 14px;
    height: 14px;
  }

  .corner.top-left {
    top: 8px;
    left: 8px;
  }

  .corner.top-right {
    top: 8px;
    right: 8px;
  }

  .corner.bottom-left {
    bottom: 8px;
    left: 8px;
  }

  .corner.bottom-right {
    bottom: 8px;
    right: 8px;
  }
}

/* Ultra-mobile */
@media (max-width: 480px) {
  .service-grid-overlay {
    width: 98%;
    margin-top: 40px;
  }

  .grid-container {
    gap: 12px;
  }

  .service-card {
    min-height: 130px;
    max-height: 130px;
    padding: 16px 12px;
  }

  .icon-pill {
    width: 55px;
    height: 55px;
  }

  .icon {
    font-size: 1.6rem;
  }

  .service-name {
    font-size: 0.85rem;
  }

  .service-tagline {
    font-size: 0.52rem;
  }
}
</style>
