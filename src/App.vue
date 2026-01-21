<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Prevent context menu on right-click for immersive experience
  document.addEventListener('contextmenu', e => {
    // Allow in development
    if (import.meta.env.DEV) return
    e.preventDefault()
  })
})
</script>

<template>
  <div id="nexus-app">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
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
}

body {
  background: #0a0a15;
  overflow: hidden;
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
