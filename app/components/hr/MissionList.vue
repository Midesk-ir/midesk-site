<script setup lang="ts">
import type { Mission, MissionStatus } from '~/types/phase2'

defineProps<{
  missions: Mission[]
  loading?: boolean
}>()

const emit = defineEmits<{
  approve: [id: string]
  reject: [id: string]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { can } = usePermissions()

const canApprove = computed(() => can('hr:missions:approve'))

const statusColor: Record<MissionStatus, 'warning' | 'success' | 'error' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  completed: 'info'
}
</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-12" />
    </div>

    <UiEmptyState
      v-else-if="!missions.length"
      :title="t('hr.missions.emptyTitle')"
      :description="t('hr.missions.emptyDesc')"
      icon="i-lucide-map-pin"
    />

    <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
      <li
        v-for="mission in missions"
        :key="mission.id"
        class="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
      >
        <div class="min-w-0">
          <p class="font-medium">{{ mission.destination }}</p>
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ mission.user.name }}
            · {{ formatDate(mission.start_date) }} – {{ formatDate(mission.end_date) }}
          </p>
          <p v-if="mission.description" class="mt-1 truncate text-sm text-[var(--color-midesk-muted)]">
            {{ mission.description }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UBadge :color="statusColor[mission.status]" variant="subtle">
            {{ t(`hr.missions.status.${mission.status}`) }}
          </UBadge>

          <template v-if="canApprove && mission.status === 'pending'">
            <UButton
              size="xs"
              color="success"
              variant="soft"
              icon="i-lucide-check"
              @click="emit('approve', mission.id)"
            >
              {{ t('leave.approve') }}
            </UButton>
            <UButton
              size="xs"
              color="error"
              variant="soft"
              icon="i-lucide-x"
              @click="emit('reject', mission.id)"
            >
              {{ t('leave.reject') }}
            </UButton>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>
