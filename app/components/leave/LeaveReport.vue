<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { LeaveReportItem } from '~/types/phase2'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const { t } = useI18n()
const { api } = useApi()
const { formatDate } = useCalendar()

const loading = ref(true)
const error = ref(false)
const report = ref<LeaveReportItem[]>([])
const toast = useToast()

async function fetchReport() {
  loading.value = true
  error.value = false
  try {
    const res = await api<{ data: LeaveReportItem[] }>('/leave/report')
    report.value = res.data
  } catch {
    error.value = true
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchReport)

const chartSeries = computed(() => {
  if (!report.value.length) return [{ name: t('leave.report.totalDays'), data: [] as number[] }]
  return [{
    name: t('leave.report.totalDays'),
    data: report.value.map(r => r.total_days)
  }]
})

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
    background: 'transparent'
  },
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: '55%' }
  },
  colors: ['var(--color-midesk-accent)'],
  xaxis: {
    categories: report.value.map(r => r.user.name),
    labels: { style: { colors: 'var(--color-midesk-muted)' } }
  },
  yaxis: {
    labels: { style: { colors: 'var(--color-midesk-muted)' } },
    title: { text: t('leave.balance.days'), style: { color: 'var(--color-midesk-muted)' } }
  },
  grid: { borderColor: 'var(--color-midesk-border)' },
  dataLabels: { enabled: false },
  tooltip: { theme: 'dark' }
}))

function typeKeys(item: LeaveReportItem) {
  return Object.keys(item.by_type)
}

function monthKeys(item: LeaveReportItem) {
  return Object.keys(item.by_month).sort()
}

function exportCsv() {
  if (!report.value.length) return
  const header = [
    t('leave.report.columns.member'),
    t('leave.report.columns.total'),
    t('leave.report.columns.byType'),
    t('leave.report.columns.byMonth')
  ]
  const rows = report.value.map((item) => {
    const byType = typeKeys(item).map(k => `${k}:${item.by_type[k]}`).join('; ')
    const byMonth = monthKeys(item).map(m => `${m}:${item.by_month[m]}`).join('; ')
    return [item.user.name, String(item.total_days), byType, byMonth]
  })
  const csv = [header, ...rows]
    .map(cols => cols.map(col => `"${String(col).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'leave-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-5">
    <div class="midesk-page-header">
      <h2 class="midesk-page-title">{{ t('leave.report.title') }}</h2>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton
          v-if="report.length"
          variant="soft-primary"
          icon="i-lucide-download"
          @click="exportCsv"
        >
          {{ t('leave.report.export') }}
        </LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton
          variant="soft-neutral"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="fetchReport"
        >
          {{ t('common.retry') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <div v-if="loading" class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
      <USkeleton class="h-80" />
    </div>

    <UiEmptyState
      v-else-if="error"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton color="primary" @click="fetchReport">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <UiEmptyState
      v-else-if="!report.length"
      :title="t('leave.report.emptyTitle')"
      :description="t('leave.report.emptyDesc')"
      icon="i-lucide-bar-chart-3"
    />

    <template v-else>
      <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
        <ClientOnly>
          <VueApexCharts
            type="bar"
            height="320"
            :options="chartOptions"
            :series="chartSeries"
          />
        </ClientOnly>
      </div>

      <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[48rem] text-sm">
            <thead>
              <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
                <th class="px-4 py-3 text-start font-medium">{{ t('leave.report.columns.member') }}</th>
                <th class="px-4 py-3 text-start font-medium">{{ t('leave.report.columns.total') }}</th>
                <th class="px-4 py-3 text-start font-medium">{{ t('leave.report.columns.byType') }}</th>
                <th class="px-4 py-3 text-start font-medium">{{ t('leave.report.columns.byMonth') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-midesk-border)]">
              <tr
                v-for="item in report"
                :key="item.user.id"
                class="transition hover:bg-white/[0.02]"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <UAvatar :alt="item.user.name" size="xs" icon="i-lucide-user" />
                    <span>{{ item.user.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 font-medium">
                  {{ item.total_days }} {{ t('leave.balance.days') }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <UBadge
                      v-for="typeKey in typeKeys(item)"
                      :key="typeKey"
                      variant="subtle"
                      size="xs"
                    >
                      {{ typeKey }}: {{ item.by_type[typeKey] }}
                    </UBadge>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <UBadge
                      v-for="month in monthKeys(item)"
                      :key="month"
                      color="neutral"
                      variant="subtle"
                      size="xs"
                    >
                      {{ formatDate(month, 'YYYY/MM') }}: {{ item.by_month[month] }}
                    </UBadge>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
