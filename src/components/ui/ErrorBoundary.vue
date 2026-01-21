<script setup>
import { ref, onErrorCaptured } from 'vue'

defineProps({
  fallbackMessage: {
    type: String,
    default: 'Something went wrong'
  }
})

const error = ref(null)
const errorInfo = ref(null)

const reset = () => {
  error.value = null
  errorInfo.value = null
}

onErrorCaptured((err, instance, info) => {
  error.value = err
  errorInfo.value = info

  // Log error for debugging
  if (import.meta.env.VITE_DEBUG_MODE === 'true') {
    console.error('Error caught by boundary:', err)
    console.error('Component:', instance)
    console.error('Info:', info)
  }

  // Prevent error from propagating
  return false
})
</script>

<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">⚠</div>
      <h2 class="error-title">{{ fallbackMessage }}</h2>
      <p class="error-message">{{ error.message }}</p>
      <div v-if="errorInfo" class="error-info">
        <code>{{ errorInfo }}</code>
      </div>
      <button class="retry-button" @click="reset">Try Again</button>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  background: rgba(255, 50, 50, 0.1);
  border: 1px solid rgba(255, 50, 50, 0.3);
  border-radius: 12px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
}

.error-message {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.error-info {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 75, 75, 0.4);
}
</style>
