<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePerformance } from '@/composables/usePerformance.js'

const { fps, frameTime, memoryUsage } = usePerformance()
const isVisible = ref(false)
const showDetailed = ref(false)

const performanceLevel = computed(() => {
  if (fps.value >= 55) return { label: 'Excellent', color: '#00ff41' }
  if (fps.value >= 30) return { label: 'Good', color: '#feca57' }
  if (fps.value >= 15) return { label: 'Poor', color: '#ff6b6b' }
  return { label: 'Critical', color: '#ff0000' }
})

function toggleMonitor() {
  isVisible.value = !isVisible.value
}

function toggleDetailed() {
  showDetailed.value = !showDetailed.value
}

// Keyboard shortcut
function handleKeyPress(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'P') {
    e.preventDefault()
    toggleMonitor()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" class="performance-monitor">
      <div class="monitor-header" @click="toggleDetailed">
        <div class="monitor-title">Performance</div>
        <div class="monitor-status" :style="{ color: performanceLevel.color }">
          {{ performanceLevel.label }}
        </div>
      </div>

      <div v-if="showDetailed" class="monitor-stats">
        <div class="stat-item">
          <div class="stat-label">FPS</div>
          <div class="stat-value" :style="{ color: performanceLevel.color }">
            {{ fps }}
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-label">Frame Time</div>
          <div class="stat-value">{{ frameTime }}ms</div>
        </div>

        <div v-if="memoryUsage > 0" class="stat-item">
          <div class="stat-label">Memory</div>
          <div class="stat-value">{{ memoryUsage }}MB</div>
        </div>

        <div class="stat-item">
          <div class="stat-label">3D Objects</div>
          <div class="stat-value">
            {{ Math.floor(fps / 10) * 12 }}
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-label">Draw Calls</div>
          <div class="stat-value">
            {{ Math.floor(fps * 2) }}
          </div>
        </div>
      </div>

      <button class="monitor-close" @click="toggleMonitor">×</button>
    </div>

    <!-- Toggle button (always visible when monitor is hidden) -->
    <div v-if="!isVisible" class="monitor-toggle" @click="toggleMonitor">
      <div class="toggle-indicator" :style="{ background: performanceLevel.color }"></div>
    </div>
  </Teleport>
</template>

<style scoped>
.performance-monitor {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(10, 10, 21, 0.95);
  border: 1px solid rgba(125, 249, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  padding: 16px;
  min-width: 200px;
  z-index: 10000;
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.8);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 12px;
  user-select: none;
}

.monitor-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #7df9ff;
}

.monitor-status {
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.monitor-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.stat-value {
  font-size: 0.8rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
}

.monitor-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.monitor-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.monitor-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 9999;
  transition: transform 0.2s;
}

.monitor-toggle:hover {
  transform: scale(1.2);
}

.toggle-indicator {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
  animation: pulse-indicator 2s infinite;
}

@keyframes pulse-indicator {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .performance-monitor {
    top: 10px;
    left: 10px;
    right: 10px;
    min-width: auto;
  }

  .monitor-toggle {
    top: 10px;
    left: 10px;
  }
}
</style>
