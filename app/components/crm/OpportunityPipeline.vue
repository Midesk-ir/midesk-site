<script setup lang="ts">
import draggable from 'vuedraggable'
import type { CrmOpportunity, CrmOpportunityStage } from '~/types/phase5'

const props = defineProps<{
  opportunities: CrmOpportunity[]
  stages: CrmOpportunityStage[]
  loading?: boolean
}>()

const emit = defineEmits<{
  move: [payload: { id: string, stage: CrmOpportunityStage }]
}>()

const { t } = useI18n()

const localColumns = ref<Record<CrmOpportunityStage, CrmOpportunity[]>>({
  lead: [],
  qualified: [],
  proposal: [],
  negotiation: [],
  won: [],
  lost: []
})

watch(
  () => [props.opportunities, props.stages] as const,
  ([list, stages]) => {
    const grouped = Object.fromEntries(stages.map(s => [s, [] as CrmOpportunity[]])) as Record<CrmOpportunityStage, CrmOpportunity[]>
    list.forEach((o) => {
      grouped[o.stage]?.push(o)
    })
    localColumns.value = grouped
  },
  { immediate: true, deep: true }
)

function onColumnChange(stage: CrmOpportunityStage, evt: { added?: { element: CrmOpportunity } }) {
  if (!evt.added) return
  const opp = evt.added.element
  if (opp.stage === stage) return
  emit('move', { id: opp.id, stage })
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex gap-4 overflow-x-auto pb-4">
      <USkeleton v-for="i in 6" :key="i" class="h-96 w-64 shrink-0 rounded-xl" />
    </div>

    <ClientOnly v-else>
      <div class="kanban-scroll flex gap-4 overflow-x-auto pb-4">
        <div
          v-for="stage in stages"
          :key="stage"
          class="kanban-column midesk-glass flex w-72 shrink-0 flex-col rounded-xl border border-[var(--color-midesk-border)]"
        >
          <div class="border-b border-[var(--color-midesk-border)] px-3 py-2.5">
            <div class="flex items-center justify-between gap-2">
              <h3 class="truncate text-sm font-medium">{{ t(`crm.stages.${stage}`) }}</h3>
              <UBadge variant="subtle" size="xs">{{ localColumns[stage].length }}</UBadge>
            </div>
          </div>

          <draggable
            :model-value="localColumns[stage]"
            item-key="id"
            group="crm-opportunities"
            class="flex min-h-[140px] flex-1 flex-col gap-2 p-2"
            ghost-class="opacity-40"
            :animation="200"
            @update:model-value="localColumns[stage] = $event"
            @change="onColumnChange(stage, $event)"
          >
            <template #item="{ element }">
              <CrmOpportunityCard :opportunity="element" />
            </template>
          </draggable>

          <p
            v-if="!localColumns[stage].length"
            class="px-3 pb-3 text-center text-xs text-[var(--color-midesk-muted)]"
          >
            {{ t('crm.emptyPipelineColumn') }}
          </p>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
