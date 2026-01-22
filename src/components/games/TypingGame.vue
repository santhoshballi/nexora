<script setup>
import { ref } from 'vue'

defineProps({
  service: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete', 'score', 'level', 'difficulty'])

// Game state
const gameActive = ref(false)
const currentWord = ref('')
const typedText = ref('')
const words = ref([])
const score = ref(0)
const timeLeft = ref(60)
const gameTimer = ref(null)
const wordSpeed = ref(2)
const spaceshipHealth = ref(100)
const currentLevel = ref(1)
const difficulty = ref('easy')
const wordsPerLevel = ref(5)
const levelScores = ref([0, 0, 0]) // Track scores for each level

// Word lists for different difficulty levels
const wordLists = {
  easy: ['cat', 'dog', 'run', 'jump', 'play', 'eat', 'sleep', 'read', 'walk', 'talk', 'help'],
  medium: [
    'computer',
    'keyboard',
    'monitor',
    'program',
    'coding',
    'typing',
    'speed',
    'accuracy',
    'practice'
  ],
  hard: [
    'javascript',
    'development',
    'algorithm',
    'function',
    'variable',
    'constant',
    'interface',
    'component'
  ]
}

let bullets = []

function getRandomWord() {
  const allWords = [...wordLists[difficulty.value]]
  return allWords[Math.floor(Math.random() * allWords.length)]
}

function startGame() {
  gameActive.value = true
  score.value = 0
  timeLeft.value = 60
  currentLevel.value = 1
  wordsPerLevel.value = 0
  difficulty.value = 'easy'
  bullets = []
  spawnNewWord()
  startGameTimer()
}

function spawnNewWord() {
  const word = getRandomWord()
  currentWord.value = word
  typedText.value = ''

  // Create word element at random position
  const wordElement = {
    text: word,
    x: Math.random() * 80 - 10, // Random position 0-80%
    y: -50, // Start from top
    speed: wordSpeed.value,
    health: word.length,
    id: Date.now()
  }

  words.value.push(wordElement)
}

function startGameTimer() {
  gameTimer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--

      // Move words down
      words.value = words.value.map(word => ({
        ...word,
        y: word.y + word.speed
      }))

      // Check if any word reached spaceship
      words.value.forEach(word => {
        if (word.y > 70) {
          spaceshipHealth.value = Math.max(0, spaceshipHealth.value - 10)
          if (spaceshipHealth.value <= 0) {
            endGame()
          }
        }
      })
    } else {
      endGame()
    }
  }, 1000) // Update every second
}

function endGame() {
  gameActive.value = false
  clearInterval(gameTimer.value)

  // Save level score
  levelScores.value[currentLevel.value - 1] = Math.max(
    levelScores.value[currentLevel.value - 1] || 0,
    score.value
  )

  emit('complete', score.value)
  emit('score', score.value)
  emit('level', currentLevel.value)
  emit('difficulty', difficulty.value)
}
</script>

<template>
  <div class="typing-game" :class="{ active: gameActive }">
    <!-- Game Header -->
    <div class="game-header">
      <div class="game-title">{{ service.name }}</div>
      <div class="game-stats">
        <div class="stat">
          <span class="label">LEVEL</span>
          <span class="value">{{ currentLevel }}</span>
        </div>
        <div class="stat">
          <span class="label">SCORE</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="stat">
          <span class="label">TIME</span>
          <span class="value">{{ timeLeft }}s</span>
        </div>
        <div class="stat">
          <span class="label">DIFFICULTY</span>
          <span
            class="value"
            :class="{
              easy: difficulty === 'easy',
              medium: difficulty === 'medium',
              hard: difficulty === 'hard'
            }"
            >{{ difficulty.toUpperCase() }}</span
          >
        </div>
        <div class="stat">
          <span class="label">HEALTH</span>
          <div class="health-bar">
            <div class="health-fill" :style="{ width: spaceshipHealth + '%' }"></div>
          </div>
        </div>
        <div class="stat">
          <span class="label">WORDS/LEVEL</span>
          <span class="value">{{ wordsPerLevel }}/5</span>
        </div>
      </div>
    </div>

    <!-- Game Area -->
    <div v-if="gameActive" class="game-area">
      <!-- Spaceship -->
      <div class="spaceship">
        <div class="ship-body"></div>
        <div class="ship-cannon"></div>
      </div>

      <!-- Words -->
      <div
        v-for="word in words"
        :key="word.id"
        class="falling-word"
        :style="{ left: word.x + '%', top: word.y + 'px' }"
      >
        {{ word.text }}
        <div class="word-progress">
          <span class="typed">{{ typedText }}</span>
          <span class="remaining">{{ word.text.slice(typedText.length) }}</span>
        </div>
      </div>

      <!-- Bullets -->
      <div
        v-for="bullet in bullets"
        :key="bullet.id"
        class="bullet"
        :style="{ left: bullet.x + '%', top: bullet.y + 'px' }"
      ></div>
    </div>

    <!-- Start Screen -->
    <div v-if="!gameActive" class="start-screen">
      <div class="start-content">
        <h2>{{ service.name }}</h2>
        <p>{{ service.description }}</p>
        <div class="features">
          <div v-for="feature in service.features" :key="feature" class="feature">
            {{ feature }}
          </div>
        </div>
        <button class="start-button" @click="startGame">START GAME</button>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="!gameActive && timeLeft === 0" class="game-over">
      <div class="game-over-content">
        <h2>GAME OVER</h2>
        <p>Final Score: {{ score }}</p>
        <button class="restart-button" @click="startGame">PLAY AGAIN</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.typing-game {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a15 0%, #1a1a2e 100%);
  color: #00ff41;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  z-index: 100;
}

.game-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem 2rem;
  border-radius: 10px;
  border: 2px solid #00ff41;
}

.game-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff41;
  text-shadow: 0 0 10px #00ff41;
}

.game-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 0.8rem;
  color: rgba(0, 255, 65, 0.8);
  margin-bottom: 0.25rem;
}

.value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #00ff41;
  text-shadow: 0 0 5px #00ff41;
}

.health-bar {
  width: 100px;
  height: 10px;
  background: rgba(255, 0, 0, 0.3);
  border: 1px solid #00ff41;
  border-radius: 5px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #00ff41);
  transition: width 0.3s ease;
}

.game-area {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.spaceship {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 40px;
}

.ship-body {
  width: 100%;
  height: 30px;
  background: linear-gradient(135deg, #00ff41, #00cc33);
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
}

.ship-cannon {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 15px;
  background: #00ff41;
  border-radius: 2px;
}

.falling-word {
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  z-index: 10;
}

.word-progress {
  position: relative;
}

.typed {
  color: #00ff41;
  text-shadow: 0 0 5px #00ff41;
}

.remaining {
  color: #ff6b6b;
}

.bullet {
  position: absolute;
  width: 4px;
  height: 10px;
  background: #00ff41;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
  z-index: 15;
}

.start-screen,
.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(0, 0, 0, 0.9);
  padding: 3rem;
  border-radius: 15px;
  border: 2px solid #00ff41;
  min-width: 400px;
}

.start-content,
.game-over-content {
  color: #00ff41;
}

.start-content h2,
.game-over-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px #00ff41;
}

.start-content p,
.game-over-content p {
  font-size: 1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature {
  background: rgba(0, 255, 65, 0.1);
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 65, 0.3);
}

.start-button,
.restart-button {
  background: linear-gradient(135deg, #00ff41, #00cc33);
  color: #000;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.start-button:hover,
.restart-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.8);
}

.word-explosion {
  position: absolute;
  font-size: 2rem;
  z-index: 100;
  animation: explode 0.5s ease-out;
  pointer-events: none;
}

@keyframes explode {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.typing-game.active {
  animation: game-pulse 2s ease-in-out infinite;
}

@keyframes game-pulse {
  0%,
  100% {
    box-shadow: inset 0 0 50px rgba(0, 255, 65, 0.1);
  }
  50% {
    box-shadow: inset 0 0 80px rgba(0, 255, 65, 0.2);
  }
}
</style>
