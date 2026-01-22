<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUniverseStore } from '@/stores/universe'

const authStore = useAuthStore()
const universeStore = useUniverseStore()

const isOnline = ref(navigator.onLine)

const authenticatedCount = computed(() => {
  return authStore.authenticatedServices.length
})

function toggleViewMode() {
  universeStore.toggleViewMode()
}

// Listen for online/offline events
function updateOnlineStatus() {
  isOnline.value = navigator.onLine
}

// Initialize and add event listeners
if (typeof window !== 'undefined') {
  // Set initial status
  updateOnlineStatus()

  // Add event listeners
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  // Also check periodically as a fallback
  setInterval(() => {
    const currentStatus = navigator.onLine
    if (currentStatus !== isOnline.value) {
      updateOnlineStatus()
    }
  }, 5000) // Check every 5 seconds
}
</script>

<template>
  <div class="navigation-hud">
    <!-- Top left: Logo & Status -->
    <div class="hud-corner top-left">
      <div class="status-display">
        <div class="status-dot" :class="{ active: isOnline }"></div>
        <span class="status-text">Online</span>
        <span v-if="authenticatedCount > 0" class="auth-text">dimensions unlocked</span>
      </div>
    </div>

    <!-- Top right: View controls -->
    <div class="hud-corner top-right">
      <button v-if="!universeStore.isMobile" class="hud-button" @click="toggleViewMode">
        <span class="button-icon">{{ universeStore.viewMode === '3d' ? '▦' : '○' }}</span>
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

.status-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 255, 200, 0.6);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.3);
}

.status-display::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  width: 20px;
  height: 20px;
  border-left: 2px solid rgba(0, 255, 200, 0.8);
  border-top: 2px solid rgba(0, 255, 200, 0.8);
  box-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff41;
  box-shadow: 0 0 10px #00ff41;
  transition: all 0.3s ease;
}

.status-dot:not(.active) {
  background: #ff6b6b;
  box-shadow: 0 0 10px #ff6b6b;
}

.status-text {
  font-size: 0.8rem;
  color: rgba(0, 255, 200, 0.9);
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
}

.auth-text {
  font-size: 0.7rem;
  color: rgba(0, 255, 200, 0.8);
  font-weight: 500;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  margin-left: 0.5rem;
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
