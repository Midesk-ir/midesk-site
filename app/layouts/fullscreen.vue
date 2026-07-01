<template>
  <div class="midesk-fullscreen-layout">
    <slot />
  </div>
</template>

<style scoped>
.midesk-fullscreen-layout {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #000;
}
</style>
