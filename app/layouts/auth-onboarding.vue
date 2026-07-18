<template>
  <div class="midesk-onboarding-shell">
    <div class="midesk-onboarding-shell__inner">
      <div class="midesk-onboarding-shell__brand">
        <NuxtLink to="/" class="midesk-onboarding-shell__logo">
          <AppLogo class="h-10 w-auto" />
          <p class="midesk-onboarding-shell__tagline">
            {{ $t('app.tagline') }}
          </p>
        </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>
