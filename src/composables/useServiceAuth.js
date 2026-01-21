import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'

export function useServiceAuth(serviceId) {
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const error = ref(null)
  const scanningProgress = ref(0)
  const scanPhase = ref('idle') // idle, scanning, verifying, complete, error

  const isAuthenticated = computed(() => authStore.isAuthenticated(serviceId))
  const user = computed(() => authStore.getUser(serviceId))
  const token = computed(() => authStore.getToken(serviceId))

  async function login(email, password) {
    isLoading.value = true
    error.value = null
    scanPhase.value = 'scanning'

    // Simulate scanning animation
    const scanInterval = setInterval(() => {
      scanningProgress.value = Math.min(scanningProgress.value + 10, 90)
    }, 100)

    try {
      scanPhase.value = 'verifying'
      const result = await authService.login(serviceId, { email, password })

      clearInterval(scanInterval)
      scanningProgress.value = 100
      scanPhase.value = 'complete'

      authStore.setAuth(serviceId, {
        token: result.token,
        user: result.user
      })

      // Reset after animation completes
      setTimeout(() => {
        scanningProgress.value = 0
        scanPhase.value = 'idle'
      }, 500)

      return result
    } catch (err) {
      clearInterval(scanInterval)
      error.value = err.message
      scanPhase.value = 'error'
      scanningProgress.value = 0

      setTimeout(() => {
        scanPhase.value = 'idle'
      }, 2000)

      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(email, password, name) {
    isLoading.value = true
    error.value = null
    scanPhase.value = 'scanning'

    const scanInterval = setInterval(() => {
      scanningProgress.value = Math.min(scanningProgress.value + 8, 85)
    }, 100)

    try {
      scanPhase.value = 'verifying'
      const result = await authService.register(serviceId, { email, password, name })

      clearInterval(scanInterval)
      scanningProgress.value = 100
      scanPhase.value = 'complete'

      authStore.setAuth(serviceId, {
        token: result.token,
        user: result.user
      })

      setTimeout(() => {
        scanningProgress.value = 0
        scanPhase.value = 'idle'
      }, 500)

      return result
    } catch (err) {
      clearInterval(scanInterval)
      error.value = err.message
      scanPhase.value = 'error'
      scanningProgress.value = 0

      setTimeout(() => {
        scanPhase.value = 'idle'
      }, 2000)

      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authStore.logout(serviceId)
  }

  function clearError() {
    error.value = null
  }

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    scanningProgress,
    scanPhase,
    login,
    register,
    logout,
    clearError
  }
}
