<script setup lang="ts">
import type { Meeting } from '~/types/phase4'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const route = useRoute()
const meetingsStore = useMeetingsStore()
const { formatDateTime } = useCalendar()

const meeting = ref<Meeting | null>(null)
const loading = ref(true)
const error = ref(false)

const id = computed(() => route.params.id as string)

const providerLabel: Record<string, string> = {
  jitsi: 'Jitsi',
  bbb: 'BigBlueButton',
  google_meet: 'Google Meet'
}

async function load() {
  loading.value = true
  error.value = false
  try {
    meeting.value = await meetingsStore.fetchMeeting(id.value)
  } catch {
    error.value = true
    meeting.value = null
  } finally {
    loading.value = false
  }
}

watch(id, load)
onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader
      back-to="/meetings"
      :back-label="t('nav.meetings')"
    >
      <template #title>
        <h1 class="midesk-page-title">{{ meeting?.title ?? t('nav.meetings') }}</h1>
        <p v-if="meeting" class="midesk-page-subtitle">
          {{ formatDateTime(meeting.start_at) }} – {{ formatDateTime(meeting.end_at) }}
        </p>
      </template>
      <template #actions>
        <LayoutMideskPageHeaderButton
          v-if="meeting?.room_url && meeting.status !== 'completed' && meeting.status !== 'cancelled'"
          variant="primary"
          icon="i-lucide-log-in"
          :to="`/meetings/${id}/room`"
        >
          {{ t('meetings.join') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <USkeleton v-if="loading" class="h-64 rounded-xl" />

    <UiEmptyState
      v-else-if="error || !meeting"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton color="primary" @click="load">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <template v-else>
      <section class="midesk-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('meetings.fields.provider') }}</p>
          <p class="mt-1 font-medium text-[var(--color-midesk-text)]">{{ providerLabel[meeting.provider] ?? meeting.provider }}</p>
        </div>
        <div>
          <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('meetings.organizer') }}</p>
          <p class="mt-1 font-medium text-[var(--color-midesk-text)]">{{ meeting.organizer.name }}</p>
        </div>
        <div>
          <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('meetings.statusLabel') }}</p>
          <UBadge variant="subtle" class="mt-1" :color="meeting.status === 'in_progress' ? 'success' : 'neutral'">
            {{ t(`meetings.status.${meeting.status}`) }}
          </UBadge>
        </div>
        <div>
          <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('meetings.attendees') }}</p>
          <p class="mt-1 font-medium text-[var(--color-midesk-text)]">{{ meeting.attendees.length }}</p>
        </div>
      </section>

      <section class="midesk-card p-5">
        <h2 class="midesk-card-header">{{ t('meetings.attendees') }}</h2>
        <MeetingAttendees :attendees="meeting.attendees" />
      </section>
    </template>
  </div>
</template>
