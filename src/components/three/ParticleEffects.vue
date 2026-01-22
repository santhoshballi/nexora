<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true
  },
  particleCount: {
    type: Number,
    default: 1000
  },
  color: {
    type: String,
    default: '#7df9ff'
  },
  size: {
    type: Number,
    default: 2
  },
  speed: {
    type: Number,
    default: 1
  }
})

const particleSystem = ref(null)
const animationId = ref(null)

function createParticleSystem(scene) {
  if (!props.enabled) return

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(props.particleCount * 3)
  const velocities = new Float32Array(props.particleCount * 3)
  const sizes = new Float32Array(props.particleCount)
  const colors = new Float32Array(props.particleCount * 3)

  const color = new THREE.Color(props.color)

  for (let i = 0; i < props.particleCount; i++) {
    const i3 = i * 3

    // Random positions in sphere
    const radius = Math.random() * 20
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    // Random velocities
    velocities[i3] = (Math.random() - 0.5) * 0.02 * props.speed
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02 * props.speed
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02 * props.speed

    // Random sizes
    sizes[i] = Math.random() * props.size + 0.5

    // Colors with variation
    colors[i3] = color.r + (Math.random() - 0.5) * 0.1
    colors[i3 + 1] = color.g + (Math.random() - 0.5) * 0.1
    colors[i3 + 2] = color.b + (Math.random() - 0.5) * 0.1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Particle material
  const material = new THREE.PointsMaterial({
    size: props.size,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })

  particleSystem.value = new THREE.Points(geometry, material)
  scene.add(particleSystem.value)

  return particleSystem.value
}

function updateParticles() {
  if (!particleSystem.value || !props.enabled) return

  const positions = particleSystem.value.geometry.attributes.position.array
  const velocities = particleSystem.value.geometry.attributes.velocity.array

  for (let i = 0; i < props.particleCount; i++) {
    const i3 = i * 3

    // Update positions
    positions[i3] += velocities[i3]
    positions[i3 + 1] += velocities[i3 + 1]
    positions[i3 + 2] += velocities[i3 + 2]

    // Boundary check - wrap around
    const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2)

    if (distance > 25) {
      // Reset to center
      positions[i3] = (Math.random() - 0.5) * 5
      positions[i3 + 1] = (Math.random() - 0.5) * 5
      positions[i3 + 2] = (Math.random() - 0.5) * 5
    }
  }

  particleSystem.value.geometry.attributes.position.needsUpdate = true
}

function animate() {
  if (!props.enabled) return

  updateParticles()

  // Rotate particle system
  if (particleSystem.value) {
    particleSystem.value.rotation.y += 0.001
    particleSystem.value.rotation.x += 0.0005
  }

  animationId.value = requestAnimationFrame(animate)
}

function createExplosion(position, color = '#ff6b6b') {
  if (!particleSystem.value) return

  const explosionGeometry = new THREE.BufferGeometry()
  const explosionCount = 50
  const positions = new Float32Array(explosionCount * 3)
  const velocities = new Float32Array(explosionCount * 3)
  const colors = new Float32Array(explosionCount * 3)

  const explosionColor = new THREE.Color(color)

  for (let i = 0; i < explosionCount; i++) {
    const i3 = i * 3

    positions[i3] = position.x
    positions[i3 + 1] = position.y
    positions[i3 + 2] = position.z

    // Explosion velocities
    const speed = Math.random() * 0.5 + 0.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    velocities[i3] = speed * Math.sin(phi) * Math.cos(theta)
    velocities[i3 + 1] = speed * Math.sin(phi) * Math.sin(theta)
    velocities[i3 + 2] = speed * Math.cos(phi)

    colors[i3] = explosionColor.r
    colors[i3 + 1] = explosionColor.g
    colors[i3 + 2] = explosionColor.b
  }

  explosionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  explosionGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  explosionGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const explosionMaterial = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1
  })

  const explosion = new THREE.Points(explosionGeometry, explosionMaterial)

  // Add to scene temporarily
  const scene = particleSystem.value.parent
  scene.add(explosion)

  // Animate explosion
  let opacity = 1
  const explosionAnimation = () => {
    opacity -= 0.02

    if (opacity <= 0) {
      scene.remove(explosion)
      return
    }

    explosionMaterial.opacity = opacity

    const positions = explosion.geometry.attributes.position.array
    const velocities = explosion.geometry.attributes.velocity.array

    for (let i = 0; i < explosionCount; i++) {
      const i3 = i * 3
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]
    }

    explosion.geometry.attributes.position.needsUpdate = true
    requestAnimationFrame(explosionAnimation)
  }

  explosionAnimation()
}

function createTrail(startPos, endPos, color = '#7df9ff') {
  if (!particleSystem.value) return

  const trailGeometry = new THREE.BufferGeometry()
  const trailCount = 20
  const positions = new Float32Array(trailCount * 3)
  const colors = new Float32Array(trailCount * 3)

  const trailColor = new THREE.Color(color)

  for (let i = 0; i < trailCount; i++) {
    const i3 = i * 3
    const t = i / (trailCount - 1)

    // Interpolate between start and end positions
    positions[i3] = startPos.x + (endPos.x - startPos.x) * t
    positions[i3 + 1] = startPos.y + (endPos.y - startPos.y) * t
    positions[i3 + 2] = startPos.z + (endPos.z - startPos.z) * t

    colors[i3] = trailColor.r
    colors[i3 + 1] = trailColor.g
    colors[i3 + 2] = trailColor.b
  }

  trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const trailMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
  })

  const trail = new THREE.Line(trailGeometry, trailMaterial)

  const scene = particleSystem.value.parent
  scene.add(trail)

  // Fade out trail
  let opacity = 0.8
  const fadeAnimation = () => {
    opacity -= 0.02

    if (opacity <= 0) {
      scene.remove(trail)
      return
    }

    trailMaterial.opacity = opacity
    requestAnimationFrame(fadeAnimation)
  }

  fadeAnimation()
}

function updateColor(newColor) {
  if (!particleSystem.value) return

  const color = new THREE.Color(newColor)
  const colors = particleSystem.value.geometry.attributes.color.array

  for (let i = 0; i < props.particleCount; i++) {
    const i3 = i * 3
    colors[i3] = color.r + (Math.random() - 0.5) * 0.1
    colors[i3 + 1] = color.g + (Math.random() - 0.5) * 0.1
    colors[i3 + 2] = color.b + (Math.random() - 0.5) * 0.1
  }

  particleSystem.value.geometry.attributes.color.needsUpdate = true
}

watch(
  () => props.color,
  newColor => {
    updateColor(newColor)
  }
)

watch(
  () => props.enabled,
  enabled => {
    if (enabled && !animationId.value) {
      animate()
    } else if (!enabled && animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
  }
)

onMounted(() => {
  if (props.enabled) {
    animate()
  }
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})

defineExpose({
  createParticleSystem,
  createExplosion,
  createTrail,
  updateColor
})
</script>
