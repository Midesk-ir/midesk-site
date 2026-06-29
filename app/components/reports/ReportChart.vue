<script setup lang="ts">
import ApexCharts from 'apexcharts'
import type { ApexOptions } from 'apexcharts'

const props = withDefaults(defineProps<{
  options: ApexOptions
  series: NonNullable<ApexOptions['series']>
  type?: NonNullable<ApexOptions['chart']>['type']
  height?: number | string
}>(), {
  height: 320
})

const container = ref<HTMLElement | null>(null)
let chart: ApexCharts | null = null
const { locale } = useI18n()

function buildConfig(): ApexOptions {
  return {
    ...props.options,
    chart: {
      ...props.options.chart,
      type: props.type ?? props.options.chart?.type ?? 'line',
      height: props.height,
      fontFamily: 'inherit'
    },
    series: JSON.parse(JSON.stringify(props.series))
  }
}

async function render() {
  if (!import.meta.client || !container.value) return

  const config = buildConfig()

  if (chart) {
    await chart.updateOptions(config, true, true)
    return
  }

  chart = new ApexCharts(container.value, config)
  await chart.render()
}

async function destroyChart() {
  if (chart) {
    await chart.destroy()
    chart = null
  }
}

watch(
  () => [props.options, props.series, props.type, props.height, locale.value],
  () => { render() },
  { deep: true }
)

onMounted(() => {
  render()
})

onBeforeUnmount(() => {
  destroyChart()
})
</script>

<template>
  <div
    ref="container"
    class="report-chart w-full min-w-0"
    :style="{ minHeight: typeof height === 'number' ? `${height}px` : height }"
  />
</template>
