<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UniverseScene from '@/components/three/UniverseScene.vue'
import CosmicBackground from '@/components/three/CosmicBackground.vue'
import NavigationHUD from '@/components/hud/NavigationHUD.vue'
import ServicePreview from '@/components/hud/ServicePreview.vue'
import MobileGrid from '@/components/hud/MobileGrid.vue'
import { useUniverseStore } from '@/stores/universe'
import { useServicesStore } from '@/stores/services'

const router = useRouter()
const universeStore = useUniverseStore()
const servicesStore = useServicesStore()

const universeSceneRef = ref(null)
const isMobile = ref(false)

const hoveredService = computed(() => {
  if (!universeStore.hoveredNode) return null
  return servicesStore.getService(universeStore.hoveredNode)
})

function checkMobile() {
  isMobile.value = window.innerWidth < 768
  universeStore.setMobile(isMobile.value)
}

function handleServiceSelect(serviceId) {
  router.push(`/service/${serviceId}/dimension`)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Reset universe store state when returning to universe
  universeStore.clearSelection()
  universeStore.clearHoveredNode()
  universeStore.setPortalActive(false)
  universeStore.setTransitioning(false)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="universe-view">
    <!-- 3D Universe (desktop) -->
    <template v-if="!isMobile">
      <CosmicBackground :star-count="300" :speed="0.3" />
      <UniverseScene ref="universeSceneRef" />
    </template>

    <!-- Mobile Grid -->
    <MobileGrid v-else @select="handleServiceSelect" />

    <!-- Navigation HUD -->
    <NavigationHUD />

    <!-- Service Preview Panel -->
    <Transition name="slide-up">
      <ServicePreview
        v-if="hoveredService && !universeStore.isTransitioning"
        :service="hoveredService"
      />
    </Transition>

    <!-- Title overlay -->
    <div class="title-overlay">
      <h1 class="title">
        <span class="title-nexora">NEXORA</span>
      </h1>
      <p class="subtitle">Navigate the Multiverse of Services</p>
    </div>

    <!-- Instructions -->
    <Transition name="fade">
      <div v-if="!universeStore.selectedNode && !isMobile" class="instructions">
        <div class="instruction-item">
          <span class="key">Click</span>
          <span class="action">Enter Dimension</span>
        </div>
        <div class="instruction-item">
          <span class="key">Hover</span>
          <span class="action">Preview Service</span>
        </div>
        <div class="instruction-item">
          <span class="key">Scroll</span>
          <span class="action">Zoom In/Out</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.universe-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a15;
  transform: translateZ(0);
}

.title-overlay {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}

.title {
  font-size: 3rem;
  font-weight: 100;
  letter-spacing: 0.5em;
  margin: 0;
}

.title-nexora {
  color: #7df9ff;
  text-shadow:
    0 0 10px rgba(125, 249, 255, 0.5),
    0 0 20px rgba(125, 249, 255, 0.3),
    0 0 30px rgba(125, 249, 255, 0.2);
}

.subtitle {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
  letter-spacing: 0.2em;
}

.instructions {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3rem;
  z-index: 10;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.key {
  padding: 0.25rem 0.75rem;
  background: rgba(125, 249, 255, 0.1);
  border: 1px solid rgba(125, 249, 255, 0.3);
  border-radius: 4px;
  color: #7df9ff;
}

.action {
  color: rgba(255, 255, 255, 0.5);
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.75rem;
  }
}
</style>
