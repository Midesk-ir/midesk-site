<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const { t } = useI18n()

const mobileNavOpen = ref(false)

const localeOptions = computed(() =>
  locales.value.map(l => ({ label: l.name, value: l.code }))
)

const navLinks = computed(() => [
  { label: t('landing.nav.features'), to: '#features' },
  { label: t('landing.nav.sections'), to: '#sections' },
  { label: t('landing.nav.howItWorks'), to: '#how-it-works' },
  { label: t('landing.nav.pricing'), to: '#pricing' },
  { label: t('landing.nav.faq'), to: '#faq' }
])

function closeMobileNav() {
  mobileNavOpen.value = false
}
</script>

<template>
  <div class="midesk-app-shell min-h-screen">
    <header class="midesk-marketing-header">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <NuxtLink to="/" class="shrink-0 transition-opacity hover:opacity-80">
          <AppLogo />
        </NuxtLink>

        <nav class="midesk-marketing-nav hidden items-center gap-1 lg:flex" :aria-label="t('landing.nav.ariaLabel')">
          <a
            v-for="link in navLinks"
            :key="link.to"
            :href="link.to"
            class="midesk-marketing-nav-link midesk-landing-line-link"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="flex items-center gap-1.5 sm:gap-2">
          <USelect
            :model-value="locale"
            :items="localeOptions"
            size="sm"
            class="w-24 shrink-0 sm:w-28"
            @update:model-value="setLocale($event as 'fa' | 'en')"
          />

          <UButton
            to="/login"
            variant="ghost"
            color="neutral"
            size="sm"
            class="hidden text-[var(--color-midesk-muted)] sm:inline-flex"
          >
            {{ t('landing.login') }}
          </UButton>

          <UButton
            to="/login"
            icon="i-lucide-log-in"
            variant="ghost"
            color="neutral"
            size="sm"
            class="sm:hidden"
            :aria-label="t('landing.login')"
          />

          <UButton to="/register" color="primary" size="sm" class="shrink-0">
            <span class="hidden sm:inline">{{ t('landing.getStarted') }}</span>
            <span class="sm:hidden">{{ t('landing.getStartedShort') }}</span>
          </UButton>

          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            size="sm"
            class="lg:hidden"
            :aria-label="t('landing.nav.mobileMenu')"
            :aria-expanded="mobileNavOpen"
            @click="mobileNavOpen = !mobileNavOpen"
          />
        </div>
      </div>

      <Transition name="midesk-mobile-nav">
        <nav
          v-if="mobileNavOpen"
          class="midesk-marketing-mobile-nav lg:hidden"
          :aria-label="t('landing.nav.ariaLabel')"
        >
          <a
            v-for="link in navLinks"
            :key="link.to"
            :href="link.to"
            class="midesk-marketing-mobile-nav-link"
            @click="closeMobileNav"
          >
            {{ link.label }}
          </a>
          <div class="midesk-marketing-mobile-nav-actions">
            <UButton to="/login" variant="outline" color="neutral" block @click="closeMobileNav">
              {{ t('landing.login') }}
            </UButton>
            <UButton to="/register" color="primary" block @click="closeMobileNav">
              {{ t('landing.getStarted') }}
            </UButton>
          </div>
        </nav>
      </Transition>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
