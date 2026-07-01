<script setup lang="ts">
import type { SurveyReportItem } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const route = useRoute()
const { t } = useI18n()
const report = ref<SurveyReportItem[]>([])

onMounted(async () => {
  report.value = (await storeApi<{ data: SurveyReportItem[] }>(`/surveys/${route.params.id}/report`)).data
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('surveys.report')" />
    <SurveyReport :items="report" />
  </div>
</template>
