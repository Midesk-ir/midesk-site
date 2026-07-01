<script setup lang="ts">
import type { CrmContact } from '~/types/phase5'

defineProps<{
  contacts: CrmContact[]
  loading?: boolean
}>()

const { t } = useI18n()

const typeColors = {
  lead: 'info',
  customer: 'success',
  partner: 'primary',
  vendor: 'warning'
} as const
</script>

<template>
  <div v-if="loading" class="space-y-2">
    <USkeleton v-for="i in 5" :key="i" class="midesk-skeleton-card h-14" />
  </div>

  <UiEmptyState
    v-else-if="!contacts.length"
    :title="t('crm.emptyContactsTitle')"
    :description="t('crm.emptyContactsDesc')"
    icon="i-lucide-users"
  />

  <div v-else class="midesk-card overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
          <th class="px-4 py-3 text-start">{{ t('crm.fields.name') }}</th>
          <th class="px-4 py-3 text-start">{{ t('crm.fields.company') }}</th>
          <th class="px-4 py-3 text-start">{{ t('crm.fields.type') }}</th>
          <th class="px-4 py-3 text-start">{{ t('crm.fields.assignedTo') }}</th>
          <th class="px-4 py-3 text-end">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in contacts"
          :key="c.id"
          class="border-b border-[var(--color-midesk-border)] transition hover:bg-white/[0.03]"
        >
          <td class="px-4 py-3">
            <p class="font-medium">{{ c.name }}</p>
            <p v-if="c.email" class="text-xs text-[var(--color-midesk-muted)]">{{ c.email }}</p>
          </td>
          <td class="px-4 py-3">{{ c.company ?? '—' }}</td>
          <td class="px-4 py-3">
            <UBadge :color="typeColors[c.type]" size="xs" variant="subtle">
              {{ t(`crm.types.${c.type}`) }}
            </UBadge>
          </td>
          <td class="px-4 py-3">{{ c.assigned_to?.name ?? '—' }}</td>
          <td class="px-4 py-3 text-end">
            <UButton :to="`/crm/contacts/${c.id}`" size="xs" variant="outline">
              {{ t('common.view') }}
            </UButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
