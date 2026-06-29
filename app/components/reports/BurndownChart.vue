<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { BurndownData } from '~/types/phase1'
import ReportChart from './ReportChart.vue'

const props = defineProps<{
  data: BurndownData | null
  loading?: boolean
}>()

const { t, locale } = useI18n()
const { formatDate } = useCalendar()
const { reportChartBase } = useReportChart()

const chart = computed(() => {
  void locale.value
  if (!props.data) return null

  const categories = props.data.daily.map(d => formatDate(d.date, 'MM/DD'))
  const actual = props.data.daily.map(d => d.remaining_points)
  const ideal = props.data.ideal_line.map(d => d.remaining_points)

  const options: ApexOptions = {
    ...reportChartBase('line'),
    colors: ['#6366f1', '#94a3b8'],
    stroke: { width: [3, 2], dashArray: [0, 6] },
    xaxis: {
      categories,
      labels: { style: { colors: '#888' } }
    },
    yaxis: {
      labels: { style: { colors: '#888' } },
      title: { text: t('sprint.points'), style: { color: '#888' } }
    }
  }

  const series = [
    { name: t('reports.remaining'), data: actual },
    { name: t('reports.ideal'), data: ideal }
  ]

  return { options, series }
})
</script>

<template>
  <div class="w-full min-w-0">
    <div v-if="loading" class="flex h-80 items-center justify-center">
      <USkeleton class="midesk-skeleton-card-lg h-full w-full" />
    </div>

    <UiEmptyState
      v-else-if="!data"
      :title="t('reports.emptyTitle')"
      :description="t('reports.emptyDesc')"
      icon="i-lucide-line-chart"
    />

    <ReportChart
      v-else-if="chart"
      :key="data.sprint.id"
      type="line"
      :options="chart.options"
      :series="chart.series"
    />
  </div>
</template>
