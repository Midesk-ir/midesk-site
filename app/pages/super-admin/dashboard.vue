<script setup lang="ts">
import type { SaDashboardStats } from '~/types/phase5'

definePageMeta({ layout: 'super-admin', middleware: ['super-admin'] })

const { t } = useI18n()
const saStore = useSuperAdminStore()

const stats = ref<SaDashboardStats | null>(null)
const loading = ref(true)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await saStore.api<{ data: SaDashboardStats }>('/super-admin/dashboard')
    stats.value = res.data
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
    <LayoutMideskPageHeader
      :title="t('superAdmin.dashboard.title')"
      :subtitle="t('superAdmin.dashboard.subtitle')"
    />

    <div class="mt-6">
      <SuperAdminSaDashboard
        :stats="stats"
        :loading="loading"
        :error="error"
        @retry="load"
      />
    </div>
  </div>
</template>
