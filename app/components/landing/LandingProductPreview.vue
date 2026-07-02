<script setup lang="ts">
const { t } = useI18n()

const activeModule = ref(0)
const modules = ['kanban', 'crm', 'ai'] as const

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    activeModule.value = (activeModule.value + 1) % modules.length
  }, 4200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="midesk-landing-preview-wrap">
    <div class="midesk-landing-preview" aria-hidden="true">
      <div class="midesk-landing-preview-chrome">
        <div class="midesk-landing-preview-dots">
          <span /><span /><span />
        </div>
        <div class="midesk-landing-preview-tabs">
          <span
            v-for="(mod, i) in modules"
            :key="mod"
            class="midesk-landing-preview-tab"
            :class="{ 'is-active': activeModule === i }"
          >
            {{ t(`landing.previewModules.${mod}`) }}
          </span>
        </div>
      </div>

      <div class="midesk-landing-preview-body">
        <aside class="midesk-landing-preview-sidebar">
          <div class="midesk-landing-preview-logo" />
          <div class="midesk-landing-preview-nav">
            <div class="is-active" />
            <div /><div /><div /><div />
          </div>
        </aside>

        <div class="midesk-landing-preview-main">
          <div class="midesk-landing-preview-topbar">
            <div class="midesk-landing-preview-topbar-pill" />
            <div class="midesk-landing-preview-topbar-actions">
              <span /><span />
            </div>
          </div>

          <div class="midesk-landing-preview-stats">
            <div v-for="i in 3" :key="i" class="midesk-landing-preview-stat">
              <span class="midesk-landing-preview-stat-bar" />
              <span class="midesk-landing-preview-stat-val" />
            </div>
          </div>

          <Transition name="midesk-preview-module" mode="out-in">
            <div v-if="activeModule === 0" key="kanban" class="midesk-landing-preview-board">
              <div v-for="col in 4" :key="col" class="midesk-landing-preview-column">
                <div class="midesk-landing-preview-col-head" />
                <div class="midesk-landing-preview-card is-accent" />
                <div class="midesk-landing-preview-card" />
                <div v-if="col < 3" class="midesk-landing-preview-card is-short" />
              </div>
            </div>

            <div v-else-if="activeModule === 1" key="crm" class="midesk-landing-preview-crm">
              <div v-for="row in 4" :key="row" class="midesk-landing-preview-crm-row">
                <span class="midesk-landing-preview-crm-avatar" />
                <div class="midesk-landing-preview-crm-lines">
                  <span /><span />
                </div>
                <span class="midesk-landing-preview-crm-badge" :class="{ 'is-hot': row === 1 }" />
              </div>
            </div>

            <div v-else key="ai" class="midesk-landing-preview-ai">
              <div class="midesk-landing-preview-ai-msg is-user">
                <span />
              </div>
              <div class="midesk-landing-preview-ai-msg is-bot">
                <UIcon name="i-lucide-sparkles" class="size-3 text-violet-400" />
                <span /><span class="is-short" />
              </div>
              <div class="midesk-landing-preview-ai-input" />
            </div>
          </Transition>
        </div>
      </div>

      <div class="midesk-landing-preview-float midesk-landing-preview-float--chart">
        <UIcon name="i-lucide-line-chart" class="size-4 text-[var(--color-midesk-accent)]" />
        <span>{{ t('landing.previewLabels.burndown') }}</span>
      </div>

      <div class="midesk-landing-preview-float midesk-landing-preview-float--crm">
        <UIcon name="i-lucide-trending-up" class="size-3.5 text-emerald-400" />
        <span>+24%</span>
      </div>

      <div class="midesk-landing-preview-float midesk-landing-preview-float--ai">
        <UIcon name="i-lucide-sparkles" class="size-3.5 text-violet-400" />
        <span>{{ t('landing.previewLabels.ai') }}</span>
      </div>

      <div class="midesk-landing-preview-float midesk-landing-preview-float--notif">
        <UIcon name="i-lucide-bell" class="size-3.5" />
        <span>3</span>
      </div>
    </div>
  </div>
</template>
