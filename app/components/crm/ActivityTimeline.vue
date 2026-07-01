<script setup lang="ts">
import type { CrmActivity } from '~/types/phase5'

defineProps<{ activities: CrmActivity[] }>()
const { t } = useI18n()
</script>

<template>
  <ul class="space-y-3">
    <li v-for="a in activities" :key="a.id" class="flex gap-3 border-s-2 border-[var(--color-midesk-accent)] ps-3">
      <div>
        <p class="text-sm font-medium">{{ a.subject }}</p>
        <p class="text-xs text-[var(--color-midesk-muted)]">
          {{ t(`crm.activityTypes.${a.type}`) }} · {{ a.performed_by.name }} · {{ a.performed_at.slice(0, 10) }}
        </p>
      </div>
    </li>
  </ul>
</template>
