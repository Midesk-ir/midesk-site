<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number
}>(), {
  suffix: '',
  prefix: '',
  decimals: 0,
  duration: 1400
})

const root = ref<HTMLElement | null>(null)
const display = ref(0)
const started = ref(false)

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function animate() {
  const start = performance.now()
  const from = 0
  const to = props.value

  function tick(now: number) {
    const progress = Math.min((now - start) / props.duration, 1)
    const eased = easeOutCubic(progress)
    display.value = from + (to - from) * eased
    if (progress < 1) requestAnimationFrame(tick)
    else display.value = to
  }

  requestAnimationFrame(tick)
}

onMounted(() => {
  const el = root.value
  if (!el) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    display.value = props.value
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && !started.value) {
        started.value = true
        animate()
        observer.disconnect()
      }
    },
    { threshold: 0.35 }
  )

  observer.observe(el)
  onUnmounted(() => observer.disconnect())
})

const formatted = computed(() => {
  const n = props.decimals > 0
    ? display.value.toFixed(props.decimals)
    : Math.round(display.value).toString()
  return `${props.prefix}${n}${props.suffix}`
})
</script>

<template>
  <span ref="root" class="midesk-landing-count-up tabular-nums">{{ formatted }}</span>
</template>
