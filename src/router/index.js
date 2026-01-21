import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Universe',
    component: () => import('@/views/Universe.vue')
  },
  {
    path: '/service/:id',
    name: 'ServicePortal',
    component: () => import('@/views/ServicePortal.vue'),
    props: true
  },
  {
    path: '/service/:id/dimension',
    name: 'ServiceDimension',
    component: () => import('@/views/ServiceDimension.vue'),
    props: true
  },
  {
    path: '/service/:id/dashboard',
    name: 'ServiceDashboard',
    component: () => import('@/views/ServiceDashboard.vue'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    const serviceId = to.params.id

    if (!authStore.isAuthenticated(serviceId)) {
      next({ name: 'ServiceDimension', params: { id: serviceId } })
      return
    }
  }
  next()
})

export default router
