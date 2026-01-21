import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './styles/dimensions/index.css'

const app = createApp(App)

// Setup Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  // Log to console in development
  if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true') {
    console.error('Global Vue Error:', err)
    console.error('Component:', instance?.$options?.name || 'Unknown')
    console.error('Error Info:', info)
  }

  // Here you could send errors to a monitoring service like Sentry
  // if (import.meta.env.PROD) {
  //   sendToErrorMonitoring(err, { component: instance, info })
  // }
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true') {
    console.error('Unhandled Promise Rejection:', event.reason)
  }
})

app.use(pinia)
app.use(router)

app.mount('#app')
