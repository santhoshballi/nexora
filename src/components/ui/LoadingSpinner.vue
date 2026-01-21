<script setup>
defineProps({
  size: {
    type: String,
    default: '40px'
  },
  color: {
    type: String,
    default: 'var(--service-color, #00ff41)'
  },
  thickness: {
    type: String,
    default: '3px'
  }
})
</script>

<template>
  <div
    class="spinner"
    :style="{
      width: size,
      height: size,
      borderWidth: thickness,
      borderTopColor: color
    }"
  />
</template>

<style scoped>
.spinner {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
