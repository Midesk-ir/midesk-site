<script setup lang="ts">
import type { Task, User } from '~/types'
import type { Sprint } from '~/types/phase1'

const props = defineProps<{
  task: Task
  members: User[]
  columns: Array<{ slug: string, name: string, color: string }>
  statusItems: Array<{ label: string, value: string }>
  sprint: Sprint | null
  sprints: Sprint[]
  priorityMeta: { color: string, icon: string }
}>()

const emit = defineEmits<{
  save: [field: Partial<Task>]
  'assign-sprint': [sprintId: string | null]
}>()

const { t } = useI18n()
const { formatDate, isOverdue } = useCalendar()

const statusColor = computed(() =>
  props.columns.find(c => c.slug === props.task.status)?.color ?? '#6b7280'
)

const priorityItems = computed(() =>
  (['low', 'medium', 'high', 'critical'] as const).map(p => ({
    label: t(`task.priorities.${p}`),
    value: p
  }))
)

const assigneeItems = computed(() => [
  { label: t('task.unassigned'), value: 'none' },
  ...props.members.map(m => ({ label: m.name, value: m.id }))
])

const sprintItems = computed(() => {
  const assignable = props.sprints.filter(s => s.status !== 'closed')
  const currentId = props.task.sprint_id
  const current = currentId
    ? props.sprints.find(s => s.id === currentId) ?? props.sprint
    : null

  const items = [
    { label: t('sprint.backlog'), value: 'none' },
    ...assignable.map(s => ({
      label: `${s.name} (${t(`sprint.${s.status}`)})`,
      value: s.id
    }))
  ]

  if (current && current.status === 'closed' && !items.some(i => i.value === current.id)) {
    items.push({
      label: `${current.name} (${t('sprint.closed')})`,
      value: current.id
    })
  }

  return items
})

const selectedSprintId = computed(() => props.task.sprint_id ?? 'none')

function onSprintChange(value: string) {
  const next = value === 'none' ? null : value
  if ((props.task.sprint_id ?? null) === next) return
  emit('assign-sprint', next)
}
</script>

<template>
  <dl class="task-modal-props">
    <div class="task-modal-prop">
      <dt class="task-modal-prop-label">
        <span
          class="task-modal-status-dot"
          :style="{ backgroundColor: statusColor }"
        />
        {{ t('task.status') }}
      </dt>
      <dd class="task-modal-prop-value">
        <USelect
          :model-value="task.status"
          :items="statusItems.length ? statusItems : [{ label: task.status, value: task.status }]"
          size="sm"
          class="task-modal-control task-modal-status-select"
          :style="{ '--field-accent': statusColor }"
          @update:model-value="emit('save', { status: $event as Task['status'] })"
        />
      </dd>
    </div>

    <div class="task-modal-prop">
      <dt class="task-modal-prop-label">{{ t('task.assignee') }}</dt>
      <dd class="task-modal-prop-value">
        <USelect
          :model-value="task.assignee?.id ?? 'none'"
          :items="assigneeItems"
          size="sm"
          class="task-modal-control"
          @update:model-value="(v: string) => {
            const user = members.find(m => m.id === v)
            emit('save', {
              assignee: user ? { id: user.id, name: user.name, avatar_url: user.avatar_url } : null
            })
          }"
        />
      </dd>
    </div>

    <div class="task-modal-prop">
      <dt class="task-modal-prop-label">
        <UIcon
          :name="priorityMeta.icon"
          class="size-3.5"
          :style="{ color: priorityMeta.color }"
        />
        {{ t('task.priority') }}
      </dt>
      <dd class="task-modal-prop-value">
        <USelect
          :model-value="task.priority"
          :items="priorityItems"
          size="sm"
          class="task-modal-control"
          @update:model-value="emit('save', { priority: $event as Task['priority'] })"
        />
      </dd>
    </div>

    <div class="task-modal-prop">
      <dt class="task-modal-prop-label">{{ t('task.dueDate') }}</dt>
      <dd class="task-modal-prop-value">
        <MideskDatePicker
          size="sm"
          class="task-modal-control"
          :class="{ 'task-modal-control--overdue': task.due_date && isOverdue(task.due_date) }"
          :model-value="task.due_date?.slice(0, 10) ?? null"
          @update:model-value="emit('save', { due_date: $event ? `${$event}T00:00:00Z` : null })"
        />
        <p
          v-if="task.due_date && isOverdue(task.due_date)"
          class="task-modal-overdue"
        >
          {{ t('task.overdue') }} · {{ formatDate(task.due_date) }}
        </p>
      </dd>
    </div>

    <div v-if="task.labels.length" class="task-modal-prop task-modal-prop--stack">
      <dt class="task-modal-prop-label">{{ t('task.labels') }}</dt>
      <dd class="task-modal-prop-value">
        <div class="task-modal-prop-labels">
          <span
            v-for="label in task.labels"
            :key="label.id"
            class="task-modal-label-pill"
            :style="{ backgroundColor: label.color }"
          >
            {{ label.name }}
          </span>
        </div>
      </dd>
    </div>

    <div class="task-modal-prop">
      <dt class="task-modal-prop-label">{{ t('task.sprint') }}</dt>
      <dd class="task-modal-prop-value">
        <USelect
          :model-value="selectedSprintId"
          :items="sprintItems"
          size="sm"
          class="task-modal-control"
          @update:model-value="(v: string) => onSprintChange(v)"
        />
      </dd>
    </div>
  </dl>
</template>
