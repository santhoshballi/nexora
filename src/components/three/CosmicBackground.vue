<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let ctx = null
let animationId = null
let stars = []
let nebulae = []

const props = defineProps({
  starCount: {
    type: Number,
    default: 200
  },
  speed: {
    type: Number,
    default: 0.5
  }
})

onMounted(() => {
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')

  resize()
  initStars()
  initNebulae()
  animate()

  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
})

function resize() {
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function initStars() {
  stars = []
  for (let i = 0; i < props.starCount; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 1000,
      size: Math.random() * 2,
      color: getRandomStarColor()
    })
  }
}

function initNebulae() {
  nebulae = []
  const colors = [
    'rgba(100, 50, 200, 0.03)',
    'rgba(50, 100, 200, 0.03)',
    'rgba(200, 50, 100, 0.02)',
    'rgba(50, 200, 150, 0.02)'
  ]

  for (let i = 0; i < 5; i++) {
    nebulae.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 200 + Math.random() * 300,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    })
  }
}

function getRandomStarColor() {
  const colors = ['#ffffff', '#fffafa', '#f0f8ff', '#add8e6', '#ffffcc']
  return colors[Math.floor(Math.random() * colors.length)]
}

function animate() {
  const canvas = canvasRef.value
  ctx.fillStyle = '#0a0a15'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw nebulae
  nebulae.forEach(nebula => {
    nebula.x += nebula.vx
    nebula.y += nebula.vy

    // Wrap around
    if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius
    if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius
    if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius
    if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius

    const gradient = ctx.createRadialGradient(
      nebula.x,
      nebula.y,
      0,
      nebula.x,
      nebula.y,
      nebula.radius
    )
    gradient.addColorStop(0, nebula.color)
    gradient.addColorStop(1, 'transparent')

    ctx.fillStyle = gradient
    ctx.fillRect(
      nebula.x - nebula.radius,
      nebula.y - nebula.radius,
      nebula.radius * 2,
      nebula.radius * 2
    )
  })

  // Draw and update stars
  stars.forEach(star => {
    star.z -= props.speed

    if (star.z <= 0) {
      star.z = 1000
      star.x = Math.random() * canvas.width
      star.y = Math.random() * canvas.height
    }

    const scale = 1000 / star.z
    const x = (star.x - canvas.width / 2) * scale + canvas.width / 2
    const y = (star.y - canvas.height / 2) * scale + canvas.height / 2
    const size = star.size * scale

    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
      ctx.beginPath()
      ctx.arc(x, y, Math.max(0.1, size), 0, Math.PI * 2)
      ctx.fillStyle = star.color
      ctx.globalAlpha = Math.min(1, (1000 - star.z) / 500)
      ctx.fill()
      ctx.globalAlpha = 1
    }
  })

  animationId = requestAnimationFrame(animate)
}
</script>

<template>
  <canvas ref="canvasRef" class="cosmic-background"></canvas>
</template>

<style scoped>
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}
</style>
