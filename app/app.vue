<script setup lang="ts">
import { resolveUiLocale } from '~/utils/ui-locale'

const { locale, localeProperties } = useI18n()
const colorMode = useColorMode()

colorMode.preference = 'dark'

const dir = computed(() => localeProperties.value.dir ?? 'rtl')

const uiLocale = computed(() => resolveUiLocale(locale.value))

useHead({
  htmlAttrs: {
    lang: locale,
    dir
  }
})
</script>

<template>
  <UApp
    :locale="uiLocale"
    :dir="dir"
    :toaster="{ position: dir === 'rtl' ? 'top-left' : 'top-right' }"
  >
    <MideskLoadingBar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
