<script setup lang="ts">
const progress = ref(0)

function update() {
  const doc = document.documentElement
  const scrollTop = window.scrollY
  const height = doc.scrollHeight - doc.clientHeight
  progress.value = height > 0 ? Math.min(scrollTop / height, 1) : 0
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  update()
  window.addEventListener('scroll', update, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', update))
})
</script>

<template>
  <div
    class="midesk-landing-scroll-progress"
    role="presentation"
    :style="{ '--scroll-progress': progress }"
  />
</template>
