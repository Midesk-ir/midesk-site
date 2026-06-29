<script setup lang="ts">
const { locale, locales } = useI18n()
const tenantStore = useTenantStore()
const colorMode = useColorMode()

colorMode.preference = 'dark'

const dir = computed(() => {
  const current = locales.value.find(l => l.code === locale.value)
  return current?.dir ?? 'rtl'
})

useHead({
  htmlAttrs: {
    lang: locale,
    dir
  }
})

onMounted(() => {
  if (tenantStore.tenant?.locale) {
    locale.value = tenantStore.tenant.locale.startsWith('fa') ? 'fa' : 'en'
  }
})
</script>

<template>
  <UApp :toaster="{ position: dir === 'rtl' ? 'top-left' : 'top-right' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
