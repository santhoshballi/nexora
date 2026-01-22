import { ref, onMounted, onUnmounted } from 'vue'

export function usePerformance() {
  const fps = ref(0)
  const frameTime = ref(0)
  const memoryUsage = ref(0)
  let rafId = null
  let lastTime = performance.now()
  let frames = 0

  function updateStats() {
    const currentTime = performance.now()
    frames++

    if (currentTime >= lastTime + 1000) {
      fps.value = Math.round((frames * 1000) / (currentTime - lastTime))
      frameTime.value = Math.round((currentTime - lastTime) / frames)
      frames = 0
      lastTime = currentTime
    }

    // Memory usage (if available)
    if (performance.memory) {
      memoryUsage.value = Math.round(performance.memory.usedJSHeapSize / 1048576)
    }

    rafId = requestAnimationFrame(updateStats)
  }

  function startMonitoring() {
    rafId = requestAnimationFrame(updateStats)
  }

  function stopMonitoring() {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  }

  onMounted(() => {
    startMonitoring()
  })

  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    fps,
    frameTime,
    memoryUsage
  }
}
