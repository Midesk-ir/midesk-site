<script setup lang="ts">
export type OnboardingWizardStep = {
  id: number
  icon: string
  title: string
  description: string
}

const props = defineProps<{
  steps: OnboardingWizardStep[]
  current: number
}>()

const emit = defineEmits<{
  'update:current': [step: number]
}>()

const { t } = useI18n()

const progress = computed(() => Math.round((props.current / props.steps.length) * 100))

function stepState(id: number): 'done' | 'current' | 'upcoming' {
  if (id < props.current) return 'done'
  if (id === props.current) return 'current'
  return 'upcoming'
}

function onStepClick(id: number) {
  if (id < props.current) emit('update:current', id)
}
</script>

<template>
  <div class="onboarding-step-indicator">
    <div class="mb-4 flex items-center justify-between gap-3">
      <p class="text-sm font-medium text-[var(--color-midesk-text)]">
        {{ t('onboarding.stepOf', { current, total: steps.length }) }}
      </p>
      <span class="text-xs tabular-nums text-[var(--color-midesk-muted)]">{{ progress }}%</span>
    </div>

    <UProgress :model-value="progress" color="primary" size="xs" class="mb-6" />

    <ol class="hidden items-start justify-between gap-2 sm:flex">
      <li
        v-for="(item, index) in steps"
        :key="item.id"
        class="relative flex min-w-0 flex-1 flex-col items-center"
      >
        <div
          v-if="index < steps.length - 1"
          class="onboarding-step-indicator__line"
          :class="stepState(item.id) === 'done' ? 'onboarding-step-indicator__line--done' : ''"
          aria-hidden="true"
        />

        <button
          type="button"
          class="onboarding-step-indicator__node"
          :class="[
            `onboarding-step-indicator__node--${stepState(item.id)}`,
            stepState(item.id) === 'done' ? 'cursor-pointer' : 'cursor-default'
          ]"
          :disabled="stepState(item.id) !== 'done'"
          :aria-current="stepState(item.id) === 'current' ? 'step' : undefined"
          @click="onStepClick(item.id)"
        >
          <UIcon
            v-if="stepState(item.id) === 'done'"
            name="i-lucide-check"
            class="size-4"
          />
          <UIcon v-else :name="item.icon" class="size-4" />
        </button>

        <div class="mt-2 w-full px-1 text-center">
          <p
            class="truncate text-xs font-medium"
            :class="stepState(item.id) === 'current'
              ? 'text-[var(--color-midesk-accent)]'
              : stepState(item.id) === 'done'
                ? 'text-[var(--color-midesk-text)]'
                : 'text-[var(--color-midesk-muted)]'"
          >
            {{ item.title }}
          </p>
        </div>
      </li>
    </ol>

    <div class="flex items-center gap-3 sm:hidden">
      <div
        class="onboarding-step-indicator__node onboarding-step-indicator__node--current shrink-0"
        aria-hidden="true"
      >
        <UIcon :name="steps[current - 1]?.icon ?? 'i-lucide-circle'" class="size-4" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium">{{ steps[current - 1]?.title }}</p>
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ steps[current - 1]?.description }}</p>
      </div>
      <div class="flex shrink-0 gap-1.5" aria-hidden="true">
        <span
          v-for="item in steps"
          :key="item.id"
          class="onboarding-step-indicator__dot"
          :class="{
            'onboarding-step-indicator__dot--active': item.id <= current,
            'onboarding-step-indicator__dot--current': item.id === current
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-step-indicator__line {
  position: absolute;
  top: 1.125rem;
  inset-inline-start: calc(50% + 1.125rem);
  width: calc(100% - 2.25rem);
  height: 2px;
  background: var(--color-midesk-border);
  transition: background 0.2s ease;
}

.onboarding-step-indicator__line--done {
  background: var(--color-midesk-accent);
}

.onboarding-step-indicator__node {
  position: relative;
  z-index: 1;
  display: flex;
  size: 2.25rem;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 2px solid var(--color-midesk-border);
  background: var(--color-midesk-surface);
  color: var(--color-midesk-muted);
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.onboarding-step-indicator__node--current {
  border-color: var(--color-midesk-accent);
  background: color-mix(in srgb, var(--color-midesk-accent) 15%, transparent);
  color: var(--color-midesk-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-midesk-accent) 12%, transparent);
}

.onboarding-step-indicator__node--done {
  border-color: var(--color-midesk-accent);
  background: var(--color-midesk-accent);
  color: white;
}

.onboarding-step-indicator__node--done:not(:disabled):hover {
  filter: brightness(1.08);
}

.onboarding-step-indicator__node--upcoming {
  opacity: 0.75;
}

.onboarding-step-indicator__dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: var(--color-midesk-border);
  transition: background 0.2s ease, transform 0.2s ease;
}

.onboarding-step-indicator__dot--active {
  background: var(--color-midesk-accent);
}

.onboarding-step-indicator__dot--current {
  transform: scale(1.35);
}
</style>
