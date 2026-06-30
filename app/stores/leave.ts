import { defineStore } from 'pinia'
import type {
  CreateLeaveRequestPayload,
  LeaveBalance,
  LeaveRequest,
  LeaveType
} from '~/types/phase1'
import { storeApi } from '~/utils/api-client'

export const useLeaveStore = defineStore('leave', () => {
  const types = ref<LeaveType[]>([])
  const balances = ref<LeaveBalance[]>([])
  const myRequests = ref<LeaveRequest[]>([])
  const pendingApprovals = ref<LeaveRequest[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const [typesRes, balancesRes, myRes] = await Promise.all([
        storeApi<{ data: LeaveType[] }>('/leave/types'),
        storeApi<{ data: LeaveBalance[] }>('/leave/balance'),
        storeApi<{ data: LeaveRequest[] }>('/leave/requests/my')
      ])
      types.value = typesRes.data
      balances.value = balancesRes.data
      myRequests.value = myRes.data

      try {
        const pendingRes = await storeApi<{ data: LeaveRequest[] }>(
          '/leave/requests/pending'
        )
        pendingApprovals.value = pendingRes.data
      } catch {
        pendingApprovals.value = []
      }

      return {
        types: types.value,
        balances: balances.value,
        myRequests: myRequests.value,
        pendingApprovals: pendingApprovals.value
      }
    } finally {
      loading.value = false
    }
  }

  async function request(payload: CreateLeaveRequestPayload) {
    const data = await storeApi<{ data: LeaveRequest }>('/leave/requests', {
      method: 'POST',
      body: payload
    })
    myRequests.value.unshift(data.data)
    return data.data
  }

  async function approve(id: string) {
    const data = await storeApi<{ data: LeaveRequest }>(
      `/leave/requests/${id}/approve`,
      { method: 'PATCH' }
    )
    pendingApprovals.value = pendingApprovals.value.filter(r => r.id !== id)
    const idx = myRequests.value.findIndex(r => r.id === id)
    if (idx >= 0) myRequests.value[idx] = data.data
    return data.data
  }

  async function reject(id: string, reason: string) {
    const data = await storeApi<{ data: LeaveRequest }>(
      `/leave/requests/${id}/reject`,
      { method: 'PATCH', body: { reason } }
    )
    pendingApprovals.value = pendingApprovals.value.filter(r => r.id !== id)
    const idx = myRequests.value.findIndex(r => r.id === id)
    if (idx >= 0) myRequests.value[idx] = data.data
    return data.data
  }

  return {
    types,
    balances,
    myRequests,
    pendingApprovals,
    loading,
    fetchAll,
    request,
    approve,
    reject
  }
})
