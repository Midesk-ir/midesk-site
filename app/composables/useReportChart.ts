import type { ApexOptions } from 'apexcharts'

type ChartType = NonNullable<ApexOptions['chart']>['type']

/** Base Apex options shared by report charts (dark theme). */
export function useReportChart() {
  const { ld } = useLocaleDigits()

  function reportChartBase(type: ChartType = 'line'): ApexOptions {
    return {
      chart: {
        type,
        background: 'transparent',
        toolbar: { show: false },
        fontFamily: 'inherit',
        animations: { enabled: true }
      },
      theme: { mode: 'dark' },
      grid: { borderColor: 'rgba(255,255,255,0.08)' },
      legend: { labels: { colors: '#ccc' } },
      tooltip: {
        theme: 'dark',
        y: { formatter: val => ld(val) },
        x: { formatter: val => ld(val) }
      },
      yaxis: {
        labels: { formatter: val => ld(val) }
      },
      xaxis: {
        labels: { formatter: val => ld(val) }
      }
    }
  }

  return { reportChartBase, ld }
}
