import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    services: {
      cipher: { token: null, user: null },
      aurora: { token: null, user: null },
      nexus: { token: null, user: null },
      void: { token: null, user: null },
      pulse: { token: null, user: null },
      quantum: { token: null, user: null },
      ember: { token: null, user: null },
      frost: { token: null, user: null },
      terra: { token: null, user: null },
      echo: { token: null, user: null },
      prism: { token: null, user: null },
      flux: { token: null, user: null }
    }
  }),

  getters: {
    isAuthenticated: state => serviceId => {
      return !!state.services[serviceId]?.token
    },

    getUser: state => serviceId => {
      return state.services[serviceId]?.user
    },

    getToken: state => serviceId => {
      return state.services[serviceId]?.token
    },

    authenticatedServices: state => {
      return Object.entries(state.services)
        .filter(([_, data]) => data.token)
        .map(([id]) => id)
    }
  },

  actions: {
    setAuth(serviceId, { token, user }) {
      if (this.services[serviceId]) {
        this.services[serviceId] = { token, user }
      }
    },

    logout(serviceId) {
      if (this.services[serviceId]) {
        this.services[serviceId] = { token: null, user: null }
      }
    },

    logoutAll() {
      Object.keys(this.services).forEach(id => {
        this.services[id] = { token: null, user: null }
      })
    }
  },

  persist: {
    key: 'nexora-auth',
    storage: localStorage,
    paths: ['services']
  }
})
