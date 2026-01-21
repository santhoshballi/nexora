<script setup>
import SkeletonLoader from './SkeletonLoader.vue'
</script>

<template>
  <div class="dashboard-skeleton">
    <!-- Header skeleton -->
    <div class="header-skeleton">
      <SkeletonLoader width="200px" height="2rem" border-radius="8px" />
      <SkeletonLoader width="120px" height="1rem" border-radius="4px" />
    </div>

    <!-- Stats grid skeleton -->
    <div class="stats-skeleton">
      <div v-for="i in 4" :key="i" class="stat-card-skeleton">
        <SkeletonLoader width="40px" height="40px" border-radius="50%" />
        <div class="stat-content">
          <SkeletonLoader width="80px" height="0.875rem" />
          <SkeletonLoader width="60px" height="1.5rem" />
        </div>
      </div>
    </div>

    <!-- Chart skeleton -->
    <div class="chart-skeleton">
      <SkeletonLoader width="150px" height="1.25rem" border-radius="4px" />
      <SkeletonLoader width="100%" height="200px" border-radius="8px" />
    </div>

    <!-- Activity skeleton -->
    <div class="activity-skeleton">
      <SkeletonLoader width="120px" height="1.25rem" border-radius="4px" />
      <div v-for="i in 5" :key="i" class="activity-item-skeleton">
        <SkeletonLoader width="32px" height="32px" border-radius="50%" />
        <div class="activity-content">
          <SkeletonLoader width="70%" height="0.875rem" />
          <SkeletonLoader width="40%" height="0.75rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-skeleton {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stats-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chart-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.activity-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.activity-item-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.activity-item-skeleton:last-child {
  border-bottom: none;
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
