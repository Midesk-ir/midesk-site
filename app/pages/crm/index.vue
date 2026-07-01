<script setup lang="ts">
import type { CrmDashboard } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const dashboard = ref<CrmDashboard | null>(null)
const loading = ref(true)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await storeApi<{ data: CrmDashboard }>('/crm/dashboard')
    dashboard.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('nav.crm')" :subtitle="t('crm.dashboardSubtitle')" />

    <CrmSubNav />

    <div class="mt-6">
      <UiEmptyState
        v-if="error"
        :title="t('common.error')"
        icon="i-lucide-alert-circle"
      >
        <template #action>
          <UButton variant="outline" @click="load">{{ t('common.retry') }}</UButton>
        </template>
      </UiEmptyState>
      <CrmDashboard v-else :dashboard="dashboard" :loading="loading" />
    </div>
  </div>
</template>
