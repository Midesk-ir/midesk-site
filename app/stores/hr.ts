import { defineStore } from 'pinia'
import type {
  ClockStatus,
  CreatePersonnelPayload,
  HrDashboardSummary,
  HrSettings,
  Personnel,
  PersonnelDetail,
  PersonnelFilters
} from '~/types/phase2'
import { storeApi } from '~/utils/api-client'

export const useHrStore = defineStore('hr', () => {
  const personnel = ref<Personnel[]>([])
  const dashboard = ref<HrDashboardSummary | null>(null)
  const settings = ref<HrSettings | null>(null)
  const loading = ref(false)

  async function fetchPersonnel(filters: PersonnelFilters = {}) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.department) params.set('department', filters.department)
      if (filters.search) params.set('search', filters.search)
      const qs = params.toString()
      const res = await storeApi<{ data: Personnel[] }>(`/hr/personnel${qs ? `?${qs}` : ''}`)
      personnel.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchPersonnelDetail(id: string) {
    const res = await storeApi<{ data: PersonnelDetail }>(`/hr/personnel/${id}`)
    return res.data
  }

  async function createPersonnel(payload: CreatePersonnelPayload) {
    const res = await storeApi<{ data: Personnel }>('/hr/personnel', { method: 'POST', body: payload })
    personnel.value.unshift(res.data)
    return res.data
  }

  async function updatePersonnel(id: string, payload: Partial<CreatePersonnelPayload>) {
    const res = await storeApi<{ data: Personnel }>(`/hr/personnel/${id}`, { method: 'PATCH', body: payload })
    const idx = personnel.value.findIndex(p => p.id === id)
    if (idx >= 0) personnel.value[idx] = res.data
    return res.data
  }

  async function deletePersonnel(id: string) {
    await storeApi(`/hr/personnel/${id}`, { method: 'DELETE' })
    personnel.value = personnel.value.filter(p => p.id !== id)
  }

  async function fetchDashboard() {
    const res = await storeApi<{ data: HrDashboardSummary }>('/hr/dashboard')
    dashboard.value = res.data
    return res.data
  }

  async function fetchSettings() {
    const res = await storeApi<{ data: HrSettings }>('/hr/settings')
    settings.value = res.data
    return res.data
  }

  async function updateSettings(payload: Partial<HrSettings>) {
    const res = await storeApi<{ data: HrSettings }>('/hr/settings', { method: 'PATCH', body: payload })
    settings.value = res.data
    return res.data
  }

  return {
    personnel,
    dashboard,
    settings,
    loading,
    fetchPersonnel,
    fetchPersonnelDetail,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    fetchDashboard,
    fetchSettings,
    updateSettings
  }
})

export const useAttendanceStore = defineStore('attendance', () => {
  const todayRecord = ref<import('~/types/phase2').AttendanceRecord | null>(null)
  const clockStatus = ref<ClockStatus>('not_started')
  const todaySummary = ref<import('~/types/phase2').AttendanceTodaySummary | null>(null)
  const myHistory = ref<import('~/types/phase2').AttendanceRecord[]>([])
  const report = ref<import('~/types/phase2').AttendanceReportRow[]>([])
  const loading = ref(false)

  async function fetchToday() {
    const res = await storeApi<{ data: import('~/types/phase2').AttendanceTodaySummary }>('/hr/attendance/today')
    todaySummary.value = res.data
    return res.data
  }

  async function fetchMy(from?: string, to?: string) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      const qs = params.toString()
      const res = await storeApi<{
        data: {
          today: import('~/types/phase2').AttendanceRecord | null
          clock_status: ClockStatus
          history: import('~/types/phase2').AttendanceRecord[]
        }
      }>(`/hr/attendance/my${qs ? `?${qs}` : ''}`)
      todayRecord.value = res.data.today
      clockStatus.value = res.data.clock_status
      myHistory.value = res.data.history
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchReport(month: string) {
    const res = await storeApi<{ data: import('~/types/phase2').AttendanceReportRow[] }>(
      `/hr/attendance/report?month=${month}`
    )
    report.value = res.data
    return res.data
  }

  async function checkIn() {
    const res = await storeApi<{ data: { record: import('~/types/phase2').AttendanceRecord, clock_status: ClockStatus } }>(
      '/hr/attendance/check-in',
      { method: 'POST' }
    )
    todayRecord.value = res.data.record
    clockStatus.value = res.data.clock_status
  }

  async function checkOut() {
    const res = await storeApi<{ data: { record: import('~/types/phase2').AttendanceRecord, clock_status: ClockStatus } }>(
      '/hr/attendance/check-out',
      { method: 'POST' }
    )
    todayRecord.value = res.data.record
    clockStatus.value = res.data.clock_status
  }

  async function startBreak() {
    const res = await storeApi<{ data: { record: import('~/types/phase2').AttendanceRecord, clock_status: ClockStatus } }>(
      '/hr/attendance/break-start',
      { method: 'POST' }
    )
    todayRecord.value = res.data.record
    clockStatus.value = res.data.clock_status
  }

  async function endBreak() {
    const res = await storeApi<{ data: { record: import('~/types/phase2').AttendanceRecord, clock_status: ClockStatus } }>(
      '/hr/attendance/break-end',
      { method: 'POST' }
    )
    todayRecord.value = res.data.record
    clockStatus.value = res.data.clock_status
  }

  return {
    todayRecord,
    clockStatus,
    todaySummary,
    myHistory,
    report,
    loading,
    fetchToday,
    fetchMy,
    fetchReport,
    checkIn,
    checkOut,
    startBreak,
    endBreak
  }
})

export const useRecruitmentStore = defineStore('recruitment', () => {
  const requisitions = ref<import('~/types/phase2').Requisition[]>([])
  const candidates = ref<import('~/types/phase2').Candidate[]>([])
  const loading = ref(false)

  async function fetchRequisitions() {
    loading.value = true
    try {
      const res = await storeApi<{ data: import('~/types/phase2').Requisition[] }>('/hr/requisitions')
      requisitions.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchCandidates(requisitionId?: string) {
    const qs = requisitionId ? `?requisition_id=${requisitionId}` : ''
    const res = await storeApi<{ data: import('~/types/phase2').Candidate[] }>(`/hr/candidates${qs}`)
    candidates.value = res.data
    return res.data
  }

  async function createRequisition(payload: import('~/types/phase2').CreateRequisitionPayload) {
    const res = await storeApi<{ data: import('~/types/phase2').Requisition }>('/hr/requisitions', {
      method: 'POST',
      body: payload
    })
    requisitions.value.unshift(res.data)
    return res.data
  }

  async function moveCandidateStatus(id: string, status: import('~/types/phase2').CandidateStatus) {
    const res = await storeApi<{ data: import('~/types/phase2').Candidate }>(
      `/hr/candidates/${id}/status`,
      { method: 'PATCH', body: { status } }
    )
    const idx = candidates.value.findIndex(c => c.id === id)
    if (idx >= 0) candidates.value[idx] = res.data
    return res.data
  }

  async function hire(candidateId: string) {
    const res = await storeApi<{ data: { candidate: import('~/types/phase2').Candidate } }>(
      `/hr/candidates/${candidateId}/hire`,
      { method: 'POST' }
    )
    const idx = candidates.value.findIndex(c => c.id === candidateId)
    if (idx >= 0) candidates.value[idx] = res.data.candidate
    return res.data
  }

  async function scheduleInterview(payload: {
    candidate_id: string
    interviewer_id: string
    scheduled_at: string
    type: import('~/types/phase2').InterviewType
  }) {
    return storeApi('/hr/interviews', { method: 'POST', body: payload })
  }

  async function submitFeedback(interviewId: string, score: number, feedback: string) {
    return storeApi(`/hr/interviews/${interviewId}`, {
      method: 'PATCH',
      body: { score, feedback, status: 'completed' }
    })
  }

  return {
    requisitions,
    candidates,
    loading,
    fetchRequisitions,
    fetchCandidates,
    createRequisition,
    moveCandidateStatus,
    hire,
    scheduleInterview,
    submitFeedback
  }
})
