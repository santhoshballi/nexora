<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUniverseStore } from '@/stores/universe'

const authStore = useAuthStore()
const universeStore = useUniverseStore()

const authenticatedCount = computed(() => {
  return authStore.authenticatedServices.length
})

function toggleViewMode() {
  universeStore.toggleViewMode()
}
</script>

<template>
  <div class="navigation-hud">
    <!-- Top left: Logo & Status -->
    <div class="hud-corner top-left">
      <div class="status-indicator">
        <div class="status-dot" :class="{ active: true }"></div>
        <span class="status-text">ONLINE</span>
      </div>
      <div v-if="authenticatedCount > 0" class="auth-status">
        <span class="auth-count">{{ authenticatedCount }}</span>
        <span class="auth-label">dimensions unlocked</span>
      </div>
    </div>

    <!-- Top right: View controls -->
    <div class="hud-corner top-right">
      <button v-if="!universeStore.isMobile" class="hud-button" @click="toggleViewMode">
        <span class="button-icon">{{ universeStore.viewMode === '3d' ? '\u25A6' : '\u25CB' }}</span>
        <span class="button-label">{{ universeStore.viewMode === '3d' ? 'GRID' : '3D' }}</span>
      </button>
    </div>

    <!-- Bottom left: Coordinates (aesthetic) -->
    <div class="hud-corner bottom-left">
      <div class="coordinates">
        <span class="coord-label">SECTOR</span>
        <span class="coord-value">ALPHA-7</span>
      </div>
      <div class="coordinates">
        <span class="coord-label">NODES</span>
        <span class="coord-value">12 ACTIVE</span>
      </div>
    </div>

    <!-- Bottom right: Help -->
    <div class="hud-corner bottom-right">
      <div class="version-info">
        <span class="version">v1.0.0</span>
        <span class="divider">|</span>
        <span class="system">NEXORA OS</span>
      </div>
    </div>

    <!-- Scan lines overlay -->
    <div class="scan-lines"></div>

    <!-- Corner brackets -->
    <div class="bracket top-left-bracket"></div>
    <div class="bracket top-right-bracket"></div>
    <div class="bracket bottom-left-bracket"></div>
    <div class="bracket bottom-right-bracket"></div>
  </div>
</template>

<style scoped>
.navigation-hud {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 20;
  font-family: 'Courier New', monospace;
}

.hud-corner {
  position: absolute;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.top-left {
  top: 0;
  left: 0;
}

.top-right {
  top: 0;
  right: 0;
  align-items: flex-end;
}

.bottom-left {
  bottom: 0;
  left: 0;
}

.bottom-right {
  bottom: 0;
  right: 0;
  align-items: flex-end;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #00ff41;
  box-shadow: 0 0 10px #00ff41;
  animation: pulse 2s ease-in-out infinite;
}

.status-text {
  font-size: 0.625rem;
  color: rgba(125, 249, 255, 0.7);
  letter-spacing: 0.2em;
}

.auth-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.625rem;
}

.auth-count {
  color: #00ff41;
  font-weight: bold;
}

.auth-label {
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hud-button {
  pointer-events: auto;
  background: rgba(125, 249, 255, 0.1);
  border: 1px solid rgba(125, 249, 255, 0.3);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(125, 249, 255, 0.8);
}

.hud-button:hover {
  background: rgba(125, 249, 255, 0.2);
  border-color: rgba(125, 249, 255, 0.6);
}

.button-icon {
  font-size: 1rem;
}

.button-label {
  font-size: 0.625rem;
  letter-spacing: 0.2em;
}

.coordinates {
  display: flex;
  gap: 0.5rem;
  font-size: 0.625rem;
}

.coord-label {
  color: rgba(255, 255, 255, 0.3);
}

.coord-value {
  color: rgba(125, 249, 255, 0.6);
}

.version-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.3);
}

.divider {
  opacity: 0.3;
}

.system {
  color: rgba(125, 249, 255, 0.5);
}

.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
}

.bracket {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(125, 249, 255, 0.2);
}

.top-left-bracket {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.top-right-bracket {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.bottom-left-bracket {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.bottom-right-bracket {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .hud-corner {
    padding: 10px;
  }

  .bottom-left,
  .bottom-right {
    display: none;
  }
}
</style>
