<script setup lang="ts">
import type { CustomReport } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const reports = ref<CustomReport[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await storeApi<{ data: CustomReport[] }>('/reports')
  reports.value = res.data
  loading.value = false
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('nav.reportBuilder')" :subtitle="t('reports.pageSubtitle')">
      <template #actions>
        <LayoutMideskPageHeaderButton to="/reports/new" variant="primary" icon="i-lucide-plus">
          {{ t('reports.create') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>
    <ReportsReportList :reports="reports" :loading="loading" />
  </div>
</template>
