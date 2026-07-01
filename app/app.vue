<script setup lang="ts">
import { resolveUiLocale } from '~/utils/ui-locale'

const { locale, locales } = useI18n()
const colorMode = useColorMode()

colorMode.preference = 'dark'

const dir = computed(() => {
  const current = locales.value.find(l => l.code === locale.value)
  return current?.dir ?? 'rtl'
})

const uiLocale = computed(() => resolveUiLocale(locale.value))

useHead({
  htmlAttrs: {
    lang: locale,
    dir
  }
})
</script>

<template>
  <UApp :locale="uiLocale" :toaster="{ position: dir === 'rtl' ? 'top-left' : 'top-right' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
