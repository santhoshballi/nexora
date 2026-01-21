<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { useServicesStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import { apiService } from '@/services/api'

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()
const servicesStore = useServicesStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const dashboardData = ref(null)
const contentRef = ref(null)

const serviceId = computed(() => props.id || route.params.id)

const service = computed(() => {
  return servicesStore.getService(serviceId.value)
})

const user = computed(() => {
  return authStore.getUser(serviceId.value)
})

const dashboardStyle = computed(() => ({
  '--service-color': service.value?.color || '#7df9ff',
  '--accent-color': service.value?.accentColor || '#ffffff'
}))

onMounted(async () => {
  if (!service.value) {
    router.push('/')
    return
  }

  // Load dashboard data
  try {
    const token = authStore.getToken(serviceId.value)
    dashboardData.value = await apiService.getDashboardData(serviceId.value, token)
  } catch (err) {
    console.error('Failed to load dashboard:', err)
  } finally {
    isLoading.value = false
  }

  // Entry animation
  setTimeout(() => {
    if (contentRef.value) {
      gsap.fromTo(
        contentRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, 100)
})

function goBack() {
  router.push(`/service/${serviceId.value}/dimension`)
}

function goToUniverse() {
  router.push('/')
}

function handleLogout() {
  authStore.logout(serviceId.value)
  router.push(`/service/${serviceId.value}/dimension`)
}

function formatStatValue(value) {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return value
}
</script>

<template>
  <div class="service-dashboard" :style="dashboardStyle">
    <!-- Background -->
    <div class="dashboard-background">
      <div class="grid-pattern"></div>
    </div>

    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <button class="nav-button" @click="goBack">
          <span>←</span>
          <span>{{ service?.name }}</span>
        </button>
        <button class="nav-button" @click="goToUniverse">
          <span>○</span>
          <span>UNIVERSE</span>
        </button>
      </div>

      <div class="header-center">
        <span class="header-icon">{{ service?.icon }}</span>
        <span class="header-title">{{ service?.name }} DASHBOARD</span>
      </div>

      <div class="header-right">
        <div class="user-info">
          <span class="user-name">{{ user?.name || 'User' }}</span>
          <span class="user-email">{{ user?.email }}</span>
        </div>
        <button class="logout-button" @click="handleLogout">LOGOUT</button>
      </div>
    </header>

    <!-- Main content -->
    <main ref="contentRef" class="dashboard-content">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>Loading dashboard...</span>
      </div>

      <template v-else-if="dashboardData">
        <!-- Stats grid -->
        <section class="stats-section">
          <h2 class="section-title">METRICS</h2>
          <div class="stats-grid">
            <div v-for="(value, key) in dashboardData.stats" :key="key" class="stat-card">
              <div class="stat-value">{{ formatStatValue(value) }}</div>
              <div class="stat-label">{{ key }}</div>
            </div>
          </div>
        </section>

        <!-- Activity section -->
        <section class="activity-section">
          <h2 class="section-title">RECENT ACTIVITY</h2>
          <div class="activity-list">
            <div
              v-for="(activity, index) in dashboardData.recentActivity"
              :key="index"
              class="activity-item"
            >
              <div class="activity-indicator"></div>
              <div class="activity-content">
                <span class="activity-message">{{ activity.message }}</span>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
              <div class="activity-type">{{ activity.type }}</div>
            </div>
          </div>
        </section>

        <!-- Quick actions -->
        <section class="actions-section">
          <h2 class="section-title">QUICK ACTIONS</h2>
          <div class="actions-grid">
            <button class="action-card">
              <span class="action-icon">+</span>
              <span class="action-label">New Project</span>
            </button>
            <button class="action-card">
              <span class="action-icon">↻</span>
              <span class="action-label">Sync Data</span>
            </button>
            <button class="action-card">
              <span class="action-icon">⚙</span>
              <span class="action-label">Settings</span>
            </button>
            <button class="action-card">
              <span class="action-icon">?</span>
              <span class="action-label">Help</span>
            </button>
          </div>
        </section>
      </template>
    </main>

    <!-- Footer status bar -->
    <footer class="dashboard-footer">
      <div class="footer-left">
        <span class="status-dot"></span>
        <span class="status-text">Connected to {{ service?.name }} dimension</span>
      </div>
      <div class="footer-right">
        <span class="timestamp"
          >Last sync:
          {{
            dashboardData?.lastUpdated
              ? new Date(dashboardData.lastUpdated).toLocaleTimeString()
              : 'N/A'
          }}</span
        >
      </div>
    </footer>
  </div>
</template>

<style scoped>
.service-dashboard {
  position: relative;
  min-height: 100vh;
  background: #0a0a15;
  display: flex;
  flex-direction: column;
}

.dashboard-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.grid-pattern {
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

.dashboard-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(10, 10, 21, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 50;
  backdrop-filter: blur(10px);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  border-color: var(--service-color);
  color: var(--service-color);
}

.header-center {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--service-color), var(--accent-color));
  border-radius: 6px;
  font-size: 0.875rem;
  color: white;
}

.header-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--service-color);
  letter-spacing: 0.2em;
}

.user-info {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.user-email {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
}

.logout-button {
  background: transparent;
  border: 1px solid rgba(255, 100, 100, 0.3);
  padding: 0.5rem 1rem;
  color: rgba(255, 100, 100, 0.8);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: rgba(255, 100, 100, 0.1);
  border-color: rgba(255, 100, 100, 0.5);
}

.dashboard-content {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.5);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--service-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.section-title {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--service-color);
  letter-spacing: 0.3em;
  margin-bottom: 1.5rem;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--service-color);
}

.stat-value {
  font-size: 2rem;
  font-weight: 200;
  color: var(--service-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.activity-section {
  margin-bottom: 3rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.activity-item:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.activity-indicator {
  width: 8px;
  height: 8px;
  background: var(--service-color);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--service-color);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-message {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.activity-time {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
}

.activity-type {
  font-size: 0.625rem;
  color: var(--service-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.5rem;
  background: rgba(125, 249, 255, 0.1);
  border-radius: 4px;
}

.actions-section {
  margin-bottom: 3rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  border-color: var(--service-color);
  color: var(--service-color);
}

.action-icon {
  font-size: 1.5rem;
}

.action-label {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dashboard-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(10, 10, 21, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 50;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #00ff41;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff41;
  animation: pulse 2s ease-in-out infinite;
}

.status-text {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
}

.timestamp {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Courier New', monospace;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  .dashboard-header {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }

  .header-left,
  .header-right {
    order: 2;
    flex: 1;
  }

  .header-center {
    order: 1;
    width: 100%;
    justify-content: center;
  }

  .user-info {
    display: none;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
