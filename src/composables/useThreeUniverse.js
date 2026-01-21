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

  function createNode(service) {
    let geometry

    switch (service.nodeShape) {
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(0.8, 0)
        break
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8)
        break
      case 'brain':
        geometry = new THREE.IcosahedronGeometry(0.7, 2)
        break
      case 'blackHole':
        geometry = new THREE.TorusGeometry(0.6, 0.15, 16, 50)
        break
      case 'pulsingSphere':
        geometry = new THREE.SphereGeometry(0.7, 32, 32)
        break
      case 'atom':
        geometry = new THREE.OctahedronGeometry(0.7, 0)
        break
      case 'flame':
        geometry = new THREE.ConeGeometry(0.5, 1.2, 8)
        break
      case 'crystal':
        geometry = new THREE.OctahedronGeometry(0.7, 0)
        break
      case 'tree':
        geometry = new THREE.DodecahedronGeometry(0.7, 0)
        break
      case 'waveRing':
        geometry = new THREE.TorusGeometry(0.6, 0.1, 16, 50)
        break
      case 'prism':
        geometry = new THREE.TetrahedronGeometry(0.8, 0)
        break
      case 'morphingBlob':
        geometry = new THREE.IcosahedronGeometry(0.7, 3)
        break
      default:
        geometry = new THREE.SphereGeometry(0.7, 32, 32)
    }

    const color = new THREE.Color(service.color)
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
      wireframe: service.nodeShape === 'brain'
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(service.position.x, service.position.y, service.position.z)
    mesh.userData = { serviceId: service.id, service }

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(1.2, 16, 16)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    mesh.add(glow)

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

    // Animate nodes
    Object.entries(nodes.value).forEach(([id, node], index) => {
      // Gentle floating animation
      node.position.y += Math.sin(time + index) * 0.001

      // Rotation
      node.rotation.x += 0.002
      node.rotation.y += 0.003

      // Pulse glow for hovered node
      if (universeStore.hoveredNode === id) {
        const glow = node.children[0]
        if (glow) {
          glow.material.opacity = 0.2 + Math.sin(time * 3) * 0.1
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
      duration: 1.5,
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
      duration: 1.2,
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
    }

    if (renderer.value) {
      renderer.value.dispose()
    }

    // Dispose geometries and materials
    Object.values(nodes.value).forEach(node => {
      node.geometry.dispose()
      node.material.dispose()
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
