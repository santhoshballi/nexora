<script setup>
import { ref, nextTick } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['mood-change'])

const modules = {
  creation: {
    title: 'CREATION',
    description: 'AI Cinematics · Visual Systems · Gaming Worlds',
    details:
      'Exploring the boundaries of visual storytelling through AI-powered creative tools and immersive world-building.'
  },
  intelligence: {
    title: 'INTELLIGENCE',
    description: 'AI Logic · Experiments · Generative Systems',
    details:
      'Pushing the limits of artificial intelligence through experimental approaches and generative design patterns.'
  },
  human: {
    title: 'HUMAN',
    description: 'Emotion · Play · Story',
    details:
      'Bridging technology and humanity through emotional design, playful interactions, and compelling narratives.'
  }
}

const activeNode = ref(null)
const container = ref(null)
const nodesWrap = ref(null)

async function selectNode(id) {
  activeNode.value = null
  emit('mood-change', id)

  await nextTick()

  // Camera push-in effect
  gsap.to(container.value, {
    scale: 1.04,
    duration: 1,
    ease: 'power3.out'
  })

  // Side drift for depth
  gsap.to(nodesWrap.value, {
    x: -30,
    duration: 1,
    ease: 'power3.out'
  })

  setTimeout(() => {
    activeNode.value = modules[id]
  }, 400)
}

function resetView() {
  activeNode.value = null
  emit('mood-change', 'neutral')

  gsap.to(container.value, {
    scale: 1,
    duration: 0.8,
    ease: 'power3.out'
  })

  gsap.to(nodesWrap.value, {
    x: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
}
</script>

<template>
  <div ref="container" class="knowledge">
    <div ref="nodesWrap" class="nodes">
      <div
        v-for="(module, id) in modules"
        :key="id"
        class="node"
        :class="{ active: activeNode?.title === module.title }"
        @click="selectNode(id)"
      >
        <span class="node-title">{{ module.title }}</span>
      </div>
    </div>

    <transition name="panel">
      <div v-if="activeNode" class="panel">
        <div class="panel-header">
          <h2>{{ activeNode.title }}</h2>
          <button class="close-btn" @click="resetView">×</button>
        </div>
        <p class="description">{{ activeNode.description }}</p>
        <p class="details">{{ activeNode.details }}</p>
        <div class="status">
          <span class="status-dot"></span>
          SYSTEM STATUS: ACTIVE
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.knowledge {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(ellipse at center, #0a0e20 0%, #050810 50%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  transform-origin: center;
}

.nodes {
  display: flex;
  gap: 3rem;
}

.node {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 1px solid var(--nexora-purple);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.node::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid transparent;
  transition: border-color 0.4s ease;
}

.node:hover {
  transform: scale(1.12);
  box-shadow: 0 0 30px rgba(90, 63, 255, 0.5);
}

.node:hover::before {
  border-color: rgba(90, 63, 255, 0.3);
}

.node.active {
  border-color: var(--nexora-blue);
  box-shadow: 0 0 40px rgba(125, 249, 255, 0.6);
  background: radial-gradient(circle, rgba(90, 63, 255, 0.2), transparent);
}

.node-title {
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: var(--nexora-text);
  text-align: center;
}

.panel {
  max-width: 360px;
  padding: 2rem;
  border-left: 1px solid rgba(125, 249, 255, 0.3);
  background: rgba(5, 8, 16, 0.6);
  backdrop-filter: blur(10px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-header h2 {
  font-size: 1rem;
  letter-spacing: 0.3em;
  color: var(--nexora-blue);
  font-weight: 400;
}

.close-btn {
  background: none;
  border: none;
  color: var(--nexora-text-dim);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
  line-height: 1;
}

.close-btn:hover {
  color: var(--nexora-blue);
}

.description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--nexora-text);
  margin-bottom: 1rem;
}

.details {
  font-size: 0.8rem;
  line-height: 1.7;
  color: var(--nexora-text-dim);
}

.status {
  margin-top: 2rem;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--nexora-text-dim);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--nexora-blue);
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

/* Panel transitions */
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
