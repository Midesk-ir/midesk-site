<script setup lang="ts">
import type { GuestAccess, GuestRole } from '~/types/phase5'

defineProps<{
  guests: GuestAccess[]
  loading?: boolean
}>()

defineEmits<{ revoke: [id: string] }>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const roleColor: Record<GuestRole, 'neutral' | 'info'> = {
  viewer: 'neutral',
  commenter: 'info'
}
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!guests.length"
      :title="t('guest.emptyTitle')"
      :description="t('guest.emptyDesc')"
      icon="i-lucide-user-plus"
    />

    <div v-else class="overflow-x-auto">
      <table class="midesk-table w-full min-w-[640px]">
        <thead>
          <tr>
            <th>{{ t('guest.columns.email') }}</th>
            <th>{{ t('guest.columns.name') }}</th>
            <th>{{ t('guest.columns.role') }}</th>
            <th>{{ t('guest.columns.projects') }}</th>
            <th>{{ t('guest.columns.expiresAt') }}</th>
            <th class="text-end">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in guests" :key="guest.id">
            <td class="midesk-ltr-field whitespace-nowrap text-[var(--color-midesk-text)]">{{ guest.email }}</td>
            <td class="text-[var(--color-midesk-text)]">{{ guest.name }}</td>
            <td>
              <UBadge :color="roleColor[guest.role]" variant="subtle" size="sm">
                {{ t(`guest.roles.${guest.role}`) }}
              </UBadge>
            </td>
            <td class="text-[var(--color-midesk-muted)]">{{ guest.project_ids.length }}</td>
            <td class="whitespace-nowrap text-[var(--color-midesk-muted)]">{{ formatDate(guest.expires_at) }}</td>
            <td class="text-end">
              <UButton
                size="xs"
                color="error"
                variant="soft"
                icon="i-lucide-user-x"
                @click="$emit('revoke', guest.id)"
              >
                {{ t('guest.revoke') }}
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
