import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useUniverseStore } from '@/stores/universe'
import { useServicesStore } from '@/stores/services'

export function useThreeUniverse(containerRef) {
  const universeStore = useUniverseStore()
  const servicesStore = useServicesStore()

  const scene = shallowRef(null)
  const camera = shallowRef(null)
  const renderer = shallowRef(null)
  const nodes = shallowRef({})
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const isReady = ref(false)

  let frameId = null
  let particles = null
  let nebula = null

  function init() {
    if (!containerRef.value) return

    // Scene
    scene.value = new THREE.Scene()
    scene.value.fog = new THREE.FogExp2(0x0a0a15, 0.015)

    // Camera
    camera.value = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.value.position.set(0, 0, 20)

    // Renderer
    renderer.value = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.value.setSize(window.innerWidth, window.innerHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.value.setClearColor(0x0a0a15, 1)

    containerRef.value.appendChild(renderer.value.domElement)

    // Create starfield
    createStarfield()

    // Create nebula background
    createNebula()

    // Create service nodes
    createServiceNodes()

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.value.add(ambientLight)

    const pointLight = new THREE.PointLight(0x7df9ff, 1, 100)
    pointLight.position.set(0, 0, 10)
    scene.value.add(pointLight)

    // Start animation
    animate()

    // Events
    window.addEventListener('resize', onResize)
    containerRef.value.addEventListener('mousemove', onMouseMove)
    containerRef.value.addEventListener('click', onClick)
    containerRef.value.addEventListener('wheel', onWheel, { passive: false })

    isReady.value = true
  }

  function createStarfield() {
    const geometry = new THREE.BufferGeometry()
    const count = 3000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 200
      positions[i3 + 1] = (Math.random() - 0.5) * 200
      positions[i3 + 2] = (Math.random() - 0.5) * 200

      // Random star colors (white, blue, yellow)
      const colorChoice = Math.random()
      if (colorChoice < 0.7) {
        colors[i3] = 1
        colors[i3 + 1] = 1
        colors[i3 + 2] = 1
      } else if (colorChoice < 0.85) {
        colors[i3] = 0.6
        colors[i3 + 1] = 0.8
        colors[i3 + 2] = 1
      } else {
        colors[i3] = 1
        colors[i3 + 1] = 0.9
        colors[i3 + 2] = 0.6
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    })

    particles = new THREE.Points(geometry, material)
    scene.value.add(particles)
  }

  function createNebula() {
    // Create multiple nebula layers
    const nebulaGeometry = new THREE.PlaneGeometry(100, 100)

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Create gradient nebula
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, 'rgba(125, 100, 255, 0.3)')
    gradient.addColorStop(0.3, 'rgba(80, 50, 180, 0.2)')
    gradient.addColorStop(0.6, 'rgba(40, 20, 100, 0.1)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    const texture = new THREE.CanvasTexture(canvas)
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial)
    nebula.position.z = -50
    scene.value.add(nebula)
  }

  function createServiceNodes() {
    const services = servicesStore.getAllServices

    services.forEach(service => {
      const node = createNode(service)
      nodes.value[service.id] = node
      scene.value.add(node)
    })
  }

  function createButtonTexture(service) {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    const color1 = service.color
    const color2 = service.accentColor
    gradient.addColorStop(0, color1)
    gradient.addColorStop(1, color2)

    // Draw rounded rectangle background
    ctx.fillStyle = 'rgba(10, 10, 21, 0.95)'
    ctx.fillRect(0, 0, 512, 512)

    // Add border with service color
    ctx.strokeStyle = color1
    ctx.lineWidth = 8
    ctx.strokeRect(10, 10, 492, 492)

    // Add inner glow
    ctx.strokeStyle = color1
    ctx.lineWidth = 4
    ctx.globalAlpha = 0.5
    ctx.strokeRect(20, 20, 472, 472)
    ctx.globalAlpha = 1

    // Draw icon
    ctx.font = 'bold 120px Arial'
    ctx.fillStyle = gradient
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(service.icon, 256, 180)

    // Draw service name
    ctx.font = 'bold 48px Arial'
    ctx.fillStyle = color1
    ctx.fillText(service.name, 256, 320)

    // Draw tagline
    ctx.font = '24px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fillText(service.tagline.toUpperCase(), 256, 370)

    // Add corner accents
    ctx.strokeStyle = color1
    ctx.lineWidth = 3

    // Top-left corner
    ctx.beginPath()
    ctx.moveTo(30, 60)
    ctx.lineTo(30, 30)
    ctx.lineTo(60, 30)
    ctx.stroke()

    // Top-right corner
    ctx.beginPath()
    ctx.moveTo(452, 30)
    ctx.lineTo(482, 30)
    ctx.lineTo(482, 60)
    ctx.stroke()

    // Bottom-left corner
    ctx.beginPath()
    ctx.moveTo(30, 452)
    ctx.lineTo(30, 482)
    ctx.lineTo(60, 482)
    ctx.stroke()

    // Bottom-right corner
    ctx.beginPath()
    ctx.moveTo(482, 452)
    ctx.lineTo(482, 482)
    ctx.lineTo(452, 482)
    ctx.stroke()

    return new THREE.CanvasTexture(canvas)
  }

  function createNode(service) {
    // Create button-like geometry (rounded rectangle)
    const geometry = new THREE.BoxGeometry(3.5, 3.5, 0.3, 1, 1, 1)

    // Create texture with service info
    const texture = createButtonTexture(service)

    const color = new THREE.Color(service.color)
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: color,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(service.position.x, service.position.y, service.position.z)
    mesh.userData = { serviceId: service.id, service }

    // Rotate to face camera initially
    mesh.rotation.y = 0

    // Add glow effect (flat for button style)
    const glowGeometry = new THREE.BoxGeometry(4.2, 4.2, 0.2)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.z = -0.1
    mesh.add(glow)

    // Add edge glow
    const edgesGeometry = new THREE.EdgesGeometry(geometry)
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6
    })
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
    mesh.add(edges)

    return mesh
  }

  function animate() {
    frameId = requestAnimationFrame(animate)

    const time = Date.now() * 0.001

    // Rotate starfield slowly
    if (particles) {
      particles.rotation.y += 0.0001
      particles.rotation.x += 0.00005
    }

    // Animate nodes (button style)
    Object.entries(nodes.value).forEach(([id, node], index) => {
      // Gentle floating animation
      const baseY = node.userData.service.position.y
      node.position.y = baseY + Math.sin(time * 0.5 + index) * 0.3

      // Subtle rotation to make it dynamic
      node.rotation.x = Math.sin(time * 0.3 + index) * 0.05
      node.rotation.z = Math.cos(time * 0.4 + index) * 0.03

      // Make buttons face camera with slight variation
      const angleToCamera = Math.atan2(
        camera.value.position.x - node.position.x,
        camera.value.position.z - node.position.z
      )
      node.rotation.y = angleToCamera + Math.sin(time * 0.2 + index) * 0.1

      const glow = node.children[0]
      const edges = node.children[1]

      if (glow && edges) {
        // Enhanced effects for hovered node
        if (universeStore.hoveredNode === id) {
          // Pulse glow and scale
          const pulse = Math.sin(time * 5) * 0.5 + 0.5
          glow.material.opacity = 0.3 + pulse * 0.3
          edges.material.opacity = 0.8 + pulse * 0.2

          // Scale up on hover
          gsap.to(node.scale, {
            x: 1.15,
            y: 1.15,
            z: 1.15,
            duration: 0.3,
            ease: 'power2.out'
          })

          // Brighten emissive
          node.material.emissiveIntensity = 0.5 + pulse * 0.3
        } else {
          // Subtle pulse for non-hovered nodes
          glow.material.opacity = 0.15 + Math.sin(time * 2 + index) * 0.05
          edges.material.opacity = 0.6

          // Reset scale
          gsap.to(node.scale, {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: 0.3,
            ease: 'power2.out'
          })

          node.material.emissiveIntensity = 0.3
        }
      }
    })

    renderer.value.render(scene.value, camera.value)
  }

  function onResize() {
    if (!camera.value || !renderer.value) return

    camera.value.aspect = window.innerWidth / window.innerHeight
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(window.innerWidth, window.innerHeight)
  }

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera.value)
    const intersects = raycaster.intersectObjects(Object.values(nodes.value))

    if (intersects.length > 0) {
      const node = intersects[0].object
      if (node.userData.serviceId) {
        universeStore.setHoveredNode(node.userData.serviceId)
        document.body.style.cursor = 'pointer'

        // Prefetch route for faster navigation
        import('@/views/ServiceDimension.vue')
      }
    } else {
      universeStore.clearHoveredNode()
      document.body.style.cursor = 'default'
    }
  }

  function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera.value)
    const intersects = raycaster.intersectObjects(Object.values(nodes.value))

    if (intersects.length > 0) {
      const node = intersects[0].object
      if (node.userData.serviceId) {
        universeStore.selectNode(node.userData.serviceId)
        flyToNode(node.userData.serviceId)
      }
    }
  }

  function onWheel(event) {
    event.preventDefault()

    // Zoom limits
    const minZoom = 5
    const maxZoom = 50
    const zoomSpeed = 0.5

    // Calculate new zoom position
    const delta = event.deltaY * 0.01
    const newZ = camera.value.position.z + delta * zoomSpeed

    // Apply zoom with limits
    camera.value.position.z = Math.max(minZoom, Math.min(maxZoom, newZ))
  }

  function flyToNode(serviceId) {
    const node = nodes.value[serviceId]
    if (!node) return

    universeStore.setTransitioning(true)

    const targetPosition = {
      x: node.position.x,
      y: node.position.y,
      z: node.position.z + 5
    }

    gsap.to(camera.value.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        universeStore.setPortalActive(true)
      }
    })
  }

  function resetCamera() {
    universeStore.setTransitioning(true)

    gsap.to(camera.value.position, {
      x: 0,
      y: 0,
      z: 20,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        universeStore.setTransitioning(false)
        universeStore.clearSelection()
      }
    })
  }

  function cleanup() {
    if (frameId) {
      cancelAnimationFrame(frameId)
    }

    window.removeEventListener('resize', onResize)

    if (containerRef.value) {
      containerRef.value.removeEventListener('mousemove', onMouseMove)
      containerRef.value.removeEventListener('click', onClick)
      containerRef.value.removeEventListener('wheel', onWheel)
    }

    if (renderer.value) {
      renderer.value.dispose()
    }

    // Dispose geometries and materials
    Object.values(nodes.value).forEach(node => {
      node.geometry.dispose()
      if (node.material.map) node.material.map.dispose()
      node.material.dispose()

      // Dispose children (glow and edges)
      node.children.forEach(child => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      })
    })
  }

  onMounted(init)
  onBeforeUnmount(cleanup)

  return {
    scene,
    camera,
    renderer,
    nodes,
    isReady,
    flyToNode,
    resetCamera
  }
}
