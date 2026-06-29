<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { VelocityReport } from '~/types/phase1'
import ReportChart from './ReportChart.vue'

const props = defineProps<{
  data: VelocityReport | null
  loading?: boolean
}>()

const { t, locale } = useI18n()
const { reportChartBase } = useReportChart()

const chart = computed(() => {
  void locale.value
  if (!props.data?.sprints.length) return null

  const categories = props.data.sprints.map(s => s.sprint_name)
  const committed = props.data.sprints.map(s => s.committed_points)
  const completed = props.data.sprints.map(s => s.completed_points)
  const avgLine = props.data.sprints.map(() => props.data!.average_completed)

  const options: ApexOptions = {
    ...reportChartBase('line'),
    colors: ['#6366f1', '#10b981', '#f59e0b'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '55%'
      }
    },
    stroke: { width: [0, 0, 2], dashArray: [0, 0, 4] },
    xaxis: {
      categories,
      labels: { style: { colors: '#888' }, rotate: -30 }
    },
    yaxis: {
      labels: { style: { colors: '#888' } },
      title: { text: t('sprint.points'), style: { color: '#888' } }
    }
  }

  const series = [
    { name: t('reports.committed'), type: 'column', data: committed },
    { name: t('reports.completed'), type: 'column', data: completed },
    { name: t('reports.average'), type: 'line', data: avgLine }
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
      v-else-if="!data?.sprints.length"
      :title="t('reports.emptyTitle')"
      :description="t('reports.emptyDesc')"
      icon="i-lucide-bar-chart-3"
    />

    <ReportChart
      v-else-if="chart"
      key="velocity"
      type="line"
      :options="chart.options"
      :series="chart.series"
    />
  </div>
</template>
