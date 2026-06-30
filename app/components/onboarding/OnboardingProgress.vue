<script setup lang="ts">
import type { OnboardingProgress, OnboardingStep } from '~/types/phase2'

const props = defineProps<{
  progress: OnboardingProgress
  steps: OnboardingStep[]
}>()

const emit = defineEmits<{
  'complete-step': [stepId: string]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { api } = useApi()
const toast = useToast()

const completing = ref<string | null>(null)

const sortedSteps = computed(() =>
  [...props.steps].sort((a, b) => a.order_index - b.order_index)
)

const progressPercent = computed(() =>
  props.progress.total_steps
    ? Math.round((props.progress.completed_steps.length / props.progress.total_steps) * 100)
    : 0
)

function isCompleted(stepId: string) {
  return props.progress.completed_steps.includes(stepId)
}

async function toggleStep(step: OnboardingStep) {
  if (isCompleted(step.id) || props.progress.status !== 'in_progress') return

  completing.value = step.id
  try {
    await api(`/hr/onboarding/progress/${props.progress.id}/complete-step`, {
      method: 'PATCH',
      body: { step_id: step.id }
    })
    emit('complete-step', step.id)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    completing.value = null
  }
}
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
    <div class="mb-5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="midesk-card-header mb-1">{{ progress.template_name }}</h2>
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ progress.user.name }} · {{ t('onboarding.progress.started') }} {{ formatDate(progress.started_at) }}
          </p>
        </div>
        <UBadge
          :color="progress.status === 'completed' ? 'success' : progress.status === 'cancelled' ? 'error' : 'warning'"
          variant="subtle"
        >
          {{ t(`onboarding.status.${progress.status}`) }}
        </UBadge>
      </div>

      <div class="mt-4">
        <div class="mb-1 flex justify-between text-xs text-[var(--color-midesk-muted)]">
          <span>{{ progress.completed_steps.length }} / {{ progress.total_steps }}</span>
          <span>{{ progressPercent }}%</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            class="h-full rounded-full bg-[var(--color-midesk-accent)] transition-all"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
      </div>
    </div>

    <ol class="space-y-0">
      <li
        v-for="(step, index) in sortedSteps"
        :key="step.id"
        class="relative flex gap-4 pb-6 last:pb-0"
      >
        <div class="flex flex-col items-center">
          <button
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-full border transition"
            :class="isCompleted(step.id)
              ? 'border-green-500/50 bg-green-500/20 text-green-400'
              : 'border-[var(--color-midesk-border)] bg-white/[0.03] hover:border-[var(--color-midesk-accent)]'"
            :disabled="isCompleted(step.id) || progress.status !== 'in_progress'"
            :aria-label="t('onboarding.progress.completeStep')"
            @click="toggleStep(step)"
          >
            <UIcon
              v-if="completing === step.id"
              name="i-lucide-loader-circle"
              class="size-4 animate-spin"
            />
            <UIcon
              v-else-if="isCompleted(step.id)"
              name="i-lucide-check"
              class="size-4"
            />
            <span v-else class="text-xs font-medium">{{ index + 1 }}</span>
          </button>
          <div
            v-if="index < sortedSteps.length - 1"
            class="mt-1 w-px flex-1 bg-[var(--color-midesk-border)]"
          />
        </div>

        <div class="min-w-0 flex-1 pt-1">
          <p class="font-medium" :class="{ 'text-[var(--color-midesk-muted)] line-through': isCompleted(step.id) }">
            {{ step.title }}
          </p>
          <p v-if="step.description" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
            {{ step.description }}
          </p>
          <p v-if="step.assignee_role" class="mt-1 text-xs text-[var(--color-midesk-muted)]">
            {{ t('onboarding.template.fields.assigneeRole') }}: {{ step.assignee_role }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
