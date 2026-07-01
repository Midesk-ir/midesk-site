<script setup lang="ts">
import type { Meeting } from '~/types/phase4'

const props = defineProps<{ meeting: Meeting }>()
defineEmits<{ join: [id: string] }>()

const { t } = useI18n()
const { formatDateTime } = useCalendar()

const providerIcon: Record<string, string> = {
  jitsi: 'i-lucide-video',
  bbb: 'i-lucide-monitor-play',
  google_meet: 'i-lucide-calendar'
}

const canJoin = computed(() =>
  props.meeting.room_url
  && props.meeting.status !== 'completed'
  && props.meeting.status !== 'cancelled'
)
</script>

<template>
  <article class="midesk-meeting-card midesk-card flex h-full flex-col gap-4 p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <NuxtLink
          :to="`/meetings/${meeting.id}`"
          class="font-semibold text-[var(--color-midesk-text)] transition hover:text-[var(--color-midesk-accent)]"
        >
          {{ meeting.title }}
        </NuxtLink>
        <p class="mt-2 text-sm text-[var(--color-midesk-muted)]">
          {{ formatDateTime(meeting.start_at) }}
        </p>
        <p class="text-sm text-[var(--color-midesk-muted)]">
          {{ formatDateTime(meeting.end_at) }}
        </p>
      </div>
      <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-midesk-accent-soft)]">
        <UIcon :name="providerIcon[meeting.provider] ?? 'i-lucide-video'" class="size-5 text-[var(--color-midesk-accent)]" />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UBadge variant="subtle" :color="meeting.status === 'in_progress' ? 'success' : meeting.status === 'completed' ? 'neutral' : 'primary'" size="sm">
        {{ t(`meetings.status.${meeting.status}`) }}
      </UBadge>
      <span class="text-xs text-[var(--color-midesk-muted)]">
        {{ meeting.attendees.length }} {{ t('meetings.attendees') }}
      </span>
      <span class="text-xs text-[var(--color-midesk-muted)]">
        {{ meeting.organizer.name }}
      </span>
    </div>

    <div class="mt-auto flex flex-wrap gap-2 pt-1">
      <UButton
        v-if="canJoin"
        size="sm"
        color="primary"
        variant="soft"
        icon="i-lucide-log-in"
        @click="$emit('join', meeting.id)"
      >
        {{ t('meetings.join') }}
      </UButton>
      <UButton
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-lucide-eye"
        :to="`/meetings/${meeting.id}`"
      >
        {{ t('meetings.details') }}
      </UButton>
    </div>
  </article>
</template>
