<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { useServicesStore } from '@/stores/services'
import PortalEffect from '@/components/three/PortalEffect.vue'

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()
const servicesStore = useServicesStore()

const progress = ref(0)
const phase = ref('entering') // entering, traveling, arriving

const service = computed(() => {
  return servicesStore.getService(props.id || route.params.id)
})

const portalStyle = computed(() => ({
  '--service-color': service.value?.color || '#7df9ff',
  '--accent-color': service.value?.accentColor || '#ffffff'
}))

onMounted(() => {
  if (!service.value) {
    router.push('/')
    return
  }

  startPortalSequence()
})

function startPortalSequence() {
  const timeline = gsap.timeline()

  // Phase 1: Portal opening
  timeline.to(progress, {
    value: 0.3,
    duration: 0.5,
    ease: 'power2.in',
    onStart: () => {
      phase.value = 'entering'
    }
  })

  // Phase 2: Traveling through portal
  timeline.to(progress, {
    value: 0.8,
    duration: 1,
    ease: 'power3.in',
    onStart: () => {
      phase.value = 'traveling'
    }
  })

  // Phase 3: Arriving
  timeline.to(progress, {
    value: 1,
    duration: 0.5,
    ease: 'power2.out',
    onStart: () => {
      phase.value = 'arriving'
    },
    onComplete: () => {
      router.push(`/service/${service.value.id}/dimension`)
    }
  })
}
</script>

<template>
  <div class="service-portal" :style="portalStyle">
    <!-- Background -->
    <div class="portal-background">
      <div class="star-field"></div>
      <div class="warp-tunnel" :class="{ active: phase === 'traveling' }"></div>
    </div>

    <!-- Portal effect -->
    <PortalEffect :active="true" :color="service?.color" :progress="progress" />

    <!-- Status display -->
    <div class="portal-status">
      <div class="status-label">
        {{
          phase === 'entering'
            ? 'INITIALIZING PORTAL'
            : phase === 'traveling'
              ? 'TRAVERSING DIMENSIONS'
              : 'ARRIVING AT DESTINATION'
        }}
      </div>
      <div class="status-bar">
        <div class="status-fill" :style="{ width: `${progress * 100}%` }"></div>
      </div>
      <div class="destination">
        <span class="dest-label">DESTINATION:</span>
        <span class="dest-name">{{ service?.name }}</span>
      </div>
    </div>

    <!-- Overlay effects -->
    <div class="chromatic-aberration" :class="{ active: phase === 'traveling' }"></div>
    <div class="flash-overlay" :class="{ active: phase === 'arriving' }"></div>
  </div>
</template>

<style scoped>
.service-portal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0a0a15;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.portal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.star-field {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-image:
    radial-gradient(2px 2px at 50px 50px, white, transparent),
    radial-gradient(1px 1px at 100px 100px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1.5px 1.5px at 150px 30px, rgba(255, 255, 255, 0.6), transparent);
  background-size: 200px 200px;
  animation: star-rotate 60s linear infinite;
}

.warp-tunnel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    var(--service-color) 50%,
    var(--accent-color) 70%,
    transparent 100%
  );
  border-radius: 50%;
  transition: all 0.5s ease;
  opacity: 0;
}

.warp-tunnel.active {
  width: 300vmax;
  height: 300vmax;
  opacity: 0.3;
  animation: warp-pulse 0.5s ease-in-out infinite;
}

.portal-status {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.status-label {
  font-size: 0.75rem;
  color: var(--service-color);
  letter-spacing: 0.3em;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px var(--service-color);
}

.status-bar {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 auto 1.5rem;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  background: var(--service-color);
  box-shadow: 0 0 10px var(--service-color);
  transition: width 0.1s linear;
}

.destination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.625rem;
}

.dest-label {
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.2em;
}

.dest-name {
  color: var(--service-color);
  font-weight: 600;
  letter-spacing: 0.2em;
}

.chromatic-aberration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chromatic-aberration.active {
  opacity: 1;
  animation: chromatic 0.05s linear infinite;
}

.flash-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  pointer-events: none;
  z-index: 30;
  opacity: 0;
  transition: opacity 0.1s ease;
}

.flash-overlay.active {
  animation: flash 0.5s ease-out forwards;
}

@keyframes star-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes warp-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.5;
  }
}

@keyframes chromatic {
  0% {
    box-shadow:
      inset -2px 0 rgba(255, 0, 0, 0.3),
      inset 2px 0 rgba(0, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      inset 2px 0 rgba(255, 0, 0, 0.3),
      inset -2px 0 rgba(0, 255, 255, 0.3);
  }
  100% {
    box-shadow:
      inset -2px 0 rgba(255, 0, 0, 0.3),
      inset 2px 0 rgba(0, 255, 255, 0.3);
  }
}

@keyframes flash {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
