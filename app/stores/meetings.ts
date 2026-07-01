import { defineStore } from 'pinia'
import type { CreateMeetingPayload, Meeting } from '~/types/phase4'
import { storeApi } from '~/utils/api-client'

export const useMeetingsStore = defineStore('meetings', () => {
  const meetings = ref<Meeting[]>([])
  const loading = ref(false)

  async function fetchMeetings(filter?: 'today' | 'upcoming' | 'past') {
    loading.value = true
    try {
      const qs = filter ? `?filter=${filter}` : ''
      const res = await storeApi<{ data: Meeting[] }>(`/meetings${qs}`)
      meetings.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchToday() {
    const res = await storeApi<{ data: Meeting[] }>('/meetings/today')
    return res.data
  }

  async function fetchMeeting(id: string) {
    const res = await storeApi<{ data: Meeting }>(`/meetings/${id}`)
    return res.data
  }

  async function createMeeting(payload: CreateMeetingPayload) {
    const res = await storeApi<{ data: Meeting }>('/meetings', { method: 'POST', body: payload })
    meetings.value.unshift(res.data)
    return res.data
  }

  async function startMeeting(id: string) {
    const res = await storeApi<{ data: Meeting }>(`/meetings/${id}/start`, { method: 'POST' })
    const idx = meetings.value.findIndex(m => m.id === id)
    if (idx >= 0) meetings.value[idx] = res.data
    return res.data
  }

  return { meetings, loading, fetchMeetings, fetchToday, fetchMeeting, createMeeting, startMeeting }
})
