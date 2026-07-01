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
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    await hrStore.fetchSettings()
  } catch {
    error.value = true
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
    <LayoutMideskPageHeader :title="t('nav.hr.settings')" />

    <USkeleton v-if="loading" class="midesk-skeleton-card h-80" />

    <UiEmptyState
      v-else-if="error"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton color="primary" @click="load">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <HrSettingsForm
      v-else
      :initial="hrStore.settings"
      @submit="onSubmit"
    />
  </div>
</template>
