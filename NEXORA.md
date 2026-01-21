# NEXORA

## A Revolutionary 3D Services Marketplace

---

## Table of Contents

1. [Concept Overview](#concept-overview)
2. [Creative Vision](#creative-vision)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [The 12 Dimensions](#the-12-dimensions)
6. [Core Features](#core-features)
7. [File Structure](#file-structure)
8. [Implementation Details](#implementation-details)
9. [User Flow](#user-flow)
10. [Theming System](#theming-system)
11. [Authentication Model](#authentication-model)
12. [Mobile Experience](#mobile-experience)
13. [Future Enhancements](#future-enhancements)

---

## Concept Overview

**NEXORA** transforms a traditional services marketplace into an immersive 3D cosmic experience. Instead of browsing a flat list of services, users navigate through a virtual universe where each service exists as a unique "dimension" - a floating node in space with its own visual identity, theme, and isolated ecosystem.

The core metaphor is **dimensional travel**: users don't just click links, they traverse through portals into entirely different realities, each representing a specialized service offering.

### Why "NEXORA"?

The name combines:
- **NEX** - From "nexus" (connection point, hub)
- **ORA** - From "aurora" (light, dawn) and "ora" (edge, frontier)

Together, **NEXORA** represents "the luminous hub" or "the frontier of connections" - a cosmic marketplace where services connect through light and dimension.

---

## Creative Vision

### The Universe Metaphor

The marketplace is visualized as a cosmic void populated by glowing service nodes. Each node:
- Has a unique 3D geometry representing its domain
- Emits light in its signature color
- Floats gently in an orbital arrangement
- Responds to user interaction with visual feedback

### Portal Transitions

When entering a service, users experience:
1. **Portal Opening** - The node cracks open, revealing a dimensional rift
2. **Acceleration** - Camera accelerates into the portal with motion blur
3. **Distortion** - Screen warps with chromatic aberration effects
4. **Arrival** - Flash of light as user arrives in the new dimension

### Dimension Theming

Each service dimension has:
- Unique color palette (primary + accent)
- Custom background patterns
- Themed UI elements
- Matching authentication screens

---

## Technology Stack

### Core Framework
```
Vue 3          - Composition API with <script setup>
Vite 7         - Build tool and dev server
```

### State Management
```
Pinia          - Store management
pinia-plugin-persistedstate - Auth token persistence
```

### Routing
```
Vue Router 4   - SPA navigation with route guards
```

### 3D Graphics
```
Three.js       - WebGL 3D rendering
```

### Animation
```
GSAP           - High-performance animations
```

### Utilities
```
@vueuse/core   - Vue composition utilities
uuid           - Unique ID generation
postprocessing - Post-processing effects (planned)
vite-plugin-glsl - GLSL shader support
```

---

## Architecture

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         App.vue                              │
│                    (Router View Container)                   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌──────────┐      ┌─────────────┐     ┌─────────────┐
    │ Universe │      │ServicePortal│     │  Dashboard  │
    │  (Home)  │      │(Transition) │     │ (Protected) │
    └──────────┘      └─────────────┘     └─────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────┐      ┌─────────────┐     ┌─────────────┐
    │ 3D Scene │      │   Portal    │     │  Auth Gate  │
    │  + HUD   │      │   Effect    │     │  + Content  │
    └──────────┘      └─────────────┘     └─────────────┘
```

### Store Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Pinia Stores                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│   services.js   │    auth.js      │      universe.js        │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • 12 service    │ • Per-service   │ • Camera position       │
│   definitions   │   tokens        │ • Selected node         │
│ • Themes        │ • User data     │ • Hover state           │
│ • Positions     │ • Persistence   │ • Transition flags      │
│ • Features      │                 │ • View mode             │
└─────────────────┴─────────────────┴─────────────────────────┘
```

---

## The 12 Dimensions

| ID | Name | Domain | Color | Geometry |
|:---|:-----|:-------|:------|:---------|
| `cipher` | CIPHER | Code & Development | `#00ff41` (Matrix Green) | Icosahedron |
| `aurora` | AURORA | Creative Design | `#bf40bf` (Purple/Cyan) | Torus Knot |
| `nexus` | NEXUS | AI Consulting | `#4169e1` (Royal Blue) | Brain Mesh |
| `void` | VOID | Cloud Services | `#4b0082` (Indigo) | Black Hole |
| `pulse` | PULSE | Marketing | `#ff4500` (Red/Gold) | Pulsing Sphere |
| `quantum` | QUANTUM | Data Analytics | `#00bfff` (Blue/Pink) | Atom Model |
| `ember` | EMBER | Video Production | `#ff6600` (Orange) | Flame Shape |
| `frost` | FROST | Security | `#e0ffff` (Ice White) | Crystal |
| `terra` | TERRA | E-Commerce | `#228b22` (Forest Green) | Tree |
| `echo` | ECHO | Audio Engineering | `#9400d3` (Violet) | Wave Ring |
| `prism` | PRISM | Photography | `#ff1493` (Rainbow) | Prism |
| `flux` | FLUX | Animation | `#ff00ff` (Magenta) | Morphing Blob |

### Service Data Structure

```javascript
{
  id: 'cipher',
  name: 'CIPHER',
  tagline: 'Code & Development',
  description: 'Full-stack development, custom software solutions...',
  theme: 'matrix',
  color: '#00ff41',
  accentColor: '#003b00',
  nodeShape: 'icosahedron',
  position: { x: 0, y: 2, z: 8 },
  features: ['Custom Software', 'Web Applications', 'Mobile Development', 'API Integration'],
  icon: '{ }'
}
```

---

## Core Features

### 1. 3D Universe Navigation

**File:** `src/components/three/UniverseScene.vue`

- WebGL-rendered cosmic environment
- 12 interactive service nodes in orbital arrangement
- Starfield with 3000 particles
- Nebula fog effects
- Raycasting for mouse interaction
- Camera fly-to animation on node selection

### 2. Portal Transitions

**File:** `src/composables/usePortalTransition.js`

- Multi-phase transition system:
  - `opening` → Portal initializes
  - `traveling` → User accelerates through
  - `arriving` → Destination reached
- GSAP-powered animations
- Chromatic aberration effects
- Screen shake during travel

### 3. Per-Service Authentication

**File:** `src/stores/auth.js`

```javascript
state: {
  services: {
    cipher: { token: null, user: null },
    aurora: { token: null, user: null },
    // ... 12 isolated auth states
  }
}
```

- Each service maintains independent authentication
- Logging into CIPHER does NOT grant access to AURORA
- JWT-style tokens with service-scoped validation
- Persistent storage via localStorage

### 4. Scanning Authentication UI

**File:** `src/components/auth/AuthForm.vue`

- Cyberpunk-themed auth forms
- Animated "scanning" effect during authentication
- Progress visualization
- Service-colored theming

### 5. Service Dashboards

**File:** `src/views/ServiceDashboard.vue`

- Protected routes requiring authentication
- Service-specific metrics and stats
- Recent activity feeds
- Quick action panels
- Real-time connection status

### 6. Mobile Fallback

**File:** `src/components/hud/MobileGrid.vue`

- Automatic detection of screens < 768px
- 2D grid layout replacing 3D universe
- Touch-optimized service cards
- Simplified transitions

---

## File Structure

```
src/
├── router/
│   └── index.js              # Routes + auth guards
│
├── stores/
│   ├── services.js           # 12 service definitions
│   ├── auth.js               # Per-service auth tokens
│   └── universe.js           # Camera + selection state
│
├── views/
│   ├── Universe.vue          # Main 3D navigation home
│   ├── ServicePortal.vue     # Portal transition view
│   ├── ServiceDimension.vue  # Service detail page
│   └── ServiceDashboard.vue  # Authenticated dashboard
│
├── components/
│   ├── three/
│   │   ├── UniverseScene.vue    # Main Three.js canvas
│   │   ├── ServiceNode.vue      # 3D node component
│   │   ├── PortalEffect.vue     # Portal visual effect
│   │   └── CosmicBackground.vue # Canvas starfield
│   │
│   ├── auth/
│   │   ├── AuthForm.vue         # Login/Register modal
│   │   └── AuthGate.vue         # Access control overlay
│   │
│   └── hud/
│       ├── NavigationHUD.vue    # Universe UI overlay
│       ├── ServicePreview.vue   # Hover preview panel
│       └── MobileGrid.vue       # Mobile fallback grid
│
├── composables/
│   ├── useThreeUniverse.js      # Three.js scene logic
│   ├── usePortalTransition.js   # Transition animations
│   └── useServiceAuth.js        # Auth with scanning
│
├── services/
│   ├── api.js                   # Mock dashboard API
│   └── auth.js                  # Mock JWT auth service
│
├── styles/
│   └── dimensions/
│       └── index.css            # Per-service themes
│
├── App.vue                      # Root component
└── main.js                      # App initialization
```

---

## Implementation Details

### Three.js Scene Setup

```javascript
// useThreeUniverse.js
function init() {
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a0a15, 0.015)

  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000)
  camera.position.set(0, 0, 20)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setClearColor(0x0a0a15, 1)

  createStarfield()   // 3000 particles
  createNebula()      // Gradient fog layers
  createServiceNodes() // 12 interactive nodes
}
```

### Node Geometry Mapping

```javascript
switch (service.nodeShape) {
  case 'icosahedron': return new THREE.IcosahedronGeometry(0.8, 0)
  case 'torusKnot':   return new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8)
  case 'brain':       return new THREE.IcosahedronGeometry(0.7, 2)
  case 'blackHole':   return new THREE.TorusGeometry(0.6, 0.15, 16, 50)
  case 'atom':        return new THREE.OctahedronGeometry(0.7, 0)
  case 'crystal':     return new THREE.OctahedronGeometry(0.7, 0)
  case 'prism':       return new THREE.TetrahedronGeometry(0.8, 0)
  // ...
}
```

### Route Configuration

```javascript
const routes = [
  {
    path: '/',
    component: Universe
  },
  {
    path: '/service/:id',
    component: ServicePortal
  },
  {
    path: '/service/:id/dimension',
    component: ServiceDimension
  },
  {
    path: '/service/:id/dashboard',
    component: ServiceDashboard,
    meta: { requiresAuth: true }
  }
]
```

### Auth Guard

```javascript
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
```

---

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                              │
└─────────────────────────────────────────────────────────────┘

1. LANDING (Universe View)
   │
   │  User sees 3D universe with 12 floating service nodes
   │  HUD displays status, coordinates, view controls
   │
   ▼
2. EXPLORATION
   │
   │  Hover over nodes → Preview panel appears
   │  Shows service name, tagline, features
   │
   ▼
3. SELECTION
   │
   │  Click on node → Camera flies toward it
   │  Portal begins opening animation
   │
   ▼
4. TRANSITION (Portal View)
   │
   │  Warp tunnel effect activates
   │  Chromatic aberration + screen shake
   │  Progress bar shows "TRAVERSING DIMENSIONS"
   │
   ▼
5. ARRIVAL (Dimension View)
   │
   │  Flash of service color
   │  Service detail page loads
   │  Hero section with icon, name, description
   │  Features grid displayed
   │
   ▼
6. AUTHENTICATION (If accessing dashboard)
   │
   │  Auth Gate blocks access
   │  Click "AUTHENTICATE" → Modal appears
   │  Scanning animation during login/register
   │  Success → Access granted
   │
   ▼
7. DASHBOARD
   │
   │  Service-specific metrics
   │  Recent activity feed
   │  Quick actions panel
   │  Logout returns to dimension view
   │
   ▼
8. RETURN
   │
   │  Click "UNIVERSE" → Return to home
   │  Repeat with different service
   │  Previous authentications persist
```

---

## Theming System

### CSS Variables Per Service

```css
.service-dimension.cipher {
  --service-color: #00ff41;
  --accent-color: #003b00;
}

.service-dimension.aurora {
  --service-color: #bf40bf;
  --accent-color: #00ffff;
}
```

### Dynamic Theme Application

Components receive service data and apply inline styles:

```javascript
const dimensionStyle = computed(() => ({
  '--service-color': service.value?.color,
  '--accent-color': service.value?.accentColor
}))
```

```html
<div class="service-dimension" :style="dimensionStyle">
```

### Theme-Aware Components

All UI elements reference CSS variables:

```css
.hero-title {
  color: var(--service-color);
  text-shadow: 0 0 30px var(--service-color);
}

.feature-card:hover {
  border-color: var(--service-color);
}

.submit-button {
  background: var(--service-color);
}
```

---

## Authentication Model

### Isolated Service Auth

Each of the 12 services maintains completely independent authentication:

```javascript
// Store structure
services: {
  cipher:  { token: 'jwt...', user: { id, name, email } },
  aurora:  { token: null, user: null },  // Not logged in
  nexus:   { token: 'jwt...', user: { id, name, email } },
  // ...
}

// Check auth for specific service
isAuthenticated(serviceId) {
  return !!this.services[serviceId]?.token
}
```

### Why Isolated Auth?

This model simulates a real-world scenario where:
- Each service could be a separate microservice/company
- Users may have different accounts per service
- Privacy: service A shouldn't know about service B activity
- Billing: each service could have separate subscriptions

### Mock JWT Implementation

```javascript
function generateToken(userId, serviceId) {
  const payload = {
    sub: userId,
    service: serviceId,  // Service-scoped
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000
  }
  return `${header}.${btoa(JSON.stringify(payload))}.${signature}`
}
```

---

## Mobile Experience

### Detection

```javascript
function checkMobile() {
  isMobile.value = window.innerWidth < 768
  universeStore.setMobile(isMobile.value)
}
```

### Mobile Grid Layout

When on mobile, the 3D universe is replaced with a 2D card grid:

```html
<template v-if="!isMobile">
  <CosmicBackground />
  <UniverseScene />
</template>

<MobileGrid v-else @select="handleServiceSelect" />
```

### Touch Optimizations

- Larger tap targets (minimum 44x44px)
- Simplified transitions (fade instead of 3D portal)
- Removed hover-dependent interactions
- Bottom navigation friendly

---

## Future Enhancements

### Phase 2 Possibilities

1. **Post-Processing Effects**
   - Bloom on node glows
   - Depth of field
   - Film grain overlay

2. **Sound Design**
   - Ambient space sounds
   - Portal whoosh effects
   - UI interaction sounds

3. **Real Backend Integration**
   - Replace mock API with actual services
   - OAuth integration (Google, GitHub)
   - Real-time data with WebSockets

4. **Enhanced 3D**
   - Particle connections between related services
   - Node orbiting animations
   - Interactive camera controls (OrbitControls)

5. **Accessibility**
   - Reduced motion mode
   - Screen reader support
   - Keyboard navigation

6. **Performance**
   - Level of Detail (LOD) for distant nodes
   - Lazy loading of dimension assets
   - Service worker caching

---

## Running the Project

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Project Dependencies

```json
{
  "dependencies": {
    "@vueuse/core": "^14.1.0",
    "gsap": "^3.14.2",
    "pinia": "^2.x",
    "pinia-plugin-persistedstate": "^4.x",
    "postprocessing": "^6.x",
    "three": "^0.182.0",
    "uuid": "^9.x",
    "vue": "^3.5.26",
    "vue-router": "^4.x"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.3",
    "vite": "^7.3.0",
    "vite-plugin-glsl": "^1.x",
    "vite-plugin-vue-devtools": "^8.0.5"
  }
}
```

---

## Brand Guidelines

### Logo Treatment
- Primary: **NEXORA** in uppercase
- Font: Light weight (100-200), wide letter-spacing (0.5em)
- Color: Cyan glow (`#7df9ff`) with multi-layer text shadow

### Color Palette
| Usage | Color | Hex |
|:------|:------|:----|
| Primary | Cyan | `#7df9ff` |
| Background | Deep Space | `#0a0a15` |
| Success | Matrix Green | `#00ff41` |
| Error | Red | `#ff6b6b` |
| Text Primary | White 80% | `rgba(255,255,255,0.8)` |
| Text Muted | White 40% | `rgba(255,255,255,0.4)` |

### Visual Language
- Dark theme exclusively
- Neon accents and glows
- Geometric shapes
- Scan line overlays
- Corner bracket decorations
- Monospace fonts for technical elements

---

## Credits

**Project:** NEXORA - The Luminous Hub

**Technologies:**
- Vue.js Team - Vue 3 Framework
- Evan You - Vite Build Tool
- Three.js Contributors - 3D Graphics
- GreenSock - GSAP Animation

---

*NEXORA - Navigate the Multiverse of Services*
