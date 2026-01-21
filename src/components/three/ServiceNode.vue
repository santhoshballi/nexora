<script setup>
import { ref, computed, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  isHovered: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'hover', 'leave'])

const nodeRef = ref(null)
const glowIntensity = ref(0.3)

const nodeStyle = computed(() => ({
  '--service-color': props.service.color,
  '--accent-color': props.service.accentColor,
  '--glow-intensity': glowIntensity.value
}))

watch(
  () => props.isHovered,
  hovered => {
    gsap.to(glowIntensity, {
      value: hovered ? 0.8 : 0.3,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
)

watch(
  () => props.isSelected,
  selected => {
    if (selected && nodeRef.value) {
      gsap.to(nodeRef.value, {
        scale: 1.2,
        duration: 0.3,
        ease: 'back.out'
      })
    } else if (nodeRef.value) {
      gsap.to(nodeRef.value, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      })
    }
  }
)

function handleClick() {
  emit('click', props.service.id)
}

function handleMouseEnter() {
  emit('hover', props.service.id)
}

function handleMouseLeave() {
  emit('leave')
}
</script>

<template>
  <div
    ref="nodeRef"
    class="service-node"
    :class="{ hovered: isHovered, selected: isSelected }"
    :style="nodeStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="node-core">
      <span class="node-icon">{{ service.icon }}</span>
    </div>
    <div class="node-glow"></div>
    <div class="node-ring"></div>
    <div class="node-label">{{ service.name }}</div>
  </div>
</template>

<style scoped>
.service-node {
  position: relative;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.node-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--service-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px var(--service-color);
  z-index: 2;
}

.node-icon {
  font-size: 1.5rem;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.node-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--service-color) 0%, transparent 70%);
  opacity: var(--glow-intensity);
  border-radius: 50%;
  z-index: 1;
  filter: blur(10px);
}

.node-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  border: 2px solid var(--service-color);
  border-radius: 50%;
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

.node-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--service-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-node.hovered .node-label,
.service-node.selected .node-label {
  opacity: 1;
}

.service-node.hovered .node-ring {
  animation: pulse-fast 0.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.2;
  }
}

@keyframes pulse-fast {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.4;
  }
}
</style>
