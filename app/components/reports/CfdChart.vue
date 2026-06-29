<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { CfdReport } from '~/types/phase1'
import ReportChart from './ReportChart.vue'

const props = defineProps<{
  data: CfdReport | null
  loading?: boolean
}>()

const { t, locale } = useI18n()
const { formatDate } = useCalendar()
const { reportChartBase } = useReportChart()

const ACCENT_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444'
]

const chart = computed(() => {
  void locale.value
  if (!props.data?.daily.length) return null

  const slugs = Object.keys(props.data.column_names)
  const categories = props.data.daily.map(d => formatDate(d.date, 'MM/DD'))

  const series = slugs.map(slug => ({
    name: props.data!.column_names[slug] ?? slug,
    data: props.data!.daily.map(d => d.columns[slug] ?? 0)
  }))

  const options: ApexOptions = {
    ...reportChartBase('area'),
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: { show: false },
      fontFamily: 'inherit',
      stacked: true,
      animations: { enabled: true }
    },
    colors: ACCENT_COLORS.slice(0, slugs.length),
    stroke: { width: 1, curve: 'smooth' },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.55, opacityTo: 0.05 }
    },
    xaxis: {
      categories,
      labels: { style: { colors: '#888' } }
    },
    yaxis: {
      labels: { style: { colors: '#888' } },
      title: { text: t('sprint.tasks'), style: { color: '#888' } }
    }
  }

  return { options, series }
})
</script>

<template>
  <div class="w-full min-w-0">
    <div v-if="loading" class="flex h-80 items-center justify-center">
      <USkeleton class="midesk-skeleton-card-lg h-full w-full" />
    </div>

    <UiEmptyState
      v-else-if="!data?.daily.length"
      :title="t('reports.emptyTitle')"
      :description="t('reports.emptyDesc')"
      icon="i-lucide-area-chart"
    />

    <ReportChart
      v-else-if="chart"
      key="cfd"
      type="area"
      :options="chart.options"
      :series="chart.series"
    />
  </div>
</template>
