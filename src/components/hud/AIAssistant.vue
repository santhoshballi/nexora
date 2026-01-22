<script setup>
import { ref, nextTick } from 'vue'
import { useAIAssistant } from '@/composables/useAIAssistant.js'

const {
  isActive,
  messages,
  isTyping,
  aiPersonality,
  hasUnreadMessages,
  sendMessage,
  provideContextualHelp,
  clearMessages,
  toggleAssistant
} = useAIAssistant()

const userInput = ref('')
const messagesContainer = ref(null)
const quickActions = ref([
  { label: 'Explore Services', action: 'service_help', icon: '🌟' },
  { label: 'Navigation Help', action: 'navigation_help', icon: '🧭' },
  { label: 'Authentication', action: 'auth_required', icon: '🔐' },
  { label: 'Get Started', action: 'first_visit', icon: '🚀' }
])

async function handleSendMessage() {
  if (!userInput.value.trim()) return

  await sendMessage(userInput.value)
  userInput.value = ''
  scrollToBottom()
}

function handleQuickAction(action) {
  provideContextualHelp(action)
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="ai-assistant-container">
    <!-- AI Assistant Toggle Button -->
    <button
      ref="assistantButton"
      class="ai-toggle-button"
      :class="{ active: isActive, 'has-messages': hasUnreadMessages }"
      @click="toggleAssistant"
    >
      <div class="ai-avatar">{{ aiPersonality.avatar }}</div>
      <div v-if="hasUnreadMessages" class="notification-dot"></div>
    </button>

    <!-- AI Assistant Panel -->
    <Transition name="assistant-panel">
      <div v-if="isActive" class="ai-assistant-panel">
        <!-- Header -->
        <div class="ai-header">
          <div class="ai-info">
            <div class="ai-avatar-large">{{ aiPersonality.avatar }}</div>
            <div class="ai-details">
              <h3>{{ aiPersonality.name }}</h3>
              <p>{{ aiPersonality.expertise.join(', ') }}</p>
            </div>
          </div>
          <div class="ai-controls">
            <button class="control-btn" title="Clear Chat" @click="clearMessages">🗑️</button>
            <button class="control-btn" title="Close" @click="toggleAssistant">×</button>
          </div>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="messages-container">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="[message.sender, { contextual: message.isContextual }]"
          >
            <div v-if="message.sender === 'ai'" class="message-avatar">
              {{ message.avatar || aiPersonality.avatar }}
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message ai typing">
            <div class="message-avatar">{{ aiPersonality.avatar }}</div>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <button
            v-for="action in quickActions"
            :key="action.action"
            class="quick-action-btn"
            @click="handleQuickAction(action.action)"
          >
            <span class="action-icon">{{ action.icon }}</span>
            <span class="action-label">{{ action.label }}</span>
          </button>
        </div>

        <!-- Input Area -->
        <div class="input-area">
          <div class="input-container">
            <input
              v-model="userInput"
              placeholder="Ask me anything about NEXORA..."
              class="message-input"
              maxlength="200"
              @keyup.enter="handleSendMessage"
            />
            <button :disabled="!userInput.trim()" class="send-button" @click="handleSendMessage">
              ➤
            </button>
          </div>
          <div class="input-status">{{ userInput.length }}/200 characters</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ai-assistant-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10000;
}

.ai-toggle-button {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7df9ff 0%, #4169e1 100%);
  border: 3px solid rgba(125, 249, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(125, 249, 255, 0.3);
}

.ai-toggle-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(125, 249, 255, 0.5);
}

.ai-toggle-button.active {
  background: linear-gradient(135deg, #00ff41 0%, #003b00 100%);
  border-color: rgba(0, 255, 65, 0.5);
}

.ai-avatar {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.notification-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: #ff6b6b;
  border-radius: 50%;
  border: 2px solid #0a0a15;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.ai-assistant-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  height: 600px;
  background: rgba(10, 10, 21, 0.98);
  border: 1px solid rgba(125, 249, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(30px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}

.ai-header {
  padding: 20px;
  background: rgba(125, 249, 255, 0.05);
  border-bottom: 1px solid rgba(125, 249, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar-large {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #7df9ff 0%, #4169e1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.ai-details h3 {
  margin: 0;
  font-size: 1rem;
  color: #7df9ff;
  font-weight: 600;
}

.ai-details p {
  margin: 4px 0 0 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.ai-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 100%;
}

.message.user {
  flex-direction: row-reverse;
}

.message.contextual {
  background: rgba(125, 249, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(125, 249, 255, 0.1);
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7df9ff 0%, #4169e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #00ff41 0%, #003b00 100%);
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-text {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.4;
}

.message.user .message-text {
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.2) 0%, rgba(0, 59, 0, 0.2) 100%);
  border: 1px solid rgba(0, 255, 65, 0.3);
}

.message-time {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  padding: 0 8px;
}

.message.user .message-time {
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: fit-content;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(125, 249, 255, 0.6);
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.quick-actions {
  padding: 16px 20px;
  border-top: 1px solid rgba(125, 249, 255, 0.1);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(125, 249, 255, 0.1);
  border: 1px solid rgba(125, 249, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.quick-action-btn:hover {
  background: rgba(125, 249, 255, 0.2);
  border-color: rgba(125, 249, 255, 0.4);
}

.action-icon {
  font-size: 1rem;
}

.input-area {
  padding: 16px 20px;
  border-top: 1px solid rgba(125, 249, 255, 0.1);
}

.input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.message-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
}

.message-input:focus {
  border-color: rgba(125, 249, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.message-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.send-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7df9ff 0%, #4169e1 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-status {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: right;
}

/* Transitions */
.assistant-panel-enter-active,
.assistant-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.assistant-panel-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.assistant-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* Responsive */
@media (max-width: 480px) {
  .ai-assistant-panel {
    width: calc(100vw - 40px);
    right: -10px;
    height: 500px;
  }

  .ai-assistant-container {
    bottom: 20px;
    right: 20px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
