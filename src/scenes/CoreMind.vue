<script setup>
import { ref } from 'vue'
import gsap from 'gsap'
import Avatar from '../components/avatar/Avatar.vue'

const emit = defineEmits(['next'])
const mood = ref('neutral')
const button = ref(null)

function handleClick() {
  if (button.value) {
    gsap.to(button.value, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })
  }
  setTimeout(() => emit('next'), 200)
}
</script>

<template>
  <div class="coremind">
    <div class="avatar-container">
      <Avatar :mood="mood" />
    </div>
    <div class="text">
      <h2>NEXORA CORE</h2>
      <p>AI Creative Intelligence System</p>
    </div>
    <button ref="button" class="access-btn" @click="handleClick">ACCESS KNOWLEDGE</button>
  </div>
</template>

<style scoped>
.coremind {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(ellipse at center, #0a0e20 0%, #050810 50%, #000 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.avatar-container {
  position: relative;
}

.text {
  text-align: center;
  margin-top: 1rem;
}

.text h2 {
  font-size: 1.2rem;
  letter-spacing: 0.4em;
  color: var(--nexora-text);
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.text p {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--nexora-text-dim);
}

.access-btn {
  margin-top: 1rem;
  background: transparent;
  border: 1px solid var(--nexora-blue);
  color: var(--nexora-blue);
  padding: 0.8rem 2rem;
  font-size: 0.85rem;
  letter-spacing: 0.25em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.access-btn:hover {
  background: rgba(125, 249, 255, 0.1);
  box-shadow: 0 0 25px rgba(125, 249, 255, 0.3);
}
</style>
