<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { useServicesStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import AuthForm from '@/components/auth/AuthForm.vue'
import AuthGate from '@/components/auth/AuthGate.vue'

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

const contentRef = ref(null)
const showAuthForm = ref(false)
const isEntering = ref(true)

const serviceId = computed(() => props.id || route.params.id)

const service = computed(() => {
  return servicesStore.getService(serviceId.value)
})

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated(serviceId.value)
})

const dimensionStyle = computed(() => ({
  '--service-color': service.value?.color || '#7df9ff',
  '--accent-color': service.value?.accentColor || '#ffffff'
}))

onMounted(() => {
  if (!service.value) {
    router.push('/')
    return
  }

  // Entry animation
  setTimeout(() => {
    isEntering.value = false
    if (contentRef.value) {
      gsap.fromTo(
        contentRef.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
    }
  }, 500)
})

function goBack() {
  router.push('/')
}

function goToDashboard() {
  router.push(`/service/${serviceId.value}/dashboard`)
}

function handleAuthRequest() {
  showAuthForm.value = true
}

function handleAuthSuccess() {
  showAuthForm.value = false
}

function handleAuthClose() {
  showAuthForm.value = false
}
</script>

<template>
  <div class="service-dimension" :style="dimensionStyle" :class="service?.id">
    <!-- Entry flash -->
    <Transition name="fade">
      <div v-if="isEntering" class="entry-flash"></div>
    </Transition>

    <!-- Background pattern -->
    <div class="dimension-background">
      <div class="pattern"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Navigation -->
    <header class="dimension-header">
      <button class="back-button" @click="goBack">
        <span class="back-arrow">\u2190</span>
        <span class="back-text">UNIVERSE</span>
      </button>

      <div class="service-badge">
        <span class="badge-icon">{{ service?.icon }}</span>
        <span class="badge-name">{{ service?.name }}</span>
      </div>

      <div class="header-spacer"></div>
    </header>

    <!-- Main content -->
    <main ref="contentRef" class="dimension-content">
      <!-- Hero section -->
      <section class="hero-section">
        <div class="hero-icon">{{ service?.icon }}</div>
        <h1 class="hero-title">{{ service?.name }}</h1>
        <p class="hero-tagline">{{ service?.tagline }}</p>
        <p class="hero-description">{{ service?.description }}</p>
      </section>

      <!-- Features section -->
      <section class="features-section">
        <h2 class="section-title">CAPABILITIES</h2>
        <div class="features-grid">
          <div
            v-for="(feature, index) in service?.features"
            :key="feature"
            class="feature-card"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div class="feature-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="feature-name">{{ feature }}</div>
          </div>
        </div>
      </section>

      <!-- Dashboard access section -->
      <section class="access-section">
        <h2 class="section-title">COMMAND CENTER</h2>

        <template v-if="isAuthenticated">
          <div class="authenticated-panel">
            <div class="auth-status">
              <span class="status-icon">\u2713</span>
              <span class="status-text">Access Granted</span>
            </div>
            <button class="dashboard-button" @click="goToDashboard">
              <span class="button-text">ENTER DASHBOARD</span>
              <span class="button-arrow">\u2192</span>
            </button>
          </div>
        </template>

        <template v-else>
          <AuthGate
            :service-id="serviceId"
            :service-color="service?.color"
            :service-name="service?.name"
            @request-auth="handleAuthRequest"
          />
        </template>
      </section>
    </main>

    <!-- Auth form modal -->
    <Transition name="fade">
      <AuthForm
        v-if="showAuthForm"
        :service-id="serviceId"
        :service-color="service?.color"
        @success="handleAuthSuccess"
        @close="handleAuthClose"
      />
    </Transition>

    <!-- Decorative corners -->
    <div class="corner-bracket top-left"></div>
    <div class="corner-bracket top-right"></div>
    <div class="corner-bracket bottom-left"></div>
    <div class="corner-bracket bottom-right"></div>
  </div>
</template>

<style scoped>
.service-dimension {
  position: relative;
  min-height: 100vh;
  background: #0a0a15;
  overflow-x: hidden;
}

.entry-flash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--service-color);
  z-index: 100;
  animation: flash-out 0.5s ease-out forwards;
}

.dimension-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 80%, var(--service-color) 0%, transparent 25%),
    radial-gradient(circle at 80% 20%, var(--accent-color) 0%, transparent 25%);
  opacity: 0.05;
}

.gradient-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 21, 0) 0%,
    rgba(10, 10, 21, 0.8) 50%,
    rgba(10, 10, 21, 1) 100%
  );
}

.dimension-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  z-index: 50;
  background: linear-gradient(180deg, rgba(10, 10, 21, 0.9) 0%, transparent 100%);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  border-color: var(--service-color);
  color: var(--service-color);
}

.back-arrow {
  font-size: 1rem;
}

.back-text {
  font-size: 0.625rem;
  letter-spacing: 0.2em;
}

.service-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-icon {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--service-color), var(--accent-color));
  border-radius: 6px;
  font-size: 1rem;
  color: white;
}

.badge-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--service-color);
  letter-spacing: 0.2em;
}

.header-spacer {
  width: 100px;
}

.dimension-content {
  position: relative;
  z-index: 1;
  padding: 120px 2rem 4rem;
  max-width: 900px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, var(--service-color), var(--accent-color));
  border-radius: 20px;
  color: white;
  box-shadow: 0 0 60px rgba(125, 249, 255, 0.3);
}

.hero-title {
  margin: 0 0 0.5rem;
  font-size: 3rem;
  font-weight: 200;
  color: var(--service-color);
  letter-spacing: 0.3em;
  text-shadow: 0 0 30px var(--service-color);
}

.hero-tagline {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.hero-description {
  margin: 0;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--service-color);
  letter-spacing: 0.3em;
  margin-bottom: 2rem;
  text-align: center;
}

.features-section {
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease;
  animation: feature-enter 0.5s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.feature-card:hover {
  border-color: var(--service-color);
  background: rgba(255, 255, 255, 0.05);
}

.feature-number {
  font-size: 0.625rem;
  color: var(--service-color);
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
}

.feature-name {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.access-section {
  max-width: 500px;
  margin: 0 auto;
}

.authenticated-panel {
  text-align: center;
}

.auth-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #00ff41;
}

.status-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #00ff41;
  border-radius: 50%;
}

.status-text {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.dashboard-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: var(--service-color);
  border: none;
  padding: 1rem 2rem;
  color: #0a0a15;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dashboard-button:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 30px var(--service-color);
}

.button-text {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
}

.button-arrow {
  font-size: 1.25rem;
}

.corner-bracket {
  position: fixed;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.corner-bracket.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner-bracket.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner-bracket.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner-bracket.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

@keyframes flash-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes feature-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

@media (max-width: 768px) {
  .dimension-header {
    padding: 1rem;
  }

  .badge-name {
    display: none;
  }

  .header-spacer {
    width: 50px;
  }

  .dimension-content {
    padding: 100px 1rem 2rem;
  }

  .hero-title {
    font-size: 2rem;
    letter-spacing: 0.2em;
  }

  .hero-icon {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }
}
</style>
