import { ref } from 'vue'

export function useSoundSystem() {
  const audioContext = ref(null)
  const masterVolume = ref(0.5)
  const isInitialized = ref(false)

  // Sound definitions
  const sounds = {
    hover: { frequency: 800, duration: 0.1, type: 'sine' },
    click: { frequency: 600, duration: 0.15, type: 'square' },
    portal: { frequency: 200, duration: 2, type: 'sawtooth' },
    success: { frequency: 1200, duration: 0.3, type: 'sine' },
    error: { frequency: 300, duration: 0.5, type: 'sawtooth' },
    ambient: { frequency: 100, duration: 10, type: 'sine' }
  }

  async function initAudio() {
    if (isInitialized.value) return

    try {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()

      // Resume audio context if suspended (due to browser autoplay policy)
      if (audioContext.value.state === 'suspended') {
        await audioContext.value.resume()
      }

      isInitialized.value = true
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  function createOscillator(frequency, duration, type = 'sine') {
    if (!audioContext.value) return null

    const oscillator = audioContext.value.createOscillator()
    const gainNode = audioContext.value.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime)

    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.value.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      0.3 * masterVolume.value,
      audioContext.value.currentTime + 0.01
    )
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.value.destination)

    return { oscillator, gainNode, duration }
  }

  async function playSound(soundName, options = {}) {
    if (!isInitialized.value) {
      await initAudio()
    }

    // Ensure audio context is running
    if (audioContext.value && audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }

    const sound = { ...sounds[soundName], ...options }
    if (!sound) return

    const audio = createOscillator(sound.frequency, sound.duration, sound.type)
    if (!audio) return

    audio.oscillator.start(audioContext.value.currentTime)
    audio.oscillator.stop(audioContext.value.currentTime + sound.duration)
  }

  async function playPortalSound() {
    if (!isInitialized.value) {
      await initAudio()
    }

    if (!audioContext.value) return

    // Complex portal sound with multiple oscillators
    const oscillators = [
      { freq: 150, duration: 0.5, type: 'sawtooth' },
      { freq: 200, duration: 1, type: 'sine' },
      { freq: 400, duration: 1.5, type: 'square' }
    ]

    oscillators.forEach((config, index) => {
      setTimeout(() => {
        playSound('portal', config)
      }, index * 100)
    })
  }

  async function createAmbientSoundscape() {
    if (!isInitialized.value) {
      await initAudio()
    }

    if (!audioContext.value) return

    // Ensure audio context is running
    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }

    const oscillator = audioContext.value.createOscillator()
    const gainNode = audioContext.value.createGain()
    const lfo = audioContext.value.createOscillator()
    const lfoGain = audioContext.value.createGain()

    // Main ambient tone
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(100, audioContext.value.currentTime)

    // LFO for modulation
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.2, audioContext.value.currentTime)
    lfoGain.gain.setValueAtTime(20, audioContext.value.currentTime)

    // Connect LFO to oscillator frequency
    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)

    // Set up gain
    gainNode.gain.setValueAtTime(0.05 * masterVolume.value, audioContext.value.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.value.destination)

    oscillator.start()
    lfo.start()

    return () => {
      oscillator.stop()
      lfo.stop()
    }
  }

  function setVolume(volume) {
    masterVolume.value = Math.max(0, Math.min(1, volume))
  }

  async function playRandomChord() {
    if (!isInitialized.value) {
      await initAudio()
    }

    if (!audioContext.value) return

    const chords = [
      [261.63, 329.63, 392.0], // C major
      [293.66, 369.99, 440.0], // D minor
      [329.63, 415.3, 493.88], // E minor
      [349.23, 440.0, 523.25] // F major
    ]

    const chord = chords[Math.floor(Math.random() * chords.length)]

    chord.forEach((frequency, index) => {
      setTimeout(() => {
        playSound('success', { frequency, duration: 1, type: 'sine' })
      }, index * 100)
    })
  }

  return {
    isInitialized,
    masterVolume,
    initAudio,
    playSound,
    playPortalSound,
    createAmbientSoundscape,
    setVolume,
    playRandomChord
  }
}
