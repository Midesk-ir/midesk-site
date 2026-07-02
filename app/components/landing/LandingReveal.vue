<script setup lang="ts">
const props = withDefaults(defineProps<{
  delay?: number
}>(), {
  delay: 0
})

const root = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  const el = root.value
  if (!el) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    visible.value = true
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  )

  observer.observe(el)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div
    ref="root"
    class="midesk-landing-reveal"
    :class="{ 'is-visible': visible }"
    :style="delay ? { transitionDelay: `${delay}ms` } : undefined"
  >
    <slot />
  </div>
</template>
