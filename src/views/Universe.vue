<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UniverseScene from '@/components/three/UniverseScene.vue'
import CosmicBackground from '@/components/three/CosmicBackground.vue'
import NavigationHUD from '@/components/hud/NavigationHUD.vue'
import ServiceGrid from '@/components/hud/ServiceGrid.vue'
import MobileGrid from '@/components/hud/MobileGrid.vue'
import { useUniverseStore } from '@/stores/universe'

const router = useRouter()
const universeStore = useUniverseStore()

const universeSceneRef = ref(null)
const isMobile = ref(false)

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
    <!-- Cosmic Background -->
    <CosmicBackground :star-count="300" :speed="0.3" />

    <!-- Navigation HUD -->
    <NavigationHUD />

    <!-- Title overlay -->
    <div class="title-overlay">
      <h1 class="title">
        <span class="title-nexora">NEXORA</span>
      </h1>
      <p class="subtitle">Navigate the Multiverse of Services</p>
    </div>

    <!-- 3D Scene -->
    <UniverseScene
      v-if="!isMobile && universeStore.viewMode === '3d'"
      ref="universeSceneRef"
      @select="handleServiceSelect"
    />

    <!-- Service Grid (Desktop) -->
    <ServiceGrid
      v-if="!isMobile && universeStore.viewMode === 'grid'"
      @select="handleServiceSelect"
    />

    <!-- Mobile Grid -->
    <MobileGrid v-else @select="handleServiceSelect" />
  </div>
</template>

<style scoped>
.universe-view {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a15;
  transform: translateZ(0);
  top: 0;
  left: 0;
}

.title-overlay {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
  padding: 0 20px;
}

.title {
  font-size: 3rem;
  font-weight: 100;
  letter-spacing: 0.5em;
  margin: 0;
  line-height: 1.1;
}

.title-nexora {
  color: #7df9ff;
  text-shadow:
    0 0 15px rgba(125, 249, 255, 0.6),
    0 0 30px rgba(125, 249, 255, 0.4),
    0 0 45px rgba(125, 249, 255, 0.2);
}

.subtitle {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 300;
  letter-spacing: 0.25em;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
    letter-spacing: 0.4em;
  }

  .subtitle {
    font-size: 0.6rem;
    margin-top: 0.4rem;
  }

  .title-overlay {
    top: 40px;
  }
}
</style>
