import { onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

export function useParallax(target) {
  function move(e) {
    gsap.to(target.value, {
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
      duration: 0.6,
      ease: 'power2.out'
    })
  }

  onMounted(() => window.addEventListener('mousemove', move))
  onBeforeUnmount(() => window.removeEventListener('mousemove', move))
}
