import { ref, computed } from 'vue'
import { useSoundSystem } from './useSoundSystem.js'

export function useAIAssistant() {
  const isActive = ref(false)
  const messages = ref([])
  const isTyping = ref(false)
  const currentResponse = ref('')
  const { playSound } = useSoundSystem()

  const aiPersonality = {
    name: 'NEXUS AI',
    avatar: '🤖',
    mood: 'helpful',
    expertise: ['NEXORA services', '3D navigation', 'dimensional travel', 'cybersecurity']
  }

  const contextualResponses = {
    greeting: [
      "Welcome to NEXORA! I'm your AI guide through the multiverse of services.",
      'Greetings, traveler! Ready to explore the 12 dimensions of NEXORA?',
      "Hello! I'm here to help you navigate our cosmic marketplace."
    ],
    service_help: [
      'Each dimension represents a unique service. Click on any node to begin your journey!',
      'The glowing nodes are portals to different service dimensions. Which one interests you?',
      'Try hovering over nodes to see what each dimension offers.'
    ],
    navigation: [
      'Use your mouse to explore the 3D space. Click to select a service dimension.',
      'You can switch between 3D and grid view using the controls in the top right.',
      'Mobile users get a special 2D grid layout optimized for touch.'
    ],
    authentication: [
      'Each service requires separate authentication - like having different keys for different rooms.',
      'Your credentials are isolated per service for maximum security.',
      "Look for the green checkmark on services you've already unlocked."
    ]
  }

  function getResponse(context) {
    const responses = contextualResponses[context] || contextualResponses.greeting
    return responses[Math.floor(Math.random() * responses.length)]
  }

  async function sendMessage(userMessage, context = 'general') {
    if (!userMessage.trim()) return

    // Add user message
    messages.value.push({
      id: Date.now(),
      sender: 'user',
      text: userMessage,
      timestamp: new Date()
    })

    playSound('click')
    isTyping.value = true

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate contextual response
    const response = getResponse(context, userMessage)

    // Typing animation
    currentResponse.value = ''
    const words = response.split('')

    for (let i = 0; i < words.length; i++) {
      currentResponse.value += words[i]
      await new Promise(resolve => setTimeout(resolve, 30))
    }

    // Add AI response
    messages.value.push({
      id: Date.now() + 1,
      sender: 'ai',
      text: currentResponse.value,
      timestamp: new Date(),
      avatar: aiPersonality.avatar
    })

    isTyping.value = false
    currentResponse.value = ''
    playSound('success')
  }

  function provideContextualHelp(userAction) {
    const contextMap = {
      first_visit: 'greeting',
      service_hover: 'service_help',
      navigation_help: 'navigation',
      auth_required: 'authentication'
    }

    const context = contextMap[userAction] || 'greeting'
    const response = getResponse(context)

    messages.value.push({
      id: Date.now(),
      sender: 'ai',
      text: response,
      timestamp: new Date(),
      avatar: aiPersonality.avatar,
      isContextual: true
    })

    playSound('hover')
  }

  function clearMessages() {
    messages.value = []
    playSound('click')
  }

  const hasUnreadMessages = computed(() => {
    return messages.value.length > 0
  })

  const lastMessage = computed(() => {
    return messages.value[messages.value.length - 1]
  })

  return {
    isActive,
    messages,
    isTyping,
    currentResponse,
    aiPersonality,
    hasUnreadMessages,
    lastMessage,
    sendMessage,
    provideContextualHelp,
    clearMessages,
    toggleAssistant: () => {
      isActive.value = !isActive.value
      playSound('hover')
    }
  }
}
