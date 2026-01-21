import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useServicesStore } from '@/stores/services'

describe('Services Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have 12 services defined', () => {
    const store = useServicesStore()
    expect(store.getAllServices).toHaveLength(12)
  })

  it('should return correct service IDs', () => {
    const store = useServicesStore()
    const expectedIds = [
      'cipher',
      'aurora',
      'nexus',
      'void',
      'pulse',
      'quantum',
      'ember',
      'frost',
      'terra',
      'echo',
      'prism',
      'flux'
    ]
    expect(store.getServiceIds).toEqual(expectedIds)
  })

  it('should get service by id', () => {
    const store = useServicesStore()
    const cipher = store.getService('cipher')

    expect(cipher).toBeDefined()
    expect(cipher.name).toBe('CIPHER')
    expect(cipher.tagline).toBe('Code & Development')
    expect(cipher.color).toBe('#00ff41')
  })

  it('should return undefined for non-existent service', () => {
    const store = useServicesStore()
    expect(store.getService('nonexistent')).toBeUndefined()
  })

  it('should have required properties for each service', () => {
    const store = useServicesStore()
    const requiredProps = [
      'id',
      'name',
      'tagline',
      'description',
      'theme',
      'color',
      'accentColor',
      'nodeShape',
      'position',
      'features',
      'icon'
    ]

    store.getAllServices.forEach(service => {
      requiredProps.forEach(prop => {
        expect(service).toHaveProperty(prop)
      })
    })
  })

  it('should have valid position coordinates for each service', () => {
    const store = useServicesStore()

    store.getAllServices.forEach(service => {
      expect(service.position).toHaveProperty('x')
      expect(service.position).toHaveProperty('y')
      expect(service.position).toHaveProperty('z')
      expect(typeof service.position.x).toBe('number')
      expect(typeof service.position.y).toBe('number')
      expect(typeof service.position.z).toBe('number')
    })
  })
})
