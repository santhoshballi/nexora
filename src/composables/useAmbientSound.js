import { onMounted } from 'vue'

export function useAmbientSound(src) {
  let audio
  onMounted(() => {
    audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.2
    audio.play()
  })
}
