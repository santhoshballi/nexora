import { v4 as uuidv4 } from 'uuid'

// Mock user database (in-memory, per service)
const userDB = {}

// Initialize empty user arrays for each service
const services = [
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
services.forEach(s => (userDB[s] = []))

// Simulate network delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock JWT
function generateToken(userId, serviceId) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      service: serviceId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })
  )
  const signature = btoa(`mock-signature-${uuidv4().slice(0, 8)}`)
  return `${header}.${payload}.${signature}`
}

export const authService = {
  async register(serviceId, { email, password, name }) {
    await delay(800 + Math.random() * 400) // Simulate scanning effect time

    if (!userDB[serviceId]) {
      throw new Error('Invalid service')
    }

    const existingUser = userDB[serviceId].find(u => u.email === email)
    if (existingUser) {
      throw new Error('User already exists in this dimension')
    }

    const user = {
      id: uuidv4(),
      email,
      password, // In real app, would be hashed
      name,
      createdAt: new Date().toISOString(),
      serviceId
    }

    userDB[serviceId].push(user)

    const token = generateToken(user.id, serviceId)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  },

  async login(serviceId, { email, password }) {
    await delay(600 + Math.random() * 400) // Simulate scanning effect time

    if (!userDB[serviceId]) {
      throw new Error('Invalid service')
    }

    const user = userDB[serviceId].find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid credentials for this dimension')
    }

    const token = generateToken(user.id, serviceId)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  },

  async validateToken(serviceId, token) {
    await delay(200)

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.service !== serviceId) {
        return { valid: false }
      }
      if (payload.exp < Date.now()) {
        return { valid: false, reason: 'Token expired' }
      }
      return { valid: true, userId: payload.sub }
    } catch {
      return { valid: false, reason: 'Invalid token' }
    }
  },

  async logout(_serviceId, _token) {
    await delay(200)
    // In real app, would invalidate token
    return { success: true }
  }
}
