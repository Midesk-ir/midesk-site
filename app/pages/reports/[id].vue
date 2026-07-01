<script setup lang="ts">
import type { CustomReport } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const route = useRoute()
const { t } = useI18n()
const report = ref<CustomReport | null>(null)
const loading = ref(true)

onMounted(async () => {
  const res = await storeApi<{ data: CustomReport }>(`/reports/${route.params.id}`)
  report.value = res.data
  loading.value = false
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="report?.name ?? t('reports.view')" />
    <ReportsReportPreview v-if="report" :report="report" />
  </div>
</template>
