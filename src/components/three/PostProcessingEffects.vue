<script setup>
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'

const props = defineProps({
  renderer: {
    type: Object,
    required: true
  },
  scene: {
    type: Object,
    required: true
  },
  camera: {
    type: Object,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  }
})

const composer = ref(null)
const bloomPass = ref(null)

function initPostProcessing() {
  if (!props.renderer || !props.scene || !props.camera) return

  composer.value = new EffectComposer(props.renderer)
  composer.value.setSize(window.innerWidth, window.innerHeight)

  // Base render pass
  const renderPass = new RenderPass(props.scene, props.camera)
  composer.value.addPass(renderPass)

  // Bloom effect for glowing nodes
  bloomPass.value = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
  )
  composer.value.addPass(bloomPass.value)

  // Film grain for cinematic feel
  const filmPass = new FilmPass(
    0.35, // noise intensity
    0.025, // scanline intensity
    648, // scanline count
    false // grayscale
  )
  composer.value.addPass(filmPass)

  // Custom shader for chromatic aberration
  const chromaticAberrationShader = {
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      intensity: { value: 0.1 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        float aberration = intensity * sin(time * 2.0);
        
        vec4 r = texture2D(tDiffuse, uv + vec2(aberration, 0.0));
        vec4 g = texture2D(tDiffuse, uv);
        vec4 b = texture2D(tDiffuse, uv - vec2(aberration, 0.0));
        
        gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
      }
    `
  }

  const chromaticPass = new ShaderPass(chromaticAberrationShader)
  composer.value.addPass(chromaticPass)
}

function updateComposerSize() {
  if (composer.value) {
    composer.value.setSize(window.innerWidth, window.innerHeight)
  }
}

function animate() {
  if (composer.value && props.enabled) {
    composer.value.render()
  }
}

watch(
  () => props.enabled,
  newVal => {
    if (newVal && !composer.value) {
      initPostProcessing()
    }
  }
)

onMounted(() => {
  if (props.enabled) {
    initPostProcessing()
    window.addEventListener('resize', updateComposerSize)
  }
})

defineExpose({
  composer,
  animate,
  initPostProcessing
})
</script>
