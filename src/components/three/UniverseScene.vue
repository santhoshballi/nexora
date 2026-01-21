<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThreeUniverse } from '@/composables/useThreeUniverse'
import { useUniverseStore } from '@/stores/universe'
import { usePortalTransition } from '@/composables/usePortalTransition'

const router = useRouter()
const universeStore = useUniverseStore()
const { startPortalTransition, progress, transitionPhase } = usePortalTransition()

const containerRef = ref(null)
const { isReady, resetCamera } = useThreeUniverse(containerRef)

// Watch for portal activation
watch(
  () => universeStore.portalActive,
  active => {
    if (active && universeStore.selectedNode) {
      startPortalTransition(universeStore.selectedNode, () => {
        router.push(`/service/${universeStore.selectedNode}`)
      })
    }
  }
)

defineExpose({ resetCamera })
</script>

<template>
  <div class="universe-scene">
    <div ref="containerRef" class="canvas-container"></div>

    <!-- Portal transition overlay -->
    <Transition name="portal">
      <div
        v-if="transitionPhase !== 'idle'"
        class="portal-overlay"
        :style="{
          '--progress': progress,
          '--phase': transitionPhase
        }"
      >
        <div class="portal-ring"></div>
        <div class="portal-glow"></div>
        <div v-if="transitionPhase === 'traveling'" class="portal-flash"></div>
      </div>
    </Transition>

    <!-- Loading indicator -->
    <Transition name="fade">
      <div v-if="!isReady" class="loading-indicator">
        <div class="loading-spinner"></div>
        <span>Initializing Universe...</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.universe-scene {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.canvas-container :deep(canvas) {
  display: block;
}

.portal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.portal-ring {
  position: absolute;
  width: calc(100px + var(--progress, 0) * 300vmax);
  height: calc(100px + var(--progress, 0) * 300vmax);
  border: 4px solid currentColor;
  border-radius: 50%;
  animation: portal-spin 1s linear infinite;
  opacity: calc(1 - var(--progress, 0));
}

.portal-glow {
  position: absolute;
  width: calc(50px + var(--progress, 0) * 400vmax);
  height: calc(50px + var(--progress, 0) * 400vmax);
  background: radial-gradient(
    circle,
    rgba(125, 249, 255, 0.8) 0%,
    rgba(125, 249, 255, 0.4) 30%,
    rgba(125, 249, 255, 0) 70%
  );
  border-radius: 50%;
}

.portal-flash {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  animation: flash 0.3s ease-out forwards;
}

@keyframes portal-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes flash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: rgba(125, 249, 255, 0.8);
  font-family: 'Courier New', monospace;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(125, 249, 255, 0.2);
  border-top-color: rgba(125, 249, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.portal-enter-active,
.portal-leave-active {
  transition: opacity 0.3s ease;
}

.portal-enter-from,
.portal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
