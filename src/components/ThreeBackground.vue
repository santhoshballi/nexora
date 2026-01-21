<script setup>
import { onMounted, watch, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  mood: {
    type: String,
    default: 'neutral'
  }
})
const container = ref(null)

let scene, camera, renderer, particles, frameId

onMounted(() => {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 200

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  container.value.appendChild(renderer.domElement)

  const geometry = new THREE.BufferGeometry()
  const count = 1200
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 600
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0x7df9ff,
    size: 1.5,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  const animate = () => {
    particles.rotation.y += 0.0004
    particles.rotation.x += 0.0001
    renderer.render(scene, camera)
    frameId = requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener('resize', resize)
})

function resize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

watch(
  () => props.mood,
  mood => {
    if (!particles) return
    const colors = {
      creation: 0x7df9ff,
      intelligence: 0x5a3fff,
      human: 0xff8bd4,
      neutral: 0x7df9ff
    }
    particles.material.color.setHex(colors[mood] || colors.neutral)
  }
)

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  if (renderer) renderer.dispose()
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div ref="container" class="three-bg"></div>
</template>

<style scoped>
.three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: transparent;
}

.three-bg :deep(canvas) {
  display: block;
}
</style>
