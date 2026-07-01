<script setup lang="ts">
import type { Correspondence } from '~/types/phase5'

defineProps<{ items: Correspondence[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="midesk-card overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
          <th class="px-4 py-3 text-start">{{ t('correspondence.number') }}</th>
          <th class="px-4 py-3 text-start">{{ t('correspondence.subject') }}</th>
          <th class="px-4 py-3 text-start">{{ t('correspondence.type') }}</th>
          <th class="px-4 py-3 text-start">{{ t('correspondence.status') }}</th>
          <th class="px-4 py-3 text-end">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in items" :key="c.id" class="border-b border-[var(--color-midesk-border)]">
          <td class="px-4 py-3">{{ c.number }}</td>
          <td class="px-4 py-3">{{ c.subject }}</td>
          <td class="px-4 py-3">{{ t(`correspondence.types.${c.type}`) }}</td>
          <td class="px-4 py-3">{{ t(`correspondence.statuses.${c.status}`) }}</td>
          <td class="px-4 py-3 text-end">
            <UButton :to="`/correspondence/${c.id}`" size="xs" variant="outline">{{ t('common.view') }}</UButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
