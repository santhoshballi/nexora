<script setup>
import { ref, computed, watch } from 'vue'
import { useServiceAuth } from '@/composables/useServiceAuth'

const props = defineProps({
  serviceId: {
    type: String,
    required: true
  },
  serviceColor: {
    type: String,
    default: '#7df9ff'
  }
})

const emit = defineEmits(['success', 'close'])

const { isLoading, error, scanningProgress, scanPhase, login, register, clearError } =
  useServiceAuth(props.serviceId)

const mode = ref('login') // 'login' or 'register'
const email = ref('')
const password = ref('')
const name = ref('')

const formStyle = computed(() => ({
  '--service-color': props.serviceColor
}))

const isFormValid = computed(() => {
  if (mode.value === 'login') {
    return email.value.length > 0 && password.value.length > 0
  }
  return email.value.length > 0 && password.value.length > 0 && name.value.length > 0
})

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  clearError()
}

async function handleSubmit() {
  if (!isFormValid.value || isLoading.value) return

  try {
    if (mode.value === 'login') {
      await login(email.value, password.value)
    } else {
      await register(email.value, password.value, name.value)
    }
    emit('success')
  } catch {
    // Error is handled by the composable
  }
}

function handleClose() {
  emit('close')
}

watch(scanPhase, phase => {
  if (phase === 'complete') {
    setTimeout(() => emit('success'), 500)
  }
})
</script>

<template>
  <div class="auth-form-overlay" @click.self="handleClose">
    <div class="auth-form" :style="formStyle">
      <!-- Close button -->
      <button class="close-button" @click="handleClose">✕</button>

      <!-- Header -->
      <div class="form-header">
        <h2 class="form-title">{{ mode === 'login' ? 'ACCESS' : 'INITIALIZE' }}</h2>
        <p class="form-subtitle">
          {{ mode === 'login' ? 'Enter your credentials' : 'Create new identity' }}
        </p>
      </div>

      <!-- Scanning animation -->
      <Transition name="fade">
        <div v-if="isLoading" class="scanning-overlay">
          <div class="scan-line" :style="{ '--progress': scanningProgress / 100 }"></div>
          <div class="scan-status">
            <span class="scan-phase">{{ scanPhase.toUpperCase() }}</span>
            <span class="scan-progress">{{ scanningProgress }}%</span>
          </div>
        </div>
      </Transition>

      <!-- Form -->
      <form class="form-content" @submit.prevent="handleSubmit">
        <!-- Name field (register only) -->
        <Transition name="slide">
          <div v-if="mode === 'register'" class="form-field">
            <label class="field-label">DESIGNATION</label>
            <input
              v-model="name"
              type="text"
              class="field-input"
              placeholder="Enter your name"
              :disabled="isLoading"
            />
          </div>
        </Transition>

        <!-- Email field -->
        <div class="form-field">
          <label class="field-label">IDENTIFIER</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </div>

        <!-- Password field -->
        <div class="form-field">
          <label class="field-label">ACCESS KEY</label>
          <input
            v-model="password"
            type="password"
            class="field-input"
            placeholder="Enter your password"
            :disabled="isLoading"
          />
        </div>

        <!-- Error message -->
        <Transition name="fade">
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠</span>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Submit button -->
        <button type="submit" class="submit-button" :disabled="!isFormValid || isLoading">
          <span v-if="!isLoading">{{ mode === 'login' ? 'AUTHENTICATE' : 'REGISTER' }}</span>
          <span v-else class="loading-dots"> <span>.</span><span>.</span><span>.</span> </span>
        </button>
      </form>

      <!-- Mode toggle -->
      <div class="mode-toggle">
        <span class="toggle-text">
          {{ mode === 'login' ? 'New to this dimension?' : 'Already have access?' }}
        </span>
        <button class="toggle-button" :disabled="isLoading" @click="toggleMode">
          {{ mode === 'login' ? 'REGISTER' : 'LOGIN' }}
        </button>
      </div>

      <!-- Corner decorations -->
      <div class="corner top-left"></div>
      <div class="corner top-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner bottom-right"></div>
    </div>
  </div>
</template>

<style scoped>
.auth-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.auth-form {
  position: relative;
  width: 90%;
  max-width: 400px;
  background: rgba(10, 10, 21, 0.98);
  border: 1px solid var(--service-color);
  padding: 2rem;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  border-color: var(--service-color);
  color: var(--service-color);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--service-color);
  letter-spacing: 0.3em;
}

.form-subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.scanning-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 21, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--service-color);
  box-shadow: 0 0 20px var(--service-color);
  transform: translateY(calc(var(--progress) * 100vh));
  animation: scan-sweep 2s ease-in-out infinite;
}

.scan-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.scan-phase {
  font-size: 0.875rem;
  color: var(--service-color);
  letter-spacing: 0.3em;
}

.scan-progress {
  font-size: 2rem;
  font-weight: 300;
  color: white;
  font-family: 'Courier New', monospace;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.625rem;
  color: var(--service-color);
  letter-spacing: 0.2em;
}

.field-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: white;
  transition: all 0.3s ease;
}

.field-input:focus {
  outline: none;
  border-color: var(--service-color);
  background: rgba(255, 255, 255, 0.08);
}

.field-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.field-input:disabled {
  opacity: 0.5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 50, 50, 0.1);
  border: 1px solid rgba(255, 50, 50, 0.3);
  color: #ff6b6b;
  font-size: 0.75rem;
}

.error-icon {
  font-size: 1rem;
}

.submit-button {
  background: var(--service-color);
  border: none;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a0a15;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  filter: brightness(1.1);
  box-shadow: 0 0 20px var(--service-color);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-dots span {
  animation: blink 1.4s infinite both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.mode-toggle {
  margin-top: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.toggle-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.toggle-button {
  background: transparent;
  border: none;
  color: var(--service-color);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-button:hover:not(:disabled) {
  text-decoration: underline;
}

.toggle-button:disabled {
  opacity: 0.5;
}

.corner {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 1px solid var(--service-color);
}

.corner.top-left {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

@keyframes scan-sweep {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

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

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
