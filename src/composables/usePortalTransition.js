import { ref, computed } from 'vue'
import { gsap } from 'gsap'
import { useUniverseStore } from '@/stores/universe'
import { useServicesStore } from '@/stores/services'

export function usePortalTransition() {
  const universeStore = useUniverseStore()
  const servicesStore = useServicesStore()

  const isTransitioning = ref(false)
  const transitionPhase = ref('idle') // idle, opening, traveling, closing, complete
  const portalColor = ref('#7df9ff')
  const progress = ref(0)

  const currentService = computed(() => {
    if (!universeStore.selectedNode) return null
    return servicesStore.getService(universeStore.selectedNode)
  })

  function startPortalTransition(serviceId, onComplete) {
    const service = servicesStore.getService(serviceId)
    if (!service) return

    isTransitioning.value = true
    transitionPhase.value = 'opening'
    portalColor.value = service.color

    const timeline = gsap.timeline({
      onComplete: () => {
        transitionPhase.value = 'complete'
        isTransitioning.value = false
        if (onComplete) onComplete()
      }
    })

    // Phase 1: Portal opening (crack effect)
    timeline.to(progress, {
      value: 0.3,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        transitionPhase.value = 'traveling'
      }
    })

    // Phase 2: Acceleration through portal
    timeline.to(progress, {
      value: 0.8,
      duration: 0.5,
      ease: 'power4.in'
    })

    // Phase 3: Deceleration and arrival
    timeline.to(progress, {
      value: 1,
      duration: 0.3,
      ease: 'power2.out',
      onStart: () => {
        transitionPhase.value = 'closing'
      }
    })
  }

  function reversePortalTransition(onComplete) {
    isTransitioning.value = true
    transitionPhase.value = 'closing'

    gsap.to(progress, {
      value: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        transitionPhase.value = 'idle'
        isTransitioning.value = false
        universeStore.setPortalActive(false)
        if (onComplete) onComplete()
      }
    })
  }

  function getShaderUniforms() {
    return {
      uProgress: { value: progress.value },
      uPortalColor: { value: portalColor.value },
      uTime: { value: 0 }
    }
  }

  // Distortion effect values based on progress
  const distortion = computed(() => ({
    intensity: progress.value < 0.5 ? progress.value * 2 : 2 - progress.value * 2,
    radius: 0.5 + progress.value * 0.5,
    twist: progress.value * Math.PI * 2
  }))

  // Screen shake values
  const shake = computed(() => {
    if (transitionPhase.value === 'traveling') {
      return {
        x: (Math.random() - 0.5) * progress.value * 10,
        y: (Math.random() - 0.5) * progress.value * 10
      }
    }
    return { x: 0, y: 0 }
  })

  return {
    isTransitioning,
    transitionPhase,
    portalColor,
    progress,
    currentService,
    distortion,
    shake,
    startPortalTransition,
    reversePortalTransition,
    getShaderUniforms
  }
}
