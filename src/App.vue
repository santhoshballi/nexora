<script setup>
import { onMounted } from 'vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import PerformanceMonitor from '@/components/hud/PerformanceMonitor.vue'
import AIAssistant from '@/components/hud/AIAssistant.vue'
import { useGestureControls } from '@/composables/useGestureControls.js'
import { useAIAssistant } from '@/composables/useAIAssistant.js'
import { useSoundSystem } from '@/composables/useSoundSystem.js'

const { enableGestures } = useGestureControls()
const { provideContextualHelp } = useAIAssistant()
const { initAudio } = useSoundSystem()

onMounted(() => {
  // Initialize audio on first user interaction
  const initAudioOnInteraction = async () => {
    await initAudio()
    // Remove listeners after initialization
    document.removeEventListener('click', initAudioOnInteraction)
    document.removeEventListener('touchstart', initAudioOnInteraction)
    document.removeEventListener('keydown', initAudioOnInteraction)
  }

  // Listen for first user interaction
  document.addEventListener('click', initAudioOnInteraction, { once: false })
  document.addEventListener('touchstart', initAudioOnInteraction, { once: false })
  document.addEventListener('keydown', initAudioOnInteraction, { once: false })

  // Prevent context menu on right-click for immersive experience
  document.addEventListener('contextmenu', e => {
    // Allow in development
    if (import.meta.env.DEV) return
    e.preventDefault()
  })

  // Show welcome toast
  if (window.showToast) {
    window.showToast('Welcome to NEXORA - Navigate the Multiverse', 'info', 4000)
  }

  // Enable gesture controls
  enableGestures()

  // Provide contextual help for first-time users
  setTimeout(() => {
    provideContextualHelp('first_visit')
  }, 2000)

  // Listen for gesture events
  window.addEventListener('gesture', e => {
    const { action } = e.detail

    switch (action) {
      case 'toggleView':
        window.showToast('Gesture detected: Toggle 3D/Grid view', 'info', 2000)
        break
      case 'navigateForward':
        window.showToast('Gesture detected: Navigate forward', 'info', 2000)
        break
      case 'navigateBack':
        window.showToast('Gesture detected: Navigate back', 'info', 2000)
        break
      case 'select':
        window.showToast('Gesture detected: Select service', 'info', 2000)
        break
    }
  })
})
</script>

<template>
  <div id="nexus-app">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="route.meta.keepAlive ? [route.name] : []">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>

    <!-- Global UI Components -->
    <ToastContainer />
    <PerformanceMonitor />
    <AIAssistant />
  </div>
</template>

<style>
/* Global app styles */
#nexus-app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a15;
  color: #ffffff;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    sans-serif;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Base reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

body {
  background: #0a0a15;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: fixed;
}

/* Selection styling */
::selection {
  background: rgba(125, 249, 255, 0.3);
  color: #ffffff;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

::-webkit-scrollbar-thumb {
  background: rgba(125, 249, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(125, 249, 255, 0.4);
}

/* Route transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Focus styles */
:focus-visible {
  outline: 2px solid rgba(125, 249, 255, 0.5);
  outline-offset: 2px;
}

/* Button reset */
button {
  font-family: inherit;
  cursor: pointer;
}

/* Link reset */
a {
  color: inherit;
  text-decoration: none;
}

/* Input reset */
input {
  font-family: inherit;
  background: none;
  border: none;
  outline: none;
  color: inherit;
}

/* Remove tap highlight on mobile */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
