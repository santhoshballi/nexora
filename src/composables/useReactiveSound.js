import { watch, onMounted, ref } from 'vue'

export function useReactiveSound(mood) {
  const audio = ref(null)
  const isPlaying = ref(false)

  onMounted(() => {
    try {
      audio.value = new Audio('/ambient.mp3')
      audio.value.loop = true
      audio.value.volume = 0.2

      // Try to play (may be blocked by browser autoplay policy)
      audio.value
        .play()
        .then(() => {
          isPlaying.value = true
        })
        .catch(_err => {
          console.warn('Audio autoplay blocked. Click to enable sound.')
          // Add click listener to enable audio on user interaction
          const enableAudio = () => {
            if (audio.value && !isPlaying.value) {
              audio.value
                .play()
                .then(() => {
                  isPlaying.value = true
                })
                .catch(() => {})
            }
            document.removeEventListener('click', enableAudio)
          }
          document.addEventListener('click', enableAudio)
        })
    } catch {
      // Audio not available
    }
  })

  watch(mood, m => {
    if (!audio.value) return

    const rates = {
      creation: 1.0,
      intelligence: 1.15,
      human: 0.9,
      neutral: 1.0
    }

    audio.value.playbackRate = rates[m] || 1.0
  })

  return { isPlaying }
}
