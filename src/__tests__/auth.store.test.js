import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with no authenticated services', () => {
    const store = useAuthStore()
    expect(store.authenticatedServices).toHaveLength(0)
  })

  it('should check authentication status correctly', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated('cipher')).toBe(false)
  })

  it('should set auth for a service', () => {
    const store = useAuthStore()
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    const mockToken = 'mock-jwt-token'

    store.setAuth('cipher', { token: mockToken, user: mockUser })

    expect(store.isAuthenticated('cipher')).toBe(true)
    expect(store.getUser('cipher')).toEqual(mockUser)
    expect(store.getToken('cipher')).toBe(mockToken)
  })

  it('should logout from a specific service', () => {
    const store = useAuthStore()
    store.setAuth('cipher', { token: 'token', user: { name: 'Test' } })
    store.setAuth('aurora', { token: 'token2', user: { name: 'Test2' } })

    store.logout('cipher')

    expect(store.isAuthenticated('cipher')).toBe(false)
    expect(store.isAuthenticated('aurora')).toBe(true)
  })

  it('should logout from all services', () => {
    const store = useAuthStore()
    store.setAuth('cipher', { token: 'token', user: { name: 'Test' } })
    store.setAuth('aurora', { token: 'token2', user: { name: 'Test2' } })

    store.logoutAll()

    expect(store.authenticatedServices).toHaveLength(0)
  })

  it('should return list of authenticated services', () => {
    const store = useAuthStore()
    store.setAuth('cipher', { token: 'token', user: { name: 'Test' } })
    store.setAuth('nexus', { token: 'token2', user: { name: 'Test2' } })

    expect(store.authenticatedServices).toContain('cipher')
    expect(store.authenticatedServices).toContain('nexus')
    expect(store.authenticatedServices).toHaveLength(2)
  })
})
