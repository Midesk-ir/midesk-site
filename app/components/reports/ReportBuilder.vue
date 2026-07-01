<script setup lang="ts">
import type { CreateReportPayload, CustomReport, DataSourceInfo, ReportChartType, ReportFilter, ReportPreviewResult } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const step = ref(1)
const sources = ref<DataSourceInfo[]>([])
const preview = ref<ReportPreviewResult | null>(null)
const saving = ref(false)

const form = reactive<CreateReportPayload>({
  name: '',
  data_source: '',
  columns: [],
  filters: [],
  chart_type: 'table'
})

onMounted(async () => {
  const res = await storeApi<{ data: DataSourceInfo[] }>('/reports/data-sources')
  sources.value = res.data
})

const selectedSource = computed(() => sources.value.find(s => s.id === form.data_source))

async function runPreview() {
  const res = await storeApi<{ data: ReportPreviewResult }>('/reports/preview', { method: 'POST', body: form })
  preview.value = res.data
  step.value = 5
}

async function save() {
  saving.value = true
  try {
    const res = await storeApi<{ data: CustomReport }>('/reports', { method: 'POST', body: form })
    toast.add({ title: t('reports.saved'), color: 'success' })
    await router.push(`/reports/${res.data.id}`)
  } finally {
    saving.value = false
  }
}

function addFilter() {
  if (!form.filters) form.filters = []
  form.filters.push({ field: selectedSource.value?.columns[0] ?? '', operator: 'eq', value: '' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex gap-2">
      <UBadge v-for="s in 5" :key="s" :color="step >= s ? 'primary' : 'neutral'">{{ s }}</UBadge>
    </div>

    <ReportsDataSourcePicker
      v-if="step === 1"
      :sources="sources"
      :model-value="form.data_source"
      @update:model-value="form.data_source = $event; step = 2"
    />

    <ReportsColumnSelector
      v-if="step === 2 && selectedSource"
      :columns="selectedSource.columns"
      :model-value="form.columns"
      @update:model-value="form.columns = $event"
      @next="step = 3"
      @back="step = 1"
    />

    <div v-if="step === 3" class="space-y-4">
      <ReportsFilterBuilder :filters="form.filters ?? []" :fields="selectedSource?.columns ?? []" @add="addFilter" />
      <div class="flex gap-2">
        <UButton variant="outline" @click="step = 2">{{ t('common.back') }}</UButton>
        <UButton color="primary" @click="step = 4">{{ t('common.next') }}</UButton>
      </div>
    </div>

    <ReportsChartTypePicker
      v-if="step === 4"
      :model-value="form.chart_type ?? 'table'"
      @update:model-value="form.chart_type = $event as ReportChartType"
      @next="runPreview"
      @back="step = 3"
    />

    <div v-if="step === 5" class="space-y-4">
      <MideskFormField :label="t('reports.name')" :model-value="form.name">
        <UInput v-model="form.name" />
      </MideskFormField>
      <ReportsReportPreview :preview="preview" :chart-type="form.chart_type ?? 'table'" />
      <UButton color="primary" :loading="saving" :disabled="!form.name" @click="save">
        {{ t('reports.save') }}
      </UButton>
    </div>
  </div>
</template>
