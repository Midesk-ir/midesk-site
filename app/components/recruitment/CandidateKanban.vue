<script setup lang="ts">
import draggable from 'vuedraggable'
import type { Candidate, CandidateStatus } from '~/types/phase2'

const props = defineProps<{
  candidates: Candidate[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'status-change': [payload: { candidateId: string, status: CandidateStatus }]
  select: [candidate: Candidate]
}>()

const { t } = useI18n()
const recruitmentStore = useRecruitmentStore()

const columns: CandidateStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected']

const columnLabels = computed(() =>
  Object.fromEntries(columns.map(c => [c, t(`recruitment.candidateStatus.${c}`)])) as Record<CandidateStatus, string>
)

const localColumns = ref<Record<CandidateStatus, Candidate[]>>({
  new: [],
  screening: [],
  interview: [],
  offer: [],
  hired: [],
  rejected: []
})

watch(
  () => props.candidates,
  (list) => {
    const grouped = Object.fromEntries(columns.map(c => [c, [] as Candidate[]])) as Record<CandidateStatus, Candidate[]>
    list.forEach((c) => {
      grouped[c.status]?.push(c)
    })
    localColumns.value = grouped
  },
  { immediate: true, deep: true }
)

function onColumnChange(status: CandidateStatus, evt: { added?: { element: Candidate } }) {
  if (!evt.added) return
  const candidate = evt.added.element
  if (candidate.status === status) return
  emit('status-change', { candidateId: candidate.id, status })
  recruitmentStore.moveCandidateStatus(candidate.id, status).catch(() => {
    // parent can reload on error
  })
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex gap-4 overflow-x-auto pb-4">
      <USkeleton v-for="i in 6" :key="i" class="h-96 w-64 shrink-0" />
    </div>

    <ClientOnly v-else>
      <div class="kanban-scroll flex gap-4 overflow-x-auto pb-4">
        <div
          v-for="status in columns"
          :key="status"
          class="kanban-column midesk-glass flex w-64 shrink-0 flex-col rounded-xl border border-[var(--color-midesk-border)]"
        >
          <div class="border-b border-[var(--color-midesk-border)] px-3 py-2.5">
            <div class="flex items-center justify-between">
              <h3 class="truncate text-sm font-medium">{{ columnLabels[status] }}</h3>
              <UBadge variant="subtle" size="xs">{{ localColumns[status].length }}</UBadge>
            </div>
          </div>

          <draggable
            :model-value="localColumns[status]"
            item-key="id"
            group="candidates"
            class="flex min-h-[120px] flex-1 flex-col gap-2 p-2"
            ghost-class="opacity-40"
            :animation="200"
            @update:model-value="localColumns[status] = $event"
            @change="onColumnChange(status, $event)"
          >
            <template #item="{ element }">
              <RecruitmentCandidateCard
                :candidate="element"
                @click="emit('select', element)"
              />
            </template>
          </draggable>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
