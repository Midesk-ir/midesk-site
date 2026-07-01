<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()
const { can } = usePermissions()

const loading = ref(true)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    if (can('finance:dashboard:view')) {
      await financeStore.fetchDashboard()
    }
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
      :title="t('finance.dashboard.title')"
      :subtitle="t('finance.dashboard.subtitle')"
    />

    <FinanceSubNav />

    <div class="mt-6">
      <FinanceDashboard
      :summary="financeStore.dashboard"
      :loading="loading"
      :error="error"
      @retry="load"
    />
    </div>
  </div>
</template>
