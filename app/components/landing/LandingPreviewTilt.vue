<script setup lang="ts">
const props = defineProps<{
  style?: Record<string, string>
}>()
</script>

<template>
  <div class="midesk-landing-preview-wrap">
    <div class="midesk-landing-preview-tilt" :style="props.style">
      <slot />
    </div>
  </div>
</template>
