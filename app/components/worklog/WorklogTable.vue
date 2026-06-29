<script setup lang="ts">
import type { Worklog } from '~/types/phase1'

defineProps<{
  worklogs: Worklog[]
  loading?: boolean
  showMember?: boolean
}>()

const emit = defineEmits<{
  edit: [worklog: Worklog]
  delete: [id: string]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}
</script>

<template>
  <div class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 4" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!worklogs.length"
      :title="t('worklog.table.emptyTitle')"
      :description="t('worklog.table.emptyDesc')"
      icon="i-lucide-clock"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[40rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th v-if="showMember" class="px-4 py-3 text-start font-medium">
              {{ t('worklog.team.member') }}
            </th>
            <th class="px-4 py-3 text-start font-medium">{{ t('worklog.table.date') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('worklog.table.project') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('worklog.table.task') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('worklog.table.duration') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('worklog.table.description') }}</th>
            <th v-if="!showMember" class="px-4 py-3 text-end font-medium" />
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-midesk-border)]">
          <tr
            v-for="entry in worklogs"
            :key="entry.id"
            class="transition hover:bg-white/[0.02]"
          >
            <td v-if="showMember" class="px-4 py-3">
              <div class="flex items-center gap-2">
                <UAvatar :alt="entry.user.name" size="xs" icon="i-lucide-user" />
                <span>{{ entry.user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(entry.logged_date) }}</td>
            <td class="px-4 py-3">{{ entry.project_name ?? '—' }}</td>
            <td class="px-4 py-3 text-[var(--color-midesk-muted)]">
              {{ entry.task_title ?? '—' }}
            </td>
            <td class="px-4 py-3 font-medium">{{ formatDuration(entry.duration_minutes) }}</td>
            <td class="max-w-xs truncate px-4 py-3 text-[var(--color-midesk-muted)]">
              {{ entry.description ?? '—' }}
            </td>
            <td v-if="!showMember" class="px-4 py-3">
              <div class="flex justify-end gap-1">
                <UButton
                  icon="i-lucide-pencil"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  @click="emit('edit', entry)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  size="xs"
                  variant="ghost"
                  color="error"
                  @click="emit('delete', entry.id)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
