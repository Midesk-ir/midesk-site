<script setup lang="ts">
import type { Candidate, Requisition } from '~/types/phase2'
import type { User } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const { api } = useApi()
const route = useRoute()
const recruitmentStore = useRecruitmentStore()

const requisition = ref<Requisition | null>(null)
const selectedCandidate = ref<Candidate | null>(null)
const showProfile = ref(false)
const showInterview = ref(false)
const interviewers = ref<User[]>([])
const loading = ref(true)

const requisitionId = computed(() => route.params.id as string)

async function load() {
  loading.value = true
  try {
    await recruitmentStore.fetchRequisitions()
    requisition.value = recruitmentStore.requisitions.find(r => r.id === requisitionId.value) ?? null
    await recruitmentStore.fetchCandidates(requisitionId.value)
    try {
      const res = await api<{ data: User[] }>('/members')
      interviewers.value = res.data
    } catch {
      interviewers.value = []
    }
  } finally {
    loading.value = false
  }
}

function onSelect(candidate: Candidate) {
  selectedCandidate.value = candidate
  showProfile.value = true
}

function onScheduleInterview() {
  showInterview.value = true
}

async function onInterviewSubmitted() {
  showInterview.value = false
  await recruitmentStore.fetchCandidates(requisitionId.value)
  if (selectedCandidate.value) {
    selectedCandidate.value = recruitmentStore.candidates.find(c => c.id === selectedCandidate.value!.id) ?? null
  }
}

async function onStatusChange() {
  await recruitmentStore.fetchCandidates(requisitionId.value)
}

async function onHire() {
  await load()
  showProfile.value = false
}

watch(requisitionId, load)
onMounted(load)
</script>

<template>
  <div>
    <div class="mb-6">
      <UButton
        to="/hr/recruitment"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-right"
        size="sm"
        class="mb-3"
      >
        {{ t('nav.hr.recruitment') }}
      </UButton>
      <h1 class="midesk-page-title">
        {{ requisition?.title ?? t('nav.hr.recruitment') }}
      </h1>
      <p v-if="requisition" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
        {{ requisition.department ?? '—' }}
        · {{ requisition.positions_count }} {{ t('recruitment.requisitions.columns.positions') }}
      </p>
    </div>

    <RecruitmentCandidateKanban
      :candidates="recruitmentStore.candidates"
      :loading="loading"
      @select="onSelect"
      @status-change="onStatusChange"
    />

    <MideskModal
      v-model:open="showProfile"
      :title="selectedCandidate?.full_name ?? t('recruitment.candidate.title')"
    >
      <RecruitmentCandidateProfile
        v-if="selectedCandidate"
        :candidate="selectedCandidate"
        @hire="onHire"
        @schedule-interview="onScheduleInterview"
      />
    </MideskModal>

    <MideskModal v-model:open="showInterview" :title="t('recruitment.interview.schedule')">
      <RecruitmentInterviewForm
        v-if="selectedCandidate"
        :candidate-id="selectedCandidate.id"
        :interviewers="interviewers"
        @submitted="onInterviewSubmitted"
      />
    </MideskModal>
  </div>
</template>
