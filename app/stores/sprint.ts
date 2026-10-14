import { defineStore } from 'pinia'
import type { Task } from '~/types'
import type {
  CloseSprintPayload,
  CreateSprintPayload,
  Sprint
} from '~/types/phase1'
import { storeApi } from '~/utils/api-client'

function unwrapSprint(response: Sprint | { data: Sprint }): Sprint {
  if (
    response
    && typeof response === 'object'
    && 'data' in response
    && response.data
    && typeof response.data === 'object'
    && 'id' in response.data
  ) {
    return response.data
  }
  return response as Sprint
}

function unwrapSprintList(response: Sprint[] | { data: Sprint[] }): Sprint[] {
  if (Array.isArray(response)) return response
  if (response && typeof response === 'object' && Array.isArray(response.data)) {
    return response.data
  }
  return []
}

export const useSprintStore = defineStore('sprint', () => {
  const sprints = ref<Sprint[]>([])
  const activeSprint = ref<Sprint | null>(null)
  const backlog = ref<Task[]>([])
  const loading = ref(false)
  const projectId = ref<string | null>(null)

  async function fetchSprints(id: string) {
    projectId.value = id
    loading.value = true
    try {
      const data = await storeApi<Sprint[] | { data: Sprint[] }>(`/projects/${id}/sprints`)
      const list = unwrapSprintList(data)
      sprints.value = list
      activeSprint.value = list.find(s => s.status === 'active') ?? null
      return list
    } finally {
      loading.value = false
    }
  }

  async function fetchBacklog(id: string) {
    const data = await storeApi<{ data?: Task[], tasks?: Task[] }>(`/projects/${id}/backlog`)
    backlog.value = data.data ?? data.tasks ?? []
    return backlog.value
  }

  async function createSprint(id: string, payload: CreateSprintPayload) {
    const data = await storeApi<Sprint | { data: Sprint }>(`/projects/${id}/sprints`, {
      method: 'POST',
      body: payload
    })
    const sprint = unwrapSprint(data)
    sprints.value.push(sprint)
    return sprint
  }

  async function activate(id: string, sprintId: string) {
    const data = await storeApi<Sprint | { data: Sprint }>(
      `/projects/${id}/sprints/${sprintId}/activate`,
      { method: 'PATCH' }
    )
    const sprint = unwrapSprint(data)
    sprints.value = sprints.value.map(s => ({
      ...s,
      status: s.id === sprintId
        ? 'active'
        : s.status === 'active'
          ? 'planning'
          : s.status
    }))
    activeSprint.value = sprint
    return sprint
  }

  async function close(
    id: string,
    sprintId: string,
    payload: CloseSprintPayload
  ) {
    const data = await storeApi<Sprint | { data: Sprint }>(
      `/projects/${id}/sprints/${sprintId}/close`,
      { method: 'PATCH', body: payload }
    )
    const sprint = unwrapSprint(data)
    const idx = sprints.value.findIndex(s => s.id === sprintId)
    if (idx >= 0) sprints.value[idx] = sprint
    if (activeSprint.value?.id === sprintId) activeSprint.value = null
    return sprint
  }

  async function assignTask(taskId: string, sprintId: string | null) {
    const data = await storeApi<{ data: Task }>(`/tasks/${taskId}/sprint`, {
      method: 'PATCH',
      body: { sprint_id: sprintId }
    })
    backlog.value = backlog.value.filter(t => t.id !== taskId)
    if (sprintId === null) backlog.value.push(data.data)
    return data.data
  }

  return {
    sprints,
    activeSprint,
    backlog,
    loading,
    projectId,
    fetchSprints,
    fetchBacklog,
    createSprint,
    activate,
    close,
    assignTask
  }
})
