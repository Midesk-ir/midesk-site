<script setup lang="ts">
import type { HrSettings } from '~/types/phase2'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'tenant', 'hr'],
  permission: 'hr:settings:manage'
})

const { t } = useI18n()
const toast = useToast()
const hrStore = useHrStore()

const loading = ref(true)

async function load() {
  loading.value = true
  try {
    await hrStore.fetchSettings()
  } finally {
    loading.value = false
  }
}

async function onSubmit(payload: Partial<HrSettings>) {
  try {
    await hrStore.updateSettings(payload)
    toast.add({ title: t('common.save'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <h1 class="midesk-page-title mb-6">{{ t('nav.hr.settings') }}</h1>

    <USkeleton v-if="loading" class="midesk-skeleton-card h-80" />

    <HrSettingsForm
      v-else
      :initial="hrStore.settings"
      @submit="onSubmit"
    />
  </div>
</template>
