<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  mood: {
    type: String,
    default: 'neutral'
  }
})

const eye = ref(null)
const core = ref(null)
let blinkTimer
let driftTween

function handleMouse(e) {
  if (!eye.value) return
  const x = (e.clientX / window.innerWidth - 0.5) * 14
  const y = (e.clientY / window.innerHeight - 0.5) * 14
  eye.value.style.transform = `translate(${x}px, ${y}px)`
}

function blink() {
  if (!eye.value) return
  gsap.to(eye.value, { scaleY: 0.1, duration: 0.08, ease: 'power2.in' })
  gsap.to(eye.value, { scaleY: 1, duration: 0.12, delay: 0.1, ease: 'power2.out' })
  blinkTimer = setTimeout(blink, Math.random() * 3000 + 2500)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouse)

  // Start blinking
  blinkTimer = setTimeout(blink, 2000)

  // Start floating drift
  if (core.value) {
    driftTween = gsap.to(core.value, {
      y: 8,
      x: 6,
      yoyo: true,
      repeat: -1,
      duration: 6,
      ease: 'sine.inOut'
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouse)
  clearTimeout(blinkTimer)
  if (driftTween) driftTween.kill()
})

watch(
  () => props.mood,
  mood => {
    if (!core.value) return

    const moodConfig = {
      creation: { glow: '#7df9ff', scale: 1.08 },
      intelligence: { glow: '#5a3fff', scale: 1.12 },
      human: { glow: '#ff8bd4', scale: 1.05 },
      neutral: { glow: 'rgba(125,249,255,0.4)', scale: 1 }
    }

    const config = moodConfig[mood] || moodConfig.neutral

    gsap.to(core.value, {
      boxShadow: `0 0 50px ${config.glow}`,
      scale: config.scale,
      duration: 0.6,
      ease: 'power3.out'
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="avatar">
    <div ref="core" class="core">
      <div ref="eye" class="eye"></div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.core {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #7df9ff, #5a3fff 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 40px rgba(125, 249, 255, 0.4);
  animation: breathe 4s ease-in-out infinite;
}

.eye {
  width: 28px;
  height: 28px;
  background: #000;
  border-radius: 50%;
  transform-origin: center;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
}
</style>
