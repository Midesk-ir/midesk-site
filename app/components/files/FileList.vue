<script setup lang="ts">
import type { ProjectFile, ProjectFolder } from '~/types/phase5'

defineProps<{
  files: ProjectFile[]
  folders: ProjectFolder[]
  loading?: boolean
}>()

const emit = defineEmits<{
  openFolder: [id: string]
  delete: [id: string]
  newVersion: [id: string]
}>()

const { t } = useI18n()

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <div class="midesk-card overflow-hidden">
    <div v-if="loading" class="p-6">
      <USkeleton class="h-32 w-full" />
    </div>
    <div v-else-if="!files.length && !folders.length" class="p-8 text-center text-sm text-[var(--color-midesk-muted)]">
      {{ t('files.empty') }}
    </div>
    <table v-else class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
          <th class="px-4 py-3 text-start">{{ t('files.name') }}</th>
          <th class="px-4 py-3 text-start">{{ t('files.size') }}</th>
          <th class="px-4 py-3 text-start">{{ t('files.version') }}</th>
          <th class="px-4 py-3 text-start">{{ t('files.uploadedBy') }}</th>
          <th class="px-4 py-3 text-end">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="folder in folders"
          :key="folder.id"
          class="cursor-pointer border-b border-[var(--color-midesk-border)] hover:bg-white/[0.04]"
          @click="emit('openFolder', folder.id)"
        >
          <td class="px-4 py-3">
            <UIcon name="i-lucide-folder" class="me-2 inline size-4 text-amber-400" />
            {{ folder.name }}
          </td>
          <td colspan="4" />
        </tr>
        <tr v-for="file in files" :key="file.id" class="border-b border-[var(--color-midesk-border)]">
          <td class="px-4 py-3">
            <UIcon name="i-lucide-file" class="me-2 inline size-4" />
            {{ file.name }}
          </td>
          <td class="px-4 py-3">{{ formatSize(file.file_size) }}</td>
          <td class="px-4 py-3">v{{ file.version }}</td>
          <td class="px-4 py-3">{{ file.uploaded_by.name }}</td>
          <td class="px-4 py-3 text-end">
            <UButton size="xs" variant="ghost" icon="i-lucide-upload" @click="emit('newVersion', file.id)" />
            <UButton size="xs" variant="ghost" color="error" icon="i-lucide-trash-2" @click="emit('delete', file.id)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
