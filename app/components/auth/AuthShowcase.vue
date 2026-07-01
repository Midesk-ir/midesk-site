<script setup lang="ts">
const props = defineProps<{
  variant?: 'login' | 'register'
}>()

const { t } = useI18n()

const slideKeys = ['kanban', 'hr', 'collab', 'reports'] as const
const activeSlide = ref(0)

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slideKeys.length
  }, 4500)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const slideIcons: Record<typeof slideKeys[number], string> = {
  kanban: 'i-lucide-square-kanban',
  hr: 'i-lucide-users-round',
  collab: 'i-lucide-messages-square',
  reports: 'i-lucide-bar-chart-3'
}

const headline = computed(() =>
  props.variant === 'register' ? t('auth.showcase.registerTitle') : t('auth.showcase.loginTitle')
)

const subtitle = computed(() =>
  props.variant === 'register' ? t('auth.showcase.registerSubtitle') : t('auth.showcase.loginSubtitle')
)
</script>

<template>
  <aside class="midesk-auth-showcase" aria-hidden="true">
    <div class="midesk-auth-showcase-bg">
      <div class="midesk-auth-showcase-glow midesk-auth-showcase-glow--a" />
      <div class="midesk-auth-showcase-glow midesk-auth-showcase-glow--b" />
      <div class="midesk-auth-showcase-grid" />
    </div>

    <div class="midesk-auth-showcase-inner">
      <NuxtLink to="/" class="midesk-auth-showcase-logo">
        <AppLogo />
      </NuxtLink>

      <div class="midesk-auth-showcase-copy">
        <p class="midesk-auth-showcase-eyebrow">{{ t('auth.showcase.eyebrow') }}</p>
        <h2 class="midesk-auth-showcase-title">{{ headline }}</h2>
        <p class="midesk-auth-showcase-subtitle">{{ subtitle }}</p>
      </div>

      <div class="midesk-auth-showcase-slides">
        <Transition name="midesk-auth-slide" mode="out-in">
          <article
            :key="slideKeys[activeSlide]"
            class="midesk-auth-showcase-card"
          >
            <div class="midesk-auth-showcase-card-icon">
              <UIcon :name="slideIcons[slideKeys[activeSlide]!]" class="size-6" />
            </div>
            <h3>{{ t(`auth.showcase.slides.${slideKeys[activeSlide]}.title`) }}</h3>
            <p>{{ t(`auth.showcase.slides.${slideKeys[activeSlide]}.desc`) }}</p>
          </article>
        </Transition>

        <div class="midesk-auth-showcase-dots">
          <button
            v-for="(key, index) in slideKeys"
            :key="key"
            type="button"
            class="midesk-auth-showcase-dot"
            :class="{ 'is-active': activeSlide === index }"
            :aria-label="t(`auth.showcase.slides.${key}.title`)"
            @click="activeSlide = index"
          />
        </div>
      </div>

      <ul class="midesk-auth-showcase-stats">
        <li v-for="stat in ['modules', 'setup', 'free']" :key="stat">
          <strong>{{ t(`auth.showcase.stats.${stat}.value`) }}</strong>
          <span>{{ t(`auth.showcase.stats.${stat}.label`) }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>
