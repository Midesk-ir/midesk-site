<script setup lang="ts">
import type { Survey } from '~/types/phase5'

defineProps<{
  surveys: Survey[]
  loading?: boolean
}>()

const { t } = useI18n()

const statusColors = {
  draft: 'neutral',
  active: 'success',
  closed: 'warning'
} as const
</script>

<template>
  <div v-if="loading" class="space-y-2">
    <USkeleton v-for="i in 4" :key="i" class="midesk-skeleton-card h-14" />
  </div>

  <UiEmptyState
    v-else-if="!surveys.length"
    :title="t('surveys.emptyTitle')"
    :description="t('surveys.emptyDesc')"
    icon="i-lucide-clipboard-list"
  />

  <div v-else class="midesk-card overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
          <th class="px-4 py-3 text-start">{{ t('surveys.fields.title') }}</th>
          <th class="px-4 py-3 text-start">{{ t('surveys.fields.type') }}</th>
          <th class="px-4 py-3 text-start">{{ t('surveys.fields.status') }}</th>
          <th class="px-4 py-3 text-start">{{ t('surveys.fields.responses') }}</th>
          <th class="px-4 py-3 text-end">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="s in surveys"
          :key="s.id"
          class="border-b border-[var(--color-midesk-border)] transition hover:bg-white/[0.03]"
        >
          <td class="px-4 py-3 font-medium">{{ s.title }}</td>
          <td class="px-4 py-3">{{ t(`surveys.types.${s.type}`) }}</td>
          <td class="px-4 py-3">
            <UBadge :color="statusColors[s.status]" size="xs" variant="subtle">
              {{ t(`surveys.statuses.${s.status}`) }}
            </UBadge>
          </td>
          <td class="px-4 py-3">{{ s.responses_count }}</td>
          <td class="px-4 py-3 text-end">
            <div class="flex justify-end gap-1">
              <UButton :to="`/surveys/${s.id}`" size="xs" variant="outline">
                {{ t('common.view') }}
              </UButton>
              <UButton
                v-if="s.status === 'draft'"
                :to="`/surveys/${s.id}/edit`"
                size="xs"
                variant="ghost"
                icon="i-lucide-pencil"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
