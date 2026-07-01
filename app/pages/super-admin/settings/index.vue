<script setup lang="ts">
import type { SaPlatformSettings } from '~/types/phase5'

definePageMeta({ layout: 'super-admin', middleware: ['super-admin'] })

const { t } = useI18n()
const toast = useToast()
const saStore = useSuperAdminStore()

const settings = ref<SaPlatformSettings | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await saStore.api<{ data: SaPlatformSettings }>('/super-admin/settings')
    settings.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function onSubmit(payload: Partial<SaPlatformSettings>) {
  saving.value = true
  try {
    const res = await saStore.api<{ data: SaPlatformSettings }>('/super-admin/settings', {
      method: 'PATCH',
      body: payload
    })
    settings.value = res.data
    toast.add({ title: t('superAdmin.settings.saved'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      :title="t('superAdmin.settings.title')"
      :subtitle="t('superAdmin.settings.subtitle')"
    />

    <div class="mt-6">
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

      <SuperAdminSaSettings
        v-else
        :initial="settings"
        :saving="saving"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>
