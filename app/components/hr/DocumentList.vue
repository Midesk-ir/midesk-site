<script setup lang="ts">
import type { DocumentCategory, HrDocument } from '~/types/phase2'

defineProps<{
  documents: HrDocument[]
  loading?: boolean
}>()

const { t } = useI18n()
const { formatDate, formatRelative } = useCalendar()
const config = useRuntimeConfig()

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function downloadUrl(id: string) {
  return `${config.public.apiBase}/hr/documents/${id}/download`
}

const categoryIcon: Record<DocumentCategory, string> = {
  contract: 'i-lucide-file-text',
  id: 'i-lucide-id-card',
  certificate: 'i-lucide-award',
  other: 'i-lucide-file'
}
</script>

<template>
  <div class="overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-12" />
    </div>

    <UiEmptyState
      v-else-if="!documents.length"
      :title="t('hr.documents.emptyTitle')"
      :description="t('hr.documents.emptyDesc')"
      icon="i-lucide-folder"
    />

    <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
      <li
        v-for="doc in documents"
        :key="doc.id"
        class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-white/[0.02]"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
            <UIcon :name="categoryIcon[doc.category]" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <div class="min-w-0">
            <p class="truncate font-medium">{{ doc.filename }}</p>
            <p class="text-sm text-[var(--color-midesk-muted)]">
              {{ doc.user.name }}
              · {{ t(`hr.documents.category.${doc.category}`) }}
              · {{ formatSize(doc.size_bytes) }}
              · {{ formatRelative(doc.uploaded_at) }}
            </p>
          </div>
        </div>
        <UButton
          :to="downloadUrl(doc.id)"
          target="_blank"
          icon="i-lucide-download"
          size="sm"
          variant="soft"
          color="primary"
        >
          {{ t('hr.documents.download') }}
        </UButton>
      </li>
    </ul>
  </div>
</template>
