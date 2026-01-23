<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete', 'score', 'level', 'difficulty'])

// Game state
const gameActive = ref(false)
const words = ref([])
const score = ref(0)
const timeLeft = ref(30)
const gameTimer = ref(null)
const countdownTimer = ref(null)
const spaceshipHealth = ref(100)
const currentLevel = ref(1)
const difficulty = ref('easy')
const wordsCompletedThisLevel = ref(0)
const totalWordsCompleted = ref(0)
const activeWordId = ref(null)
const levelComplete = ref(false)
const showLevelTransition = ref(false)

// Level configurations
const levelConfigs = {
  1: {
    name: 'Level 1 - Warmup',
    difficulty: 'easy',
    wordsToComplete: 10,
    timeLimit: 30,
    baseSpeed: 0.8,
    maxWords: 2,
    spawnRate: 0.02,
    healthDamage: 10
  },
  2: {
    name: 'Level 2 - Getting Faster',
    difficulty: 'easy',
    wordsToComplete: 15,
    timeLimit: 35,
    baseSpeed: 1.2,
    maxWords: 3,
    spawnRate: 0.025,
    healthDamage: 12
  },
  3: {
    name: 'Level 3 - Medium Words',
    difficulty: 'medium',
    wordsToComplete: 12,
    timeLimit: 40,
    baseSpeed: 1.0,
    maxWords: 3,
    spawnRate: 0.03,
    healthDamage: 15
  },
  4: {
    name: 'Level 4 - Speed Challenge',
    difficulty: 'medium',
    wordsToComplete: 15,
    timeLimit: 35,
    baseSpeed: 1.5,
    maxWords: 4,
    spawnRate: 0.035,
    healthDamage: 15
  },
  5: {
    name: 'Level 5 - Hard Mode',
    difficulty: 'hard',
    wordsToComplete: 10,
    timeLimit: 45,
    baseSpeed: 1.2,
    maxWords: 3,
    spawnRate: 0.03,
    healthDamage: 20
  },
  6: {
    name: 'Level 6 - Ultimate Test',
    difficulty: 'hard',
    wordsToComplete: 15,
    timeLimit: 40,
    baseSpeed: 1.8,
    maxWords: 4,
    spawnRate: 0.04,
    healthDamage: 20
  }
}

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

// Computed property for current level config (safe for template usage)
const currentLevelConfig = computed(() => {
  return levelConfigs[currentLevel.value] || levelConfigs[1]
})

function getCurrentLevelConfig() {
  return levelConfigs[currentLevel.value] || levelConfigs[1]
}

function getRandomWord() {
  const config = getCurrentLevelConfig()
  const allWords = [...wordLists[config.difficulty]]
  return allWords[Math.floor(Math.random() * allWords.length)]
}

function startGame() {
  gameActive.value = true
  score.value = 0
  currentLevel.value = 1
  totalWordsCompleted.value = 0
  levelComplete.value = false
  showLevelTransition.value = false
  spaceshipHealth.value = 100
  words.value = []
  activeWordId.value = null
  bullets = []

  startLevel(1)
}

function startLevel(levelNum) {
  currentLevel.value = levelNum
  const config = getCurrentLevelConfig()
  difficulty.value = config.difficulty

  wordsCompletedThisLevel.value = 0
  timeLeft.value = config.timeLimit
  spaceshipHealth.value = 100
  words.value = []
  activeWordId.value = null
  levelComplete.value = false
  gameActive.value = true

  // Spawn initial words
  spawnNewWord()
  if (config.maxWords >= 2) {
    spawnNewWord()
  }

  startGameTimer()
}

function spawnNewWord() {
  const word = getRandomWord()
  const config = getCurrentLevelConfig()

  // Create word element at random position
  const wordElement = {
    text: word,
    typedSoFar: '', // Track typing progress for this word
    x: Math.random() * 70 + 10, // Random position 10-80%
    y: -50, // Start from top
    speed: config.baseSpeed,
    id: Date.now() + Math.random() // Ensure unique ID
  }

  words.value.push(wordElement)
}

function startGameTimer() {
  // Main game loop - runs every 100ms
  gameTimer.value = setInterval(() => {
    if (timeLeft.value > 0 && gameActive.value && !levelComplete.value) {
      // Move words down
      words.value = words.value.map(word => ({
        ...word,
        y: word.y + word.speed
      }))

      // Check if any word reached spaceship and remove them
      const wordsToRemove = []
      words.value.forEach((word, index) => {
        if (word.y > 500) {
          // Word reached spaceship
          const currentConfig = getCurrentLevelConfig()
          spaceshipHealth.value = Math.max(0, spaceshipHealth.value - currentConfig.healthDamage)
          wordsToRemove.push(index)

          if (spaceshipHealth.value <= 0) {
            endGame(false)
          }
        }
      })

      // Remove words that hit spaceship (in reverse order to preserve indices)
      for (let i = wordsToRemove.length - 1; i >= 0; i--) {
        words.value.splice(wordsToRemove[i], 1)
      }

      // Spawn new words periodically using level config
      const currentConfig = getCurrentLevelConfig()
      if (Math.random() < currentConfig.spawnRate && words.value.length < currentConfig.maxWords) {
        spawnNewWord()
      }
    }
  }, 100) // Update every 100ms for smooth movement

  // Countdown timer - runs every 1 second
  countdownTimer.value = setInterval(() => {
    if (timeLeft.value > 0 && gameActive.value && !levelComplete.value) {
      timeLeft.value--
    } else if (timeLeft.value === 0 && !levelComplete.value) {
      // Time ran out without completing level
      endGame(false)
    }
  }, 1000)
}

function completeLevel() {
  console.warn('=== LEVEL COMPLETE ===')
  console.warn('Current level:', currentLevel.value)
  console.warn('Words completed:', wordsCompletedThisLevel.value)
  console.warn('Level config:', getCurrentLevelConfig())

  levelComplete.value = true
  gameActive.value = false
  clearInterval(gameTimer.value)
  clearInterval(countdownTimer.value)

  // Show level transition screen
  showLevelTransition.value = true
  console.warn('Show level transition:', showLevelTransition.value)

  // Auto-progress to next level after 3 seconds
  setTimeout(() => {
    console.warn('Transition timeout triggered')
    const nextLevel = currentLevel.value + 1
    console.warn('Next level:', nextLevel)
    console.warn('Next level config exists:', !!levelConfigs[nextLevel])

    if (levelConfigs[nextLevel]) {
      console.warn('Starting next level...')
      showLevelTransition.value = false
      startLevel(nextLevel)
    } else {
      console.warn('Game complete - all levels finished')
      // Game complete - all levels finished
      endGame(true)
    }
  }, 3000)
}

function endGame(_won = false) {
  gameActive.value = false
  levelComplete.value = false
  showLevelTransition.value = false
  clearInterval(gameTimer.value)
  clearInterval(countdownTimer.value)

  emit('complete', score.value)
  emit('score', score.value)
  emit('level', currentLevel.value)
  emit('difficulty', getCurrentLevelConfig().difficulty)
}

function handleKeyPress(event) {
  if (!gameActive.value) return

  const key = event.key.toLowerCase()

  // Ignore special keys
  if (key.length > 1) return

  // If we're already typing a word, continue with that word
  if (activeWordId.value) {
    const activeWord = words.value.find(w => w.id === activeWordId.value)
    if (activeWord) {
      const nextChar = activeWord.text[activeWord.typedSoFar.length]
      if (key === nextChar) {
        activeWord.typedSoFar += key

        // Check if word is complete
        if (activeWord.typedSoFar === activeWord.text) {
          completeWord(activeWord)
          activeWordId.value = null
        }
        return
      } else {
        // Wrong key, reset this word
        activeWord.typedSoFar = ''
        activeWordId.value = null
      }
    }
  }

  // Try to start typing a new word
  for (const word of words.value) {
    if (word.typedSoFar === '' && word.text[0] === key) {
      word.typedSoFar = key
      activeWordId.value = word.id

      // Check if it's a one-letter word
      if (word.typedSoFar === word.text) {
        completeWord(word)
        activeWordId.value = null
      }
      break
    }
  }
}

function completeWord(word) {
  const config = getCurrentLevelConfig()
  console.warn('=== WORD COMPLETED ===')
  console.warn('Word:', word.text)
  console.warn('Words completed this level:', wordsCompletedThisLevel.value)
  console.warn('Words to complete:', config.wordsToComplete)

  // Calculate score based on word length and difficulty
  const baseScore = word.text.length * 10
  const difficultyMultiplier =
    config.difficulty === 'easy' ? 1 : config.difficulty === 'medium' ? 2 : 3
  score.value += baseScore * difficultyMultiplier

  // Remove word from array
  const wordIndex = words.value.findIndex(w => w.id === word.id)
  if (wordIndex !== -1) {
    createExplosion(words.value[wordIndex].x, words.value[wordIndex].y)
    words.value.splice(wordIndex, 1)
  }

  // Increment word counts
  wordsCompletedThisLevel.value++
  totalWordsCompleted.value++

  console.warn('After increment - Words completed:', wordsCompletedThisLevel.value)
  console.warn('Target words:', config.wordsToComplete)

  // Check if level is complete
  if (wordsCompletedThisLevel.value >= config.wordsToComplete) {
    console.warn('LEVEL COMPLETE TRIGGERED!')
    completeLevel()
  }
}

function createExplosion(x, y) {
  // Create visual explosion effect
  const explosion = document.createElement('div')
  explosion.className = 'word-explosion'
  explosion.style.left = x + '%'
  explosion.style.top = y + 'px'
  explosion.textContent = '💥'
  document.body.appendChild(explosion)

  // Remove explosion after animation
  setTimeout(() => {
    explosion.remove()
  }, 500)
}

onMounted(() => {
  console.warn('=== TYPING GAME MOUNTED ===')
  console.warn('Props service:', props.service)
  console.warn('Current level:', currentLevel.value)
  console.warn('Level config:', currentLevelConfig.value)
  console.warn('Game active:', gameActive.value)
  console.warn('===========================')
  window.addEventListener('keypress', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keypress', handleKeyPress)
  if (gameTimer.value) {
    clearInterval(gameTimer.value)
  }
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})
</script>

<template>
  <div class="typing-game" :class="{ active: gameActive }">
    <!-- DEBUG INDICATOR -->
    <div
      style="
        position: fixed;
        top: 5px;
        right: 5px;
        background: lime;
        color: black;
        padding: 5px;
        z-index: 99999;
        font-size: 12px;
      "
    >
      GAME LOADED
    </div>

    <!-- Game Header -->
    <div class="game-header">
      <div class="level-info">
        <div class="level-name">{{ currentLevelConfig.name }}</div>
        <div class="level-subtitle">{{ currentLevelConfig.difficulty.toUpperCase() }} MODE</div>
      </div>
      <div class="game-stats">
        <div class="stat">
          <span class="label">SCORE</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="stat">
          <span class="label">TIME</span>
          <span class="value">{{ timeLeft }}s</span>
        </div>
        <div class="stat">
          <span class="label">PROGRESS</span>
          <span class="value"
            >{{ wordsCompletedThisLevel }}/{{ currentLevelConfig.wordsToComplete }}</span
          >
        </div>
        <div class="stat">
          <span class="label">HEALTH</span>
          <div class="health-bar">
            <div class="health-fill" :style="{ width: spaceshipHealth + '%' }"></div>
          </div>
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
        :class="{ active: word.id === activeWordId }"
        :style="{ left: word.x + '%', top: word.y + 'px' }"
      >
        <div class="word-text">
          <span class="typed">{{ word.typedSoFar }}</span>
          <span class="remaining">{{ word.text.slice(word.typedSoFar.length) }}</span>
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

    <!-- Level Transition Screen -->
    <div v-if="showLevelTransition" class="level-transition">
      <div class="transition-content">
        <div class="level-complete-badge">✓</div>
        <h2>LEVEL {{ currentLevel }} COMPLETE!</h2>
        <div class="level-stats">
          <div class="stat-item">
            <span class="stat-label">Words Typed:</span>
            <span class="stat-value">{{ wordsCompletedThisLevel }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Time Remaining:</span>
            <span class="stat-value">{{ timeLeft }}s</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Health:</span>
            <span class="stat-value">{{ spaceshipHealth }}%</span>
          </div>
        </div>
        <div v-if="levelConfigs[currentLevel + 1]" class="next-level-info">
          <p class="next-level-text">NEXT: {{ levelConfigs[currentLevel + 1].name }}</p>
          <div class="loading-bar">
            <div class="loading-fill"></div>
          </div>
        </div>
        <div v-else class="victory-message">
          <p>🎉 ALL LEVELS COMPLETE! 🎉</p>
        </div>
      </div>
    </div>

    <!-- Start Screen -->
    <div v-if="!gameActive && !showLevelTransition" class="start-screen">
      <div class="start-content">
        <h2>{{ service?.name || 'TYPING PRACTICE' }}</h2>
        <p>{{ service?.description || 'Type words to shoot them down!' }}</p>
        <div class="level-preview">
          <h3>6 CHALLENGING LEVELS</h3>
          <div class="levels-grid">
            <div class="level-card">
              <div class="level-number">1</div>
              <div class="level-difficulty">easy</div>
            </div>
            <div class="level-card">
              <div class="level-number">2</div>
              <div class="level-difficulty">easy</div>
            </div>
            <div class="level-card">
              <div class="level-number">3</div>
              <div class="level-difficulty">medium</div>
            </div>
            <div class="level-card">
              <div class="level-number">4</div>
              <div class="level-difficulty">medium</div>
            </div>
            <div class="level-card">
              <div class="level-number">5</div>
              <div class="level-difficulty">hard</div>
            </div>
            <div class="level-card">
              <div class="level-number">6</div>
              <div class="level-difficulty">hard</div>
            </div>
          </div>
        </div>
        <button class="start-button" @click="startGame">START LEVEL 1</button>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="!gameActive && !showLevelTransition && spaceshipHealth === 0" class="game-over">
      <div class="game-over-content">
        <h2>GAME OVER</h2>
        <p>You reached Level {{ currentLevel }}</p>
        <p class="final-score">Final Score: {{ score }}</p>
        <p class="total-words">Total Words: {{ totalWordsCompleted }}</p>
        <button class="restart-button" @click="startGame">TRY AGAIN</button>
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
  background: radial-gradient(ellipse at center, #0a0a15 0%, #050510 50%, #000000 100%);
  color: #00ff41;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.typing-game::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 65, 0.03) 2px,
      rgba(0, 255, 65, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 65, 0.03) 2px,
      rgba(0, 255, 65, 0.03) 4px
    );
  pointer-events: none;
  z-index: 1;
}

.game-header {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 20, 40, 0.8));
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #00ff41;
  box-shadow:
    0 0 30px rgba(0, 255, 65, 0.4),
    inset 0 0 20px rgba(0, 255, 65, 0.1);
  backdrop-filter: blur(10px);
  z-index: 10;
  flex-shrink: 0;
}

.level-info {
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.level-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff41;
  text-shadow:
    0 0 20px rgba(0, 255, 65, 0.8),
    0 0 40px rgba(0, 255, 65, 0.4);
  letter-spacing: 0.1em;
  animation: title-glow 2s ease-in-out infinite;
}

.level-subtitle {
  font-size: 0.7rem;
  color: rgba(0, 255, 65, 0.7);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

@keyframes title-glow {
  0%,
  100% {
    text-shadow:
      0 0 20px rgba(0, 255, 65, 0.8),
      0 0 40px rgba(0, 255, 65, 0.4);
  }
  50% {
    text-shadow:
      0 0 30px rgba(0, 255, 65, 1),
      0 0 60px rgba(0, 255, 65, 0.6);
  }
}

.game-stats {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 80px;
}

.stat::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 12px;
  background: linear-gradient(180deg, transparent, #00ff41);
}

.label {
  font-size: 0.7rem;
  color: rgba(0, 255, 65, 0.9);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
  font-family: 'Courier New', monospace;
}

.value.easy {
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
}

.value.medium {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

.value.hard {
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

.health-bar {
  width: 120px;
  height: 14px;
  background: linear-gradient(90deg, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.4));
  border: 2px solid #00ff41;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #ff6b6b, #00ff41);
  transition:
    width 0.5s ease,
    background 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.6);
}

.health-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent);
  pointer-events: none;
}

.game-area {
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
  z-index: 5;
}

.spaceship {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 50px;
  z-index: 20;
}

.ship-body {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #00ff41, #00cc33, #009922);
  border-radius: 15px 15px 5px 5px;
  box-shadow:
    0 0 30px rgba(0, 255, 65, 0.8),
    0 0 60px rgba(0, 255, 65, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  position: relative;
  animation: ship-hover 3s ease-in-out infinite;
}

@keyframes ship-hover {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.ship-body::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  filter: blur(5px);
}

.ship-cannon {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 20px;
  background: linear-gradient(180deg, #00ff41, #00cc33);
  border-radius: 3px;
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.8);
}

.ship-cannon::after {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #00ff41, transparent);
  border-radius: 50%;
  animation: cannon-glow 1s ease-in-out infinite;
}

@keyframes cannon-glow {
  0%,
  100% {
    opacity: 0.5;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.5);
  }
}

.falling-word {
  position: absolute;
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow:
    0 0 15px rgba(255, 255, 255, 0.8),
    0 0 30px rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  z-index: 10;
  animation: word-float 2s ease-in-out infinite;
}

.falling-word.active {
  transform: scale(1.2);
  z-index: 20;
  text-shadow:
    0 0 20px rgba(0, 255, 65, 0.8),
    0 0 40px rgba(0, 255, 65, 0.6);
}

@keyframes word-float {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
}

.word-text {
  position: relative;
  display: inline-block;
}

.typed {
  color: #00ff41;
  text-shadow:
    0 0 10px rgba(0, 255, 65, 0.8),
    0 0 20px rgba(0, 255, 65, 0.4);
  animation: typed-glow 0.3s ease;
}

@keyframes typed-glow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.remaining {
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

.bullet {
  position: absolute;
  width: 6px;
  height: 15px;
  background: linear-gradient(180deg, #00ff41, #00cc33);
  border-radius: 3px;
  box-shadow:
    0 0 20px rgba(0, 255, 65, 0.8),
    0 0 40px rgba(0, 255, 65, 0.4);
  z-index: 15;
  animation: bullet-trail 0.5s ease-in-out infinite;
}

@keyframes bullet-trail {
  0%,
  100% {
    box-shadow:
      0 0 20px rgba(0, 255, 65, 0.8),
      0 0 40px rgba(0, 255, 65, 0.4);
  }
  50% {
    box-shadow:
      0 0 30px rgba(0, 255, 65, 1),
      0 0 60px rgba(0, 255, 65, 0.6);
  }
}

.start-screen,
.game-over,
.level-transition {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 20, 40, 0.9));
  padding: 4rem;
  border-radius: 20px;
  border: 3px solid #00ff41;
  min-width: 600px;
  max-width: 80vw;
  box-shadow:
    0 0 50px rgba(0, 255, 65, 0.4),
    inset 0 0 30px rgba(0, 255, 65, 0.1);
  backdrop-filter: blur(20px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-content,
.game-over-content {
  color: #00ff41;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-content h2,
.game-over-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-shadow:
    0 0 20px rgba(0, 255, 65, 0.8),
    0 0 40px rgba(0, 255, 65, 0.4);
  letter-spacing: 0.1em;
  animation: title-pulse 2s ease-in-out infinite;
}

@keyframes title-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.start-content p,
.game-over-content p {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 500px;
  text-align: center;
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  width: 100%;
  max-width: 500px;
}

.feature {
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(0, 255, 65, 0.05));
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 65, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.3), transparent);
  transition: left 0.5s ease;
}

.feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 65, 0.3);
}

.feature:hover::before {
  left: 100%;
}

.start-button,
.restart-button {
  background: linear-gradient(135deg, #00ff41, #00cc33, #009922);
  color: #000;
  border: none;
  padding: 1.5rem 3rem;
  font-size: 1.4rem;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(0, 255, 65, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
}

.start-button::before,
.restart-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.start-button:hover,
.restart-button:hover {
  transform: scale(1.05);
  box-shadow:
    0 0 40px rgba(0, 255, 65, 0.6),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
}

.start-button:hover::before,
.restart-button:hover::before {
  left: 100%;
}

.start-button:active,
.restart-button:active {
  transform: scale(0.98);
}

.word-explosion {
  position: absolute;
  font-size: 3rem;
  z-index: 100;
  animation: explode 0.8s ease-out;
  pointer-events: none;
}

@keyframes explode {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(2) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(3) rotate(360deg);
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

/* Level Transition Screen */
.transition-content {
  color: #00ff41;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.level-complete-badge {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00ff41, #00cc33);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #000;
  animation: badge-pop 0.5s ease-out;
  box-shadow:
    0 0 40px rgba(0, 255, 65, 0.8),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
}

@keyframes badge-pop {
  0% {
    transform: scale(0) rotate(-180deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.level-stats {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(0, 255, 65, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
}

.next-level-info {
  width: 100%;
  margin-top: 1rem;
}

.next-level-text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #00ff41;
}

.loading-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 255, 65, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.loading-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #00ff41, #00cc33);
  animation: loading-progress 3s linear;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
}

@keyframes loading-progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

.victory-message {
  font-size: 1.5rem;
  font-weight: bold;
  animation: victory-pulse 1s ease-in-out infinite;
}

@keyframes victory-pulse {
  0%,
  100% {
    transform: scale(1);
    text-shadow: 0 0 20px rgba(0, 255, 65, 0.8);
  }
  50% {
    transform: scale(1.1);
    text-shadow: 0 0 40px rgba(0, 255, 65, 1);
  }
}

/* Level Preview */
.level-preview {
  margin: 2rem 0;
}

.level-preview h3 {
  font-size: 1rem;
  color: rgba(0, 255, 65, 0.8);
  margin-bottom: 1.5rem;
  letter-spacing: 0.2em;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.level-card {
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(0, 255, 65, 0.05));
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.level-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 255, 65, 0.3);
  border-color: #00ff41;
}

.level-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff41;
}

.level-difficulty {
  font-size: 0.7rem;
  color: rgba(0, 255, 65, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.final-score,
.total-words {
  font-size: 1.3rem;
  margin: 0.5rem 0;
}
</style>
