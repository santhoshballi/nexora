<script setup>
import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

const toastTypes = {
  success: {
    icon: '✓',
    color: '#00ff41',
    bg: 'rgba(0, 255, 65, 0.1)',
    border: 'rgba(0, 255, 65, 0.3)'
  },
  error: {
    icon: '✕',
    color: '#ff6b6b',
    bg: 'rgba(255, 107, 107, 0.1)',
    border: 'rgba(255, 107, 107, 0.3)'
  },
  warning: {
    icon: '⚠',
    color: '#feca57',
    bg: 'rgba(254, 202, 87, 0.1)',
    border: 'rgba(254, 202, 87, 0.3)'
  },
  info: {
    icon: 'ℹ',
    color: '#7df9ff',
    bg: 'rgba(125, 249, 255, 0.1)',
    border: 'rgba(125, 249, 255, 0.3)'
  }
}

function addToast(message, type = 'info', duration = 3000) {
  const id = ++toastId
  const toast = {
    id,
    message,
    type,
    duration,
    visible: false,
    leaving: false
  }

  toasts.value.push(toast)

  // Trigger entrance animation
  setTimeout(() => {
    toast.visible = true
  }, 10)

  // Auto remove
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

function removeToast(id) {
  const toast = toasts.value.find(t => t.id === id)
  if (toast && !toast.leaving) {
    toast.leaving = true
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }, 300)
  }
}

// Expose globally
window.showToast = addToast
window.removeToast = removeToast

defineExpose({
  addToast,
  removeToast
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="[
            `toast--${toast.type}`,
            { 'toast--visible': toast.visible, 'toast--leaving': toast.leaving }
          ]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            {{ toastTypes[toast.type].icon }}
          </div>
          <div class="toast-message">
            {{ toast.message }}
          </div>
          <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid;
  backdrop-filter: blur(20px);
  min-width: 300px;
  max-width: 500px;
  cursor: pointer;
  pointer-events: auto;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
}

.toast--visible {
  transform: translateX(0);
  opacity: 1;
}

.toast--leaving {
  transform: translateX(100%);
  opacity: 0;
}

.toast--success {
  background: v-bind('toastTypes.success.bg');
  border-color: v-bind('toastTypes.success.border');
  color: v-bind('toastTypes.success.color');
}

.toast--error {
  background: v-bind('toastTypes.error.bg');
  border-color: v-bind('toastTypes.error.border');
  color: v-bind('toastTypes.error.color');
}

.toast--warning {
  background: v-bind('toastTypes.warning.bg');
  border-color: v-bind('toastTypes.warning.border');
  color: v-bind('toastTypes.warning.color');
}

.toast--info {
  background: v-bind('toastTypes.info.bg');
  border-color: v-bind('toastTypes.info.border');
  color: v-bind('toastTypes.info.color');
}

.toast-icon {
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>
