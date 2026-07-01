<script setup lang="ts">
import type { ProjectFile, ProjectFolder } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

const props = defineProps<{ projectId: string }>()

const { t } = useI18n()
const toast = useToast()

const loading = ref(true)
const folders = ref<ProjectFolder[]>([])
const files = ref<ProjectFile[]>([])
const currentFolderId = ref<string | null>(null)

const breadcrumbs = computed(() => {
  const crumbs: { id: string | null, name: string }[] = [{ id: null, name: t('files.root') }]
  if (!currentFolderId.value) return crumbs
  const folder = folders.value.find(f => f.id === currentFolderId.value)
  if (folder) crumbs.push({ id: folder.id, name: folder.name })
  return crumbs
})

async function load() {
  loading.value = true
  try {
    const qs = currentFolderId.value ? `?folder_id=${currentFolderId.value}` : ''
    const res = await storeApi<{ data: { folders: ProjectFolder[], files: ProjectFile[] } }>(
      `/projects/${props.projectId}/files${qs}`
    )
    folders.value = res.data.folders
    files.value = res.data.files
  } finally {
    loading.value = false
  }
}

async function onUpload(payload: { name: string, mime_type?: string, file_size?: number }) {
  await storeApi(`/projects/${props.projectId}/files`, {
    method: 'POST',
    body: { ...payload, folder_id: currentFolderId.value }
  })
  toast.add({ title: t('files.uploaded'), color: 'success' })
  await load()
}

async function onDelete(id: string) {
  await storeApi(`/projects/${props.projectId}/files/${id}`, { method: 'DELETE' })
  toast.add({ title: t('files.deleted'), color: 'success' })
  await load()
}

async function onNewVersion(id: string) {
  await storeApi(`/projects/${props.projectId}/files/${id}/new-version`, { method: 'POST' })
  toast.add({ title: t('files.newVersion'), color: 'success' })
  await load()
}

function openFolder(id: string | null) {
  currentFolderId.value = id
  load()
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <LayoutMideskPageHeader :title="t('files.title')" :subtitle="t('files.subtitle')" />

    <nav class="flex flex-wrap items-center gap-1 text-sm">
      <button
        v-for="(crumb, i) in breadcrumbs"
        :key="String(crumb.id)"
        type="button"
        class="text-[var(--color-midesk-accent)] hover:underline"
        @click="openFolder(crumb.id)"
      >
        {{ crumb.name }}<span v-if="i < breadcrumbs.length - 1" class="mx-1 text-[var(--color-midesk-muted)]">/</span>
      </button>
    </nav>

    <FilesFileUpload @upload="onUpload" />

    <FilesFileList
      :files="files"
      :folders="folders.filter(f => f.parent_id === currentFolderId)"
      :loading="loading"
      @open-folder="openFolder($event)"
      @delete="onDelete"
      @new-version="onNewVersion"
    />
  </div>
</template>
