<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  verified: [token: string]
}>()

const { t } = useI18n()
const uid = useId()

type Challenge = {
  id: string
  seal: string
  targetAngle: number
  sectorSize: number
  startAngle: number
}

const SIZE = 200
const CX = SIZE / 2
const CY = SIZE / 2
const ORBIT_R = 67
const SECTOR_DEPTH = 14
const MIN_FALLBACK_MS = 600

const gradientId = `midesk-captcha-orbit-${uid}`
const glowId = `midesk-captcha-glow-${uid}`

const loading = ref(true)
const verifying = ref(false)
const challenge = ref<Challenge | null>(null)
const currentAngle = ref(0)
const status = ref<'idle' | 'dragging' | 'success' | 'fail'>('idle')
const interactionStart = ref(0)
const burst = ref(false)
const dialRef = ref<HTMLElement | null>(null)

const verified = computed(() => status.value === 'success')

watch(verified, (ok) => {
  emit('update:modelValue', ok)
})

function pointerToAngle(clientX: number, clientY: number) {
  const el = dialRef.value
  if (!el) return currentAngle.value

  const rect = el.getBoundingClientRect()
  const x = clientX - rect.left - rect.width / 2
  const y = clientY - rect.top - rect.height / 2
  const rad = Math.atan2(x, -y)
  let deg = (rad * 180) / Math.PI
  if (deg < 0) deg += 360
  return deg
}

function polar(angle: number, radius = ORBIT_R) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad)
  }
}

function sectorPath(angle: number, spread: number) {
  const start = angle - spread / 2
  const end = angle + spread / 2
  const p1 = polar(start, ORBIT_R - SECTOR_DEPTH)
  const p2 = polar(end, ORBIT_R - SECTOR_DEPTH)
  const p3 = polar(end, ORBIT_R + SECTOR_DEPTH)
  const p4 = polar(start, ORBIT_R + SECTOR_DEPTH)
  const large = spread > 180 ? 1 : 0
  return `M ${p1.x} ${p1.y} A ${ORBIT_R - SECTOR_DEPTH} ${ORBIT_R - SECTOR_DEPTH} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${ORBIT_R + SECTOR_DEPTH} ${ORBIT_R + SECTOR_DEPTH} 0 ${large} 0 ${p4.x} ${p4.y} Z`
}

const handlePos = computed(() => polar(currentAngle.value, ORBIT_R))

const targetNear = computed(() => {
  if (!challenge.value) return false
  const target = challenge.value.targetAngle
  const diff = Math.abs(((currentAngle.value - target + 540) % 360) - 180)
  return diff <= 16
})

async function loadChallenge() {
  loading.value = true
  status.value = 'idle'
  burst.value = false
  emit('update:modelValue', false)

  try {
    const data = await $fetch<Challenge>('/api/captcha/challenge')
    challenge.value = data
    currentAngle.value = data.startAngle
  } catch {
    challenge.value = null
  } finally {
    loading.value = false
  }
}

function onPointerDown(e: PointerEvent) {
  if (verified.value || loading.value || verifying.value) return
  status.value = 'dragging'
  interactionStart.value = performance.now()
  currentAngle.value = pointerToAngle(e.clientX, e.clientY)
  ;(e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (status.value !== 'dragging') return
  currentAngle.value = pointerToAngle(e.clientX, e.clientY)
}

async function onPointerUp() {
  if (status.value !== 'dragging' || !challenge.value) return
  status.value = 'idle'
  await attemptVerify()
}

async function attemptVerify() {
  if (!challenge.value || verifying.value || verified.value) return

  verifying.value = true
  try {
    const result = await $fetch<{ token: string }>('/api/captcha/verify', {
      method: 'POST',
      body: {
        id: challenge.value.id,
        seal: challenge.value.seal,
        angle: currentAngle.value,
        durationMs: Math.max(performance.now() - interactionStart.value, MIN_FALLBACK_MS)
      }
    })

    status.value = 'success'
    burst.value = true
    emit('verified', result.token)
    emit('update:modelValue', true)
  } catch {
    status.value = 'fail'
    window.setTimeout(() => {
      if (status.value === 'fail') status.value = 'idle'
    }, 650)
  } finally {
    verifying.value = false
  }
}

let dragging = false

function onDialPointerDown(e: PointerEvent) {
  dragging = true
  onPointerDown(e)
}

function onWindowPointerMove(e: PointerEvent) {
  if (!dragging) return
  onPointerMove(e)
}

function onWindowPointerUp() {
  if (!dragging) return
  dragging = false
  onPointerUp()
}

onMounted(() => {
  void loadChallenge()
  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
})

defineExpose({ refresh: loadChallenge })
</script>

<template>
  <div
    class="midesk-motion-captcha"
    :class="[
      `is-${status}`,
      { 'is-verified': verified, 'is-near': targetNear && !verified }
    ]"
  >
    <div class="midesk-motion-captcha__head">
      <div>
        <p class="midesk-motion-captcha__title">{{ t('auth.captcha.title') }}</p>
        <p class="midesk-motion-captcha__hint">{{ t('auth.captcha.hint') }}</p>
      </div>
      <button
        type="button"
        class="midesk-motion-captcha__refresh"
        :disabled="loading || verifying"
        :aria-label="t('auth.captcha.refresh')"
        @click="loadChallenge"
      >
        <UIcon name="i-lucide-refresh-cw" class="size-4" :class="{ 'is-spinning': loading }" />
      </button>
    </div>

    <div v-if="loading" class="midesk-motion-captcha__loading">
      <USkeleton class="midesk-motion-captcha__skeleton rounded-2xl" />
    </div>

    <div v-else-if="challenge" class="midesk-motion-captcha__dial-wrap">
      <div
        ref="dialRef"
        class="midesk-motion-captcha__stage"
        @pointerdown="onDialPointerDown"
      >
        <div class="midesk-motion-captcha__mesh" aria-hidden="true" />
        <div class="midesk-motion-captcha__ring-glow" aria-hidden="true" />

        <svg
          class="midesk-motion-captcha__svg"
          :viewBox="`0 0 ${SIZE} ${SIZE}`"
          aria-hidden="true"
        >
          <defs>
            <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff7a29" />
              <stop offset="100%" stop-color="#ffb347" />
            </linearGradient>
            <filter :id="glowId">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            :cx="CX"
            :cy="CY"
            :r="ORBIT_R"
            class="midesk-motion-captcha__track"
          />

          <path
            :d="sectorPath(challenge.targetAngle, challenge.sectorSize)"
            class="midesk-motion-captcha__sector"
            :fill="`url(#${gradientId})`"
            :filter="`url(#${glowId})`"
          />

          <circle
            :cx="CX"
            :cy="CY"
            r="30"
            class="midesk-motion-captcha__core"
          />

          <g
            class="midesk-motion-captcha__handle"
            :transform="`translate(${handlePos.x} ${handlePos.y})`"
          >
            <circle r="12" class="midesk-motion-captcha__handle-halo" />
            <circle r="7" class="midesk-motion-captcha__handle-dot" />
          </g>
        </svg>

        <div class="midesk-motion-captcha__center" aria-hidden="true">
          <UIcon
            :name="verified ? 'i-lucide-unlock' : 'i-lucide-shield-check'"
            class="size-5"
          />
        </div>

        <div v-if="burst" class="midesk-motion-captcha__burst" aria-hidden="true">
          <span v-for="i in 12" :key="i" :style="{ '--i': i }" />
        </div>
      </div>

      <p class="midesk-motion-captcha__status">
        <template v-if="verified">{{ t('auth.captcha.success') }}</template>
        <template v-else-if="status === 'fail'">{{ t('auth.captcha.fail') }}</template>
        <template v-else-if="targetNear">{{ t('auth.captcha.near') }}</template>
        <template v-else>{{ t('auth.captcha.drag') }}</template>
      </p>
    </div>

    <p v-else class="midesk-motion-captcha__error">
      {{ t('auth.captcha.loadError') }}
      <button type="button" class="midesk-motion-captcha__retry" @click="loadChallenge">
        {{ t('auth.captcha.refresh') }}
      </button>
    </p>
  </div>
</template>
