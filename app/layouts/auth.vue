<template>
  <div class="midesk-auth-shell">
    <AuthShowcase :variant="authVariant" class="midesk-auth-showcase-panel" />

    <div class="midesk-auth-form-panel">
      <div class="midesk-auth-form-top">
        <NuxtLink to="/" class="midesk-auth-mobile-logo lg:hidden">
          <AppLogo />
        </NuxtLink>
        <UButton
          to="/"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-home"
          class="midesk-auth-back-home"
        >
          {{ $t('auth.backHome') }}
        </UButton>
      </div>

      <div class="midesk-auth-form-wrap">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const authVariant = computed<'login' | 'register'>(() =>
  route.path.includes('register') ? 'register' : 'login'
)
</script>
