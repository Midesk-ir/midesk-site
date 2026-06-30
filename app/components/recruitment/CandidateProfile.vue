<script setup lang="ts">
import type { Candidate } from '~/types/phase2'

const props = defineProps<{
  candidate: Candidate
}>()

const emit = defineEmits<{
  hire: [id: string]
  scheduleInterview: []
}>()

const { t } = useI18n()
const { formatDateTime } = useCalendar()
const { can } = usePermissions()
const recruitmentStore = useRecruitmentStore()
const toast = useToast()

const hiring = ref(false)

const canHire = computed(() =>
  can('hr:recruitment:manage') && props.candidate.status === 'offer'
)

async function onHire() {
  hiring.value = true
  try {
    await recruitmentStore.hire(props.candidate.id)
    emit('hire', props.candidate.id)
    toast.add({ title: t('recruitment.candidate.hiredSuccess'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    hiring.value = false
  }
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <h3 class="text-lg font-semibold">{{ candidate.full_name }}</h3>
      <p v-if="candidate.email" class="text-sm text-[var(--color-midesk-muted)]">{{ candidate.email }}</p>
      <p v-if="candidate.phone" class="text-sm text-[var(--color-midesk-muted)]">{{ candidate.phone }}</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <UBadge variant="subtle">{{ t(`recruitment.candidateStatus.${candidate.status}`) }}</UBadge>
        <UBadge v-if="candidate.source" color="neutral" variant="subtle">{{ candidate.source }}</UBadge>
        <UBadge v-if="candidate.average_score" color="primary" variant="subtle">
          {{ t('recruitment.interview.avgScore') }}: {{ candidate.average_score.toFixed(1) }}
        </UBadge>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <UButton
        size="sm"
        variant="soft"
        icon="i-lucide-calendar-plus"
        @click="emit('scheduleInterview')"
      >
        {{ t('recruitment.interview.schedule') }}
      </UButton>
      <UButton
        v-if="canHire"
        size="sm"
        color="success"
        icon="i-lucide-user-plus"
        :loading="hiring"
        @click="onHire"
      >
        {{ t('recruitment.candidate.hire') }}
      </UButton>
    </div>

    <div>
      <h4 class="mb-3 text-sm font-medium text-[var(--color-midesk-muted)]">
        {{ t('recruitment.interview.title') }}
      </h4>

      <UiEmptyState
        v-if="!candidate.interviews.length"
        :title="t('recruitment.interview.emptyTitle')"
        icon="i-lucide-calendar"
        class="py-6"
      />

      <ul v-else class="divide-y divide-[var(--color-midesk-border)] rounded-lg border border-[var(--color-midesk-border)]">
        <li
          v-for="interview in candidate.interviews"
          :key="interview.id"
          class="px-4 py-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="font-medium">{{ formatDateTime(interview.scheduled_at) }}</p>
              <p class="text-sm text-[var(--color-midesk-muted)]">
                {{ t(`recruitment.interview.type.${interview.type}`) }}
                · {{ interview.interviewer.name }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <UBadge variant="subtle" size="xs">
                {{ t(`recruitment.interview.status.${interview.status}`) }}
              </UBadge>
              <UBadge v-if="interview.score" color="primary" variant="subtle" size="xs">
                {{ interview.score }}/5
              </UBadge>
            </div>
          </div>
          <p v-if="interview.feedback" class="mt-2 text-sm text-[var(--color-midesk-muted)]">
            {{ interview.feedback }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
