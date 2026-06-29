<script setup lang="ts">
import draggable from 'vuedraggable'
import type { Task } from '~/types'
import type { Sprint } from '~/types/phase1'

const props = defineProps<{
  sprint: Sprint
  droppable?: boolean
}>()

const emit = defineEmits<{
  assign: [taskId: string]
  activate: []
  close: []
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const dropList = ref<Task[]>([])

const statusClass = computed(() => {
  switch (props.sprint.status) {
    case 'active':
      return 'border-emerald-500/60'
    case 'planning':
      return 'border-[var(--color-midesk-border)]'
    case 'closed':
      return 'border-[var(--color-midesk-border)] opacity-50'
    default:
      return 'border-[var(--color-midesk-border)]'
  }
})

const progressPercent = computed(() => {
  if (!props.sprint.total_points) return 0
  return Math.round((props.sprint.completed_points / props.sprint.total_points) * 100)
})

const daysRemaining = computed(() => {
  const end = Date.parse(props.sprint.end_date)
  const now = Date.now()
  return Math.max(0, Math.ceil((end - now) / 86400000))
})

function onDrop(evt: { added?: { element: Task } }) {
  if (!evt.added) return
  const taskId = evt.added.element.id
  dropList.value = []
  emit('assign', taskId)
}
</script>

<template>
  <div
    class="midesk-glass rounded-xl border p-4 transition"
    :class="statusClass"
  >
    <div class="mb-3 flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink
            :to="`/projects/${sprint.project_id}/sprints/${sprint.id}`"
            class="midesk-link truncate text-base font-semibold"
          >
            {{ sprint.name }}
          </NuxtLink>
          <UBadge
            :color="sprint.status === 'active' ? 'success' : 'neutral'"
            size="xs"
            variant="subtle"
          >
            {{ t(`sprint.${sprint.status}`) }}
          </UBadge>
        </div>
        <p v-if="sprint.goal" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
          {{ sprint.goal }}
        </p>
      </div>
      <div class="flex shrink-0 gap-1">
        <UButton
          v-if="sprint.status === 'planning'"
          size="xs"
          variant="soft"
          color="primary"
          @click="emit('activate')"
        >
          {{ t('sprint.activate') }}
        </UButton>
        <UButton
          v-if="sprint.status === 'active'"
          size="xs"
          variant="soft"
          color="neutral"
          @click="emit('close')"
        >
          {{ t('sprint.close') }}
        </UButton>
      </div>
    </div>

    <div class="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-midesk-muted)]">
      <span>{{ formatDate(sprint.start_date) }} – {{ formatDate(sprint.end_date) }}</span>
      <span v-if="sprint.status === 'active'">
        {{ t('sprint.daysRemaining', { days: daysRemaining }) }}
      </span>
      <span>{{ sprint.done_count }}/{{ sprint.tasks_count }} {{ t('sprint.tasks') }}</span>
    </div>

    <div class="mb-1 flex items-center justify-between text-xs">
      <span class="text-[var(--color-midesk-muted)]">{{ t('sprint.progress') }}</span>
      <span class="font-medium">
        {{ sprint.completed_points }}/{{ sprint.total_points }} {{ t('sprint.points') }}
      </span>
    </div>
    <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
      <div
        class="h-full rounded-full bg-[var(--color-midesk-accent)] transition-all"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <ClientOnly v-if="droppable && sprint.status !== 'closed'">
      <div class="relative mt-3">
        <draggable
          v-model="dropList"
          :group="{ name: 'sprint-tasks', pull: false, put: true }"
          item-key="id"
          class="min-h-[2.5rem] rounded-lg border border-dashed border-[var(--color-midesk-border)]/60 p-2 transition"
          :class="{ 'border-[var(--color-midesk-accent)]/40 bg-[var(--color-midesk-accent-soft)]': dropList.length }"
          ghost-class="opacity-40"
          @add="onDrop"
        >
          <template #item="{ element }">
            <span class="text-xs text-[var(--color-midesk-muted)]">{{ element.title }}</span>
          </template>
        </draggable>
        <p
          v-if="!dropList.length"
          class="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-[var(--color-midesk-muted)]"
        >
          {{ t('sprint.assignToSprint') }}
        </p>
      </div>
    </ClientOnly>
  </div>
</template>
