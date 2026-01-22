import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useAdvancedAnimations() {
  const timeline = ref(null)
  const isAnimating = ref(false)

  // Particle trail effect for mouse movement
  function createParticleTrail() {
    const particles = []
    const maxParticles = 20

    document.addEventListener('mousemove', e => {
      if (particles.length >= maxParticles) {
        const oldParticle = particles.shift()
        oldParticle.element.remove()
      }

      const particle = document.createElement('div')
      particle.className = 'particle-trail'
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(125, 249, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
      `

      document.body.appendChild(particle)
      particles.push(particle)

      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove()
          const index = particles.indexOf(particle)
          if (index > -1) particles.splice(index, 1)
        }
      })
    })
  }

  // Magnetic button effect
  function addMagneticEffect(element) {
    const magnet = element
    const strength = 0.3

    magnet.addEventListener('mousemove', e => {
      const rect = magnet.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(magnet, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    magnet.addEventListener('mouseleave', () => {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
    })
  }

  // Staggered text reveal
  function revealText(element, delay = 0) {
    const text = element.textContent
    element.innerHTML = text
      .split('')
      .map(
        char =>
          `<span style="display: inline-block; opacity: 0; transform: translateY(50px);">${char === ' ' ? '&nbsp;' : char}</span>`
      )
      .join('')

    gsap.to(element.querySelectorAll('span'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      delay,
      ease: 'power3.out'
    })
  }

  // Parallax mouse effect
  function createParallaxEffect(elements, strength = 0.02) {
    document.addEventListener('mousemove', e => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2

      elements.forEach(element => {
        gsap.to(element, {
          x: mouseX * strength * 100,
          y: mouseY * strength * 100,
          duration: 1,
          ease: 'power2.out'
        })
      })
    })
  }

  // Glitch effect
  function triggerGlitch(element) {
    const originalFilter = element.style.filter

    gsap
      .timeline()
      .to(element, {
        x: () => gsap.utils.random(-5, 5),
        y: () => gsap.utils.random(-5, 5),
        skewX: () => gsap.utils.random(-2, 2),
        filter: 'hue-rotate(90deg) saturate(2)',
        duration: 0.05,
        repeat: 5,
        yoyo: true
      })
      .to(element, {
        x: 0,
        y: 0,
        skewX: 0,
        filter: originalFilter || 'none',
        duration: 0.2,
        ease: 'power2.out'
      })
  }

  // Floating animation
  function addFloatingAnimation(element, amplitude = 10, speed = 2) {
    gsap.to(element, {
      y: `+=${amplitude}`,
      duration: speed,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // Pulse glow effect
  function addPulseGlow(element, color = '#7df9ff') {
    const glowElement = document.createElement('div')
    glowElement.style.cssText = `
      position: absolute;
      inset: -20px;
      background: radial-gradient(circle, ${color}40 0%, transparent 70%);
      pointer-events: none;
      opacity: 0;
    `

    element.style.position = 'relative'
    element.appendChild(glowElement)

    gsap
      .timeline({ repeat: -1 })
      .to(glowElement, {
        opacity: 0.6,
        scale: 1.2,
        duration: 2,
        ease: 'power2.inOut'
      })
      .to(glowElement, {
        opacity: 0,
        scale: 0.8,
        duration: 2,
        ease: 'power2.inOut'
      })
  }

  onMounted(() => {
    createParticleTrail()
  })

  return {
    timeline,
    isAnimating,
    addMagneticEffect,
    revealText,
    createParallaxEffect,
    triggerGlitch,
    addFloatingAnimation,
    addPulseGlow
  }
}
