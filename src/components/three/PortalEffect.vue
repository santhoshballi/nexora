<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#7df9ff'
  },
  progress: {
    type: Number,
    default: 0
  }
})

const portalRef = ref(null)
const rings = ref([])
const particles = ref([])

// Generate portal ring data
onMounted(() => {
  for (let i = 0; i < 5; i++) {
    rings.value.push({
      id: i,
      delay: i * 0.1,
      scale: 1 + i * 0.3
    })
  }

  // Generate particles
  for (let i = 0; i < 30; i++) {
    particles.value.push({
      id: i,
      angle: (i / 30) * Math.PI * 2,
      distance: 100 + Math.random() * 50,
      size: 2 + Math.random() * 4,
      speed: 0.5 + Math.random() * 1.5
    })
  }
})

const portalStyle = computed(() => ({
  '--portal-color': props.color,
  '--progress': props.progress
}))

watch(
  () => props.active,
  active => {
    if (active && portalRef.value) {
      gsap.fromTo(
        portalRef.value,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }
      )
    }
  }
)
</script>

<template>
  <div ref="portalRef" class="portal-effect" :class="{ active }" :style="portalStyle">
    <!-- Central portal -->
    <div class="portal-core">
      <div class="portal-vortex"></div>
      <div class="portal-center"></div>
    </div>

    <!-- Rotating rings -->
    <div
      v-for="ring in rings"
      :key="ring.id"
      class="portal-ring"
      :style="{
        '--ring-scale': ring.scale,
        '--ring-delay': ring.delay + 's'
      }"
    ></div>

    <!-- Orbital particles -->
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="portal-particle"
      :style="{
        '--angle': particle.angle + 'rad',
        '--distance': particle.distance + 'px',
        '--size': particle.size + 'px',
        '--speed': particle.speed + 's'
      }"
    ></div>

    <!-- Energy streams -->
    <div class="energy-streams">
      <div v-for="i in 8" :key="i" class="stream" :style="{ '--i': i }"></div>
    </div>

    <!-- Distortion overlay -->
    <div class="distortion-overlay"></div>
  </div>
</template>

<style scoped>
.portal-effect {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  pointer-events: none;
  z-index: 50;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.portal-effect.active {
  opacity: 1;
}

.portal-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.portal-vortex {
  position: absolute;
  width: 100%;
  height: 100%;
  background: conic-gradient(
    from 0deg,
    var(--portal-color),
    transparent,
    var(--portal-color),
    transparent,
    var(--portal-color)
  );
  border-radius: 50%;
  animation: vortex-spin 1s linear infinite;
  filter: blur(5px);
}

.portal-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, white 0%, var(--portal-color) 50%, transparent 100%);
  border-radius: 50%;
  box-shadow:
    0 0 30px var(--portal-color),
    0 0 60px var(--portal-color),
    0 0 90px var(--portal-color);
}

.portal-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(var(--ring-scale));
  width: 80%;
  height: 80%;
  border: 2px solid var(--portal-color);
  border-radius: 50%;
  opacity: 0.5;
  animation: ring-pulse 1.5s ease-in-out infinite;
  animation-delay: var(--ring-delay);
}

.portal-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--size);
  height: var(--size);
  background: var(--portal-color);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--portal-color);
  animation: orbit var(--speed) linear infinite;
  --x: calc(cos(var(--angle)) * var(--distance));
  --y: calc(sin(var(--angle)) * var(--distance));
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y)));
}

.energy-streams {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.stream {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 150px;
  background: linear-gradient(to top, transparent, var(--portal-color), transparent);
  transform-origin: bottom center;
  transform: translate(-50%, -100%) rotate(calc(var(--i) * 45deg));
  animation: stream-pulse 0.5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.1s);
}

.distortion-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  mix-blend-mode: overlay;
  animation: distortion 0.1s linear infinite;
}

@keyframes vortex-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(var(--ring-scale));
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(calc(var(--ring-scale) * 1.1));
    opacity: 0.2;
  }
}

@keyframes orbit {
  from {
    transform: translate(-50%, -50%) rotate(0deg) translateX(var(--distance));
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg) translateX(var(--distance));
  }
}

@keyframes stream-pulse {
  0%,
  100% {
    opacity: 0.3;
    height: 150px;
  }
  50% {
    opacity: 1;
    height: 200px;
  }
}

@keyframes distortion {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
