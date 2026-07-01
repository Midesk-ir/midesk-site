<script setup lang="ts">
import type { SaFinancialStats } from '~/types/phase5'

definePageMeta({ layout: 'super-admin', middleware: ['super-admin'] })

const { t } = useI18n()
const saStore = useSuperAdminStore()

const stats = ref<SaFinancialStats | null>(null)
const loading = ref(true)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await saStore.api<{ data: SaFinancialStats }>('/super-admin/financial')
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
      :title="t('superAdmin.financial.title')"
      :subtitle="t('superAdmin.financial.subtitle')"
    />

    <div class="mt-6">
      <SuperAdminSaFinancialDashboard
        :stats="stats"
        :loading="loading"
        :error="error"
        @retry="load"
      />
    </div>
  </div>
</template>
