<script setup lang="ts">
import type { Task, User } from '~/types'
import type { Sprint } from '~/types/phase1'

const props = defineProps<{
  task: Task
  members: User[]
  columns: Array<{ slug: string, name: string, color: string }>
  statusItems: Array<{ label: string, value: string }>
  sprint: Sprint | null
  priorityMeta: { color: string, icon: string }
}>()

const emit = defineEmits<{
  save: [field: Partial<Task>]
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

    <div class="task-modal-prop">
      <dt class="task-modal-prop-label">{{ t('task.storyPoints') }}</dt>
      <dd class="task-modal-prop-value">
        <UInput
          type="number"
          min="0"
          size="sm"
          class="task-modal-control midesk-ltr-field"
          :model-value="task.story_points != null ? String(task.story_points) : ''"
          placeholder="—"
          @update:model-value="(v: string | number) => emit('save', {
            story_points: v === '' || v == null ? null : Number(v)
          })"
        />
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
        <NuxtLink
          v-if="sprint"
          :to="`/projects/${task.project_id}/sprints`"
          class="task-modal-sprint-link"
        >
          <UIcon name="i-lucide-zap" class="size-3.5" />
          {{ sprint.name }}
        </NuxtLink>
        <span v-else class="task-modal-prop-empty">—</span>
      </dd>
    </div>
  </dl>
</template>
