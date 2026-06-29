<template>
  <div class="midesk-app-shell flex min-h-screen items-center justify-center px-4 py-8">
    <div class="mx-auto w-full max-w-md">
      <div class="mb-8 flex flex-col items-center gap-3">
        <NuxtLink to="/" class="flex flex-col items-center gap-2">
          <AppLogo class="h-10 w-auto" />
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ $t('app.tagline') }}
          </p>
        </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>
