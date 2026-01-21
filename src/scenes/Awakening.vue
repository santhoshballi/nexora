<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['enter'])

const lines = ['NEXORA SYSTEM ONLINE', 'INITIALIZING CREATIVE CORE…', 'READY']

const text = ref('')
const ready = ref(false)
let lineIndex = 0
let charIndex = 0

function type() {
  if (lineIndex >= lines.length) {
    ready.value = true
    return
  }

  if (charIndex < lines[lineIndex].length) {
    text.value += lines[lineIndex][charIndex]
    charIndex++
    setTimeout(type, 45)
  } else {
    text.value += '\n'
    charIndex = 0
    lineIndex++
    setTimeout(type, 600)
  }
}

onMounted(() => {
  gsap.from('.awakening', {
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out'
  })
  setTimeout(type, 800)
})
</script>

<template>
  <div class="awakening">
    <div class="noise"></div>
    <div class="content">
      <pre class="boot-text">{{ text }}<span class="cursor">_</span></pre>
      <div v-if="ready" class="enter" @click="emit('enter')">CLICK TO ENTER</div>
    </div>
  </div>
</template>

<style scoped>
.awakening {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(ellipse at center, #0b102a 0%, #050810 50%, #000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.boot-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 1.1rem;
  line-height: 1.8;
  letter-spacing: 0.15em;
  color: var(--nexora-text);
  white-space: pre-wrap;
}

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.enter {
  margin-top: 3rem;
  font-size: 0.85rem;
  letter-spacing: 0.35em;
  color: var(--nexora-blue);
  cursor: pointer;
  animation: pulse 2s ease-in-out infinite;
  transition: text-shadow 0.3s ease;
}

.enter:hover {
  text-shadow: 0 0 20px var(--nexora-blue);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
</style>
