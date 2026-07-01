import type { Project, User } from '~/types'

interface TaskLabel {
  id: string
  name: string
  color: string
}

interface ProjectColumn {
  slug: string
  name: string
  color: string
}

const membersCache = ref<User[] | null>(null)
const labelsCache = ref<TaskLabel[] | null>(null)
const membersLoading = ref<Promise<User[]> | null>(null)
const labelsLoading = ref<Promise<TaskLabel[]> | null>(null)
const columnsCache = new Map<string, ProjectColumn[]>()
const projectCache = new Map<string, Project>()

export function useTaskModalMeta() {
  const { api } = useApi()

  async function loadMembers() {
    if (membersCache.value) return membersCache.value
    if (!membersLoading.value) {
      membersLoading.value = api<{ data: User[] }>('/members')
        .then((res) => {
          membersCache.value = res.data
          return res.data
        })
        .finally(() => {
          membersLoading.value = null
        })
    }
    return membersLoading.value
  }

  async function loadLabels() {
    if (labelsCache.value) return labelsCache.value
    if (!labelsLoading.value) {
      labelsLoading.value = api<{ data: TaskLabel[] }>('/tasks/labels/all')
        .then((res) => {
          labelsCache.value = res.data
          return res.data
        })
        .finally(() => {
          labelsLoading.value = null
        })
    }
    return labelsLoading.value
  }

  async function loadColumns(projectId: string) {
    const cached = columnsCache.get(projectId)
    if (cached) return cached

    const res = await api<{ data: ProjectColumn[] }>(`/projects/${projectId}/columns`)
    columnsCache.set(projectId, res.data)
    return res.data
  }

  async function loadProject(projectId: string) {
    const cached = projectCache.get(projectId)
    if (cached) return cached

    const project = await api<Project>(`/projects/${projectId}`)
    projectCache.set(projectId, project)
    return project
  }

  return {
    loadMembers,
    loadLabels,
    loadColumns,
    loadProject
  }
}
