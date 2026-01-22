import { ref, onMounted, onUnmounted } from 'vue'
import { useSoundSystem } from './useSoundSystem.js'

export function useGestureControls() {
  const isEnabled = ref(true)
  const gestures = ref([])
  const isRecording = ref(false)
  const currentGesture = ref([])
  const { playSound } = useSoundSystem()

  // Gesture patterns
  const gesturePatterns = {
    swipeUp: { pattern: 'up', action: 'navigateForward' },
    swipeDown: { pattern: 'down', action: 'navigateBack' },
    swipeLeft: { pattern: 'left', action: 'previousService' },
    swipeRight: { pattern: 'right', action: 'nextService' },
    circle: { pattern: 'circular', action: 'toggleView' },
    pinch: { pattern: 'pinch', action: 'zoom' },
    doubleTap: { pattern: 'double-tap', action: 'select' }
  }

  let touchStartX = 0
  let touchStartY = 0
  let touchStartTime = 0
  let lastTapTime = 0
  let touchPoints = []

  function handleTouchStart(e) {
    if (!isEnabled.value) return

    const touch = e.touches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY
    touchStartTime = Date.now()

    if (isRecording.value) {
      currentGesture.value.push({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      })
    }

    // Check for double tap
    const currentTime = Date.now()
    if (currentTime - lastTapTime < 300) {
      recognizeGesture('double-tap')
    }
    lastTapTime = currentTime

    playSound('hover')
  }

  function handleTouchMove(e) {
    if (!isEnabled.value) return

    const touch = e.touches[0]

    if (isRecording.value) {
      currentGesture.value.push({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      })
    }

    // Multi-touch for pinch
    if (e.touches.length === 2) {
      touchPoints = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }))
    }
  }

  function handleTouchEnd(e) {
    if (!isEnabled.value) return

    const touch = e.changedTouches[0]
    const touchEndX = touch.clientX
    const touchEndY = touch.clientY
    const touchEndTime = Date.now()
    const touchDuration = touchEndTime - touchStartTime

    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Recognize swipe gestures
    if (distance > 50 && touchDuration < 500) {
      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI

      if (angle > -45 && angle <= 45) {
        recognizeGesture('swipe-right')
      } else if (angle > 45 && angle <= 135) {
        recognizeGesture('swipe-down')
      } else if (angle > 135 || angle <= -135) {
        recognizeGesture('swipe-left')
      } else {
        recognizeGesture('swipe-up')
      }
    }

    // Check for pinch gesture
    if (touchPoints.length === 2) {
      recognizeGesture('pinch')
      touchPoints = []
    }

    if (isRecording.value && currentGesture.value.length > 10) {
      analyzeRecordedGesture()
    }
  }

  function recognizeGesture(gestureType) {
    const gesture = gesturePatterns[gestureType.replace('-', '')]
    if (!gesture) return

    gestures.value.push({
      type: gestureType,
      action: gesture.action,
      timestamp: Date.now()
    })

    // Emit custom event
    window.dispatchEvent(
      new CustomEvent('gesture', {
        detail: { type: gestureType, action: gesture.action }
      })
    )

    playSound('click')
  }

  function analyzeRecordedGesture() {
    if (currentGesture.value.length < 5) return

    // Simple pattern recognition for circles
    const firstPoint = currentGesture.value[0]
    const lastPoint = currentGesture.value[currentGesture.value.length - 1]
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + Math.pow(lastPoint.y - firstPoint.y, 2)
    )

    // If start and end points are close, it might be a circle
    if (distance < 50) {
      recognizeGesture('circle')
    }

    currentGesture.value = []
  }

  function startRecording() {
    isRecording.value = true
    currentGesture.value = []
    playSound('success')
  }

  function stopRecording() {
    isRecording.value = false
    currentGesture.value = []
    playSound('click')
  }

  function enableGestures() {
    isEnabled.value = true
    playSound('success')
  }

  function disableGestures() {
    isEnabled.value = false
    playSound('click')
  }

  function clearGestures() {
    gestures.value = []
    playSound('click')
  }

  // Mouse gesture support
  let isMouseDown = false
  let mouseStartX = 0
  let mouseStartY = 0
  let mousePath = []

  function handleMouseDown(e) {
    isMouseDown = true
    mouseStartX = e.clientX
    mouseStartY = e.clientY
    mousePath = [{ x: e.clientX, y: e.clientY, time: Date.now() }]
  }

  function handleMouseMove(e) {
    if (!isMouseDown) return

    mousePath.push({ x: e.clientX, y: e.clientY, time: Date.now() })
  }

  function handleMouseUp(e) {
    if (!isMouseDown) return

    isMouseDown = false
    const mouseEndX = e.clientX
    const mouseEndY = e.clientY

    const deltaX = mouseEndX - mouseStartX
    const deltaY = mouseEndY - mouseStartY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance > 100 && mousePath.length > 5) {
      // Recognize mouse gesture
      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI

      if (angle > -45 && angle <= 45) {
        recognizeGesture('swipe-right')
      } else if (angle > 45 && angle <= 135) {
        recognizeGesture('swipe-down')
      } else if (angle > 135 || angle <= -135) {
        recognizeGesture('swipe-left')
      } else {
        recognizeGesture('swipe-up')
      }
    }

    mousePath = []
  }

  onMounted(() => {
    // Touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Mouse events for desktop gestures
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  })

  onUnmounted(() => {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    isEnabled,
    gestures,
    isRecording,
    currentGesture,
    recognizeGesture,
    startRecording,
    stopRecording,
    enableGestures,
    disableGestures,
    clearGestures
  }
}
