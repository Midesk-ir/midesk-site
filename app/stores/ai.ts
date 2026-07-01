import { defineStore } from 'pinia'
import type { AiQueryPayload, AiRequest } from '~/types/phase4'
import { storeApi } from '~/utils/api-client'

export const useAiStore = defineStore('ai', () => {
  const requests = ref<AiRequest[]>([])
  const loading = ref(false)

  async function fetchRequests() {
    loading.value = true
    try {
      const res = await storeApi<{ data: AiRequest[] }>('/ai/requests')
      requests.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function submitQuery(payload: AiQueryPayload) {
    const res = await storeApi<{ data: AiRequest }>('/ai/query', { method: 'POST', body: payload })
    requests.value.unshift(res.data)
    return res.data
  }

  async function fetchRequest(id: string) {
    const res = await storeApi<{ data: AiRequest }>(`/ai/requests/${id}`)
    const idx = requests.value.findIndex(r => r.id === id)
    if (idx >= 0) requests.value[idx] = res.data
    else requests.value.unshift(res.data)
    return res.data
  }

  async function completeRequest(id: string) {
    const res = await storeApi<{ data: AiRequest }>(`/ai/requests/${id}/complete`, { method: 'POST' })
    const idx = requests.value.findIndex(r => r.id === id)
    if (idx >= 0) requests.value[idx] = res.data
    return res.data
  }

  return { requests, loading, fetchRequests, submitQuery, fetchRequest, completeRequest }
})
