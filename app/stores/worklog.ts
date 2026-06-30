import { defineStore } from 'pinia'
import type {
  CreateWorklogPayload,
  Worklog,
  WorklogFilters
} from '~/types/phase1'
import { storeApi } from '~/utils/api-client'

export interface WeekSummaryDay {
  date: string
  minutes: number
}

export const useWorklogStore = defineStore('worklog', () => {
  const myWorklogs = ref<Worklog[]>([])
  const weekSummary = ref<WeekSummaryDay[]>([])
  const teamWorklogs = ref<Worklog[]>([])
  const loading = ref(false)

  async function fetchMy(filters?: WorklogFilters) {
    loading.value = true
    try {
      const data = await storeApi<{ data: Worklog[] }>('/worklogs/my', {
        query: filters
      })
      myWorklogs.value = data.data
      return data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchWeekSummary() {
    const data = await storeApi<{ data: WeekSummaryDay[] }>('/worklogs/reports')
    weekSummary.value = data.data
    return data.data
  }

  async function log(payload: CreateWorklogPayload) {
    const data = await storeApi<{ data: Worklog }>('/worklogs', {
      method: 'POST',
      body: payload
    })
    myWorklogs.value.unshift(data.data)
    return data.data
  }

  async function update(id: string, payload: Partial<CreateWorklogPayload>) {
    const data = await storeApi<{ data: Worklog }>(`/worklogs/${id}`, {
      method: 'PATCH',
      body: payload
    })
    const idx = myWorklogs.value.findIndex(w => w.id === id)
    if (idx >= 0) myWorklogs.value[idx] = data.data
    return data.data
  }

  async function remove(id: string) {
    await storeApi(`/worklogs/${id}`, { method: 'DELETE' })
    myWorklogs.value = myWorklogs.value.filter(w => w.id !== id)
  }

  async function fetchTeam(filters?: WorklogFilters) {
    const data = await storeApi<{ data: Worklog[] }>('/worklogs/team', {
      query: filters
    })
    teamWorklogs.value = data.data
    return data.data
  }

  return {
    myWorklogs,
    weekSummary,
    teamWorklogs,
    loading,
    fetchMy,
    fetchWeekSummary,
    log,
    update,
    remove,
    fetchTeam
  }
})
