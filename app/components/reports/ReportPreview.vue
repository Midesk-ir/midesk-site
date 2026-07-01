<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { CustomReport, ReportChartType, ReportPreviewResult } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const props = defineProps<{
  report?: CustomReport
  preview?: ReportPreviewResult | null
  chartType?: ReportChartType
}>()

const { t, locale } = useI18n()
const { formatCurrency } = useCalendar()
const { formatNumber } = useLocaleDigits()
const { reportChartBase } = useReportChart()

const chartType = computed(() => props.chartType ?? props.report?.chart_type ?? 'table')
const previewData = ref<ReportPreviewResult | null>(props.preview ?? null)
const loading = ref(false)

const columnLabels: Record<string, string> = {
  title: 'finance.expenses.fields.description',
  amount: 'finance.expenses.columns.amount',
  date: 'finance.expenses.columns.date',
  category: 'finance.expenses.columns.category',
  status: 'finance.expenses.columns.status'
}

function labelForColumn(col: string) {
  const key = columnLabels[col]
  return key ? t(key) : col
}

function formatCell(col: string, value: string | number) {
  if (col === 'amount' && typeof value === 'number') {
    return formatCurrency(value, 'IRR')
  }
  return value
}

function formatAxisAmount(val: number) {
  if (val >= 1_000_000_000) {
    return `${formatNumber(val / 1_000_000_000, { maximumFractionDigits: 1 })}B`
  }
  if (val >= 1_000_000) {
    return `${formatNumber(val / 1_000_000, { maximumFractionDigits: 1 })}M`
  }
  if (val >= 1_000) {
    return `${formatNumber(val / 1_000, { maximumFractionDigits: 0 })}K`
  }
  return formatNumber(val)
}

async function loadPreview() {
  if (!props.report || props.preview) return
  loading.value = true
  try {
    const res = await storeApi<{ data: ReportPreviewResult }>('/reports/preview', {
      method: 'POST',
      body: props.report
    })
    previewData.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(loadPreview)
watch(() => props.preview, (v) => { if (v) previewData.value = v })

const data = computed(() => previewData.value)

const chartCategories = computed(() => {
  if (!data.value?.chart_data) return []
  return Object.keys(data.value.chart_data)
})

const chartValues = computed(() => {
  if (!data.value?.chart_data) return []
  return Object.values(data.value.chart_data)
})

const showChart = computed(() =>
  chartType.value !== 'table' && chartValues.value.length > 0
)

const apexType = computed<'bar' | 'line' | 'pie'>(() => {
  if (chartType.value === 'pie') return 'pie'
  if (chartType.value === 'line') return 'line'
  return 'bar'
})

const chartOptions = computed<ApexOptions>(() => {
  void locale.value
  const categories = chartCategories.value
  const type = apexType.value
  const base = reportChartBase(type)

  if (type === 'pie') {
    return {
      ...base,
      labels: categories,
      colors: ['#ff5c00', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      legend: { position: 'bottom', labels: { colors: '#ccc' } },
      dataLabels: { enabled: true },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (_val: number, opts?: { dataPointIndex?: number }) => {
            const raw = chartValues.value[opts?.dataPointIndex ?? 0] ?? 0
            return formatCurrency(raw, 'IRR')
          }
        }
      }
    }
  }

  return {
    ...base,
    colors: ['#ff5c00'],
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: '52%' }
    },
    stroke: type === 'line' ? { curve: 'smooth', width: 3 } : undefined,
    fill: type === 'line'
      ? { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 } }
      : undefined,
    xaxis: {
      categories,
      labels: { style: { colors: 'var(--color-midesk-muted)' } }
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--color-midesk-muted)' },
        formatter: (val: number) => formatAxisAmount(val)
      }
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => formatCurrency(val, 'IRR') }
    }
  }
})

const chartSeries = computed(() => {
  if (!chartValues.value.length) return []

  if (apexType.value === 'pie') {
    return chartValues.value
  }

  return [{
    name: t('finance.expenses.columns.amount'),
    data: chartValues.value
  }]
})
</script>

<template>
  <div v-if="loading" class="space-y-4">
    <USkeleton class="midesk-skeleton-card h-80" />
    <USkeleton class="midesk-skeleton-card h-48" />
  </div>

  <div v-else-if="data" class="space-y-4">
    <section v-if="showChart" class="midesk-card p-5">
      <h2 class="midesk-card-header mb-4">{{ t('reports.chartPreview') }}</h2>
      <div class="w-full min-w-0">
        <ClientOnly>
          <VueApexCharts
            :type="apexType"
            height="300"
            :options="chartOptions"
            :series="chartSeries"
          />
          <template #fallback>
            <USkeleton class="midesk-skeleton-card-lg h-[300px] w-full" />
          </template>
        </ClientOnly>
      </div>
    </section>

    <div class="midesk-card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th v-for="col in data.columns" :key="col" class="px-3 py-2 text-start font-medium">
              {{ labelForColumn(col) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in data.rows"
            :key="i"
            class="border-b border-[var(--color-midesk-border)] transition hover:bg-white/[0.03]"
          >
            <td v-for="col in data.columns" :key="col" class="px-3 py-2">
              <span :class="{ 'midesk-ltr-field': col === 'amount' || col === 'date' }">
                {{ formatCell(col, row[col]!) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
