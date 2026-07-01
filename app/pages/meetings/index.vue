<script setup lang="ts">
import type { CreateMeetingPayload } from '~/types/phase4'
import type { User } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const toast = useToast()
const { api } = useApi()
const meetingsStore = useMeetingsStore()

type MeetingFilter = 'today' | 'upcoming' | 'past' | 'all'

const filter = ref<MeetingFilter>('all')
const loadError = ref(false)
const showCreate = ref(false)
const members = ref<User[]>([])

const filterItems = computed(() => [
  { label: t('meetings.filters.today'), value: 'today' as const, icon: 'i-lucide-sun' },
  { label: t('meetings.filters.upcoming'), value: 'upcoming' as const, icon: 'i-lucide-calendar-clock' },
  { label: t('meetings.filters.past'), value: 'past' as const, icon: 'i-lucide-history' },
  { label: t('meetings.filters.all'), value: 'all' as const, icon: 'i-lucide-layout-grid' }
])

async function load() {
  loadError.value = false
  try {
    const apiFilter = filter.value === 'all' ? undefined : filter.value
    await meetingsStore.fetchMeetings(apiFilter)
  } catch {
    loadError.value = true
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

watch(filter, load)

async function loadMembers() {
  try {
    const res = await api<{ data: User[] }>('/members')
    members.value = res.data
  } catch {
    members.value = []
  }
}

async function onCreate(payload: CreateMeetingPayload) {
  try {
    await meetingsStore.createMeeting(payload)
    showCreate.value = false
    toast.add({ title: t('meetings.created'), color: 'success' })
    filter.value = 'upcoming'
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function onJoin(id: string) {
  navigateTo(`/meetings/${id}/room`)
}

onMounted(async () => {
  await Promise.all([load(), loadMembers()])
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader
      :title="t('nav.meetings')"
      :subtitle="t('meetings.pageSubtitle')"
    >
      <template #actions>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="showCreate = true">
          {{ t('meetings.create') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <UiSegmentTabs v-model="filter" :items="filterItems" />

    <UAlert
      v-if="loadError"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      :title="t('common.error')"
      class="mb-4"
    />

    <UiEmptyState
      v-if="!meetingsStore.loading && !loadError && !meetingsStore.meetings.length"
      :title="t('meetings.emptyTitle')"
      :description="t('meetings.emptyDesc')"
      icon="i-lucide-video"
    />

    <MeetingList
      v-else
      :meetings="meetingsStore.meetings"
      :loading="meetingsStore.loading"
      @join="onJoin"
    />

    <MideskModal v-model:open="showCreate" :title="t('meetings.create')">
      <MeetingForm :members="members" @submit="onCreate" />
    </MideskModal>
  </div>
</template>
