<script setup lang="ts">
import type { MeetingAttendee } from '~/types/phase4'

defineProps<{ attendees: MeetingAttendee[] }>()
const { t } = useI18n()
</script>

<template>
  <ul class="space-y-2">
    <li
      v-for="a in attendees"
      :key="a.user.id"
      class="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-midesk-border)] px-3 py-2"
    >
      <div class="flex items-center gap-2">
        <UAvatar :alt="a.user.name" size="xs" icon="i-lucide-user" />
        <span class="text-sm">{{ a.user.name }}</span>
      </div>
      <UBadge variant="subtle" size="xs">{{ t(`meetings.attendeeStatus.${a.status}`) }}</UBadge>
    </li>
  </ul>
</template>
