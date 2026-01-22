import { defineStore } from 'pinia'

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: {
      cipher: {
        id: 'cipher',
        name: 'TYPING PRACTICE',
        tagline: 'Space Word Defense',
        description:
          'A typing game where you type words to shoot them down. Defend your spaceship by typing attacking words before they reach you. Fast-paced typing action with visual word destruction.',
        theme: 'matrix',
        color: '#00ff41',
        accentColor: '#003b00',
        nodeShape: 'icosahedron',
        position: { x: 0, y: -2, z: 15 },
        features: ['Word Shooting', 'Typing Speed', 'Space Defense', 'Visual Word Effects'],
        icon: '\u2694'
      },
      aurora: {
        id: 'aurora',
        name: 'AURORA',
        tagline: 'Creative Design',
        description: 'UI/UX design, branding, and visual identity that captivates',
        theme: 'ethereal',
        color: '#bf40bf',
        accentColor: '#00ffff',
        nodeShape: 'torusKnot',
        position: { x: 11, y: -3, z: 10 },
        features: ['UI/UX Design', 'Brand Identity', 'Motion Graphics', 'Design Systems'],
        icon: '~'
      },
      nexus: {
        id: 'nexus',
        name: 'NEXUS',
        tagline: 'AI Consulting',
        description: 'Artificial intelligence integration and machine learning solutions',
        theme: 'neural',
        color: '#4169e1',
        accentColor: '#ffffff',
        nodeShape: 'brain',
        position: { x: 16, y: -5, z: 2 },
        features: ['AI Strategy', 'ML Models', 'Chatbots', 'Automation'],
        icon: '\u03A8'
      },
      void: {
        id: 'void',
        name: 'VOID',
        tagline: 'Cloud Services',
        description: 'Cloud infrastructure, DevOps, and scalable architecture',
        theme: 'cosmic',
        color: '#4b0082',
        accentColor: '#9932cc',
        nodeShape: 'blackHole',
        position: { x: 11, y: -8, z: -10 },
        features: ['Cloud Migration', 'DevOps', 'Kubernetes', 'Serverless'],
        icon: '\u25CE'
      },
      pulse: {
        id: 'pulse',
        name: 'PULSE',
        tagline: 'Marketing',
        description: 'Digital marketing, growth hacking, and brand amplification',
        theme: 'energy',
        color: '#ff4500',
        accentColor: '#ffd700',
        nodeShape: 'pulsingSphere',
        position: { x: 0, y: -10, z: -15 },
        features: ['SEO/SEM', 'Social Media', 'Content Strategy', 'Analytics'],
        icon: '\u223F'
      },
      quantum: {
        id: 'quantum',
        name: 'QUANTUM',
        tagline: 'Data Analytics',
        description: 'Big data analytics, visualization, and business intelligence',
        theme: 'atomic',
        color: '#00bfff',
        accentColor: '#ff69b4',
        nodeShape: 'atom',
        position: { x: -11, y: -8, z: -10 },
        features: ['Data Analysis', 'Visualization', 'BI Dashboards', 'Predictive Models'],
        icon: '\u2B21'
      },
      ember: {
        id: 'ember',
        name: 'EMBER',
        tagline: 'Video Production',
        description: 'Professional video production, editing, and post-production',
        theme: 'flame',
        color: '#ff6600',
        accentColor: '#ff0000',
        nodeShape: 'flame',
        position: { x: -16, y: -5, z: 2 },
        features: ['Video Production', 'Post-Production', 'Animation', 'VFX'],
        icon: '\u2B50'
      },
      frost: {
        id: 'frost',
        name: 'FROST',
        tagline: 'Security',
        description: 'Cybersecurity audits, penetration testing, and protection systems',
        theme: 'ice',
        color: '#e0ffff',
        accentColor: '#87ceeb',
        nodeShape: 'crystal',
        position: { x: -11, y: -3, z: 10 },
        features: ['Security Audits', 'Penetration Testing', 'Compliance', 'Encryption'],
        icon: '\u2744'
      },
      terra: {
        id: 'terra',
        name: 'TERRA',
        tagline: 'E-Commerce',
        description: 'E-commerce solutions, marketplace integration, and retail tech',
        theme: 'nature',
        color: '#228b22',
        accentColor: '#8b4513',
        nodeShape: 'tree',
        position: { x: -8, y: 0, z: 6 },
        features: ['Store Setup', 'Payment Integration', 'Inventory Systems', 'Fulfillment'],
        icon: '\u2698'
      },
      echo: {
        id: 'echo',
        name: 'ECHO',
        tagline: 'Audio Engineering',
        description: 'Sound design, music production, and audio branding',
        theme: 'wave',
        color: '#9400d3',
        accentColor: '#00ced1',
        nodeShape: 'waveRing',
        position: { x: 8, y: 0, z: 6 },
        features: ['Sound Design', 'Music Production', 'Podcasts', 'Audio Branding'],
        icon: '\u224B'
      },
      prism: {
        id: 'prism',
        name: 'PRISM',
        tagline: 'Photography',
        description: 'Professional photography, retouching, and visual content',
        theme: 'spectrum',
        color: '#ff1493',
        accentColor: '#00ff7f',
        nodeShape: 'prism',
        position: { x: 6, y: 2, z: -5 },
        features: ['Product Photography', 'Retouching', 'Asset Libraries', 'Virtual Tours'],
        icon: '\u25B3'
      },
      flux: {
        id: 'flux',
        name: 'FLUX',
        tagline: 'Animation',
        description: '2D/3D animation, motion design, and interactive experiences',
        theme: 'morph',
        color: '#ff00ff',
        accentColor: '#00ffff',
        nodeShape: 'morphingBlob',
        position: { x: -6, y: 2, z: -5 },
        features: ['2D Animation', '3D Animation', 'Motion Design', 'Interactive'],
        icon: '\u221E'
      }
    }
  }),

  getters: {
    getService: state => id => state.services[id],
    getAllServices: state => Object.values(state.services),
    getServiceIds: state => Object.keys(state.services)
  }
})
