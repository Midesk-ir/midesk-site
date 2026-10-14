<script setup lang="ts">
import { useAppLoading } from '~/utils/app-loading'

const { isLoading, isRouteLoading } = useAppLoading()
const { t } = useI18n()

const visible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(isLoading, (loading) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  if (loading) {
    visible.value = true
    return
  }

  hideTimer = setTimeout(() => {
    visible.value = false
    hideTimer = null
  }, 180)
}, { immediate: true })

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="midesk-loading-root"
      :class="{ 'is-visible': visible }"
      :aria-busy="visible"
      :aria-hidden="!visible"
    >
      <div
        class="midesk-loading-bar"
        :class="{ 'is-route': isRouteLoading }"
        role="progressbar"
        :aria-label="t('common.loading')"
      >
        <span class="midesk-loading-bar__glow" />
        <span class="midesk-loading-bar__fill" />
      </div>

      <Transition name="midesk-loading-veil">
        <div
          v-if="visible && isRouteLoading"
          class="midesk-loading-veil"
          aria-hidden="true"
        />
      </Transition>
    </div>
  </Teleport>
</template>
