<script setup lang="ts">
import type { OnboardingProgress, OnboardingStatus } from '~/types/phase2'

defineProps<{
  onboardings: OnboardingProgress[]
  loading?: boolean
  hideHeader?: boolean
  selectedId?: string | null
}>()

const emit = defineEmits<{
  select: [progress: OnboardingProgress]
}>()

const { t } = useI18n()
const { formatDate, formatRelative } = useCalendar()

const statusColor: Record<OnboardingStatus, 'warning' | 'success' | 'error'> = {
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error'
}

function progressPercent(item: OnboardingProgress) {
  return item.total_steps
    ? Math.round((item.completed_steps.length / item.total_steps) * 100)
    : 0
}
</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div v-if="!hideHeader" class="border-b border-[var(--color-midesk-border)] px-5 py-4">
      <h2 class="midesk-card-header mb-0">{{ t('onboarding.list.title') }}</h2>
    </div>

    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-16" />
    </div>

    <UiEmptyState
      v-else-if="!onboardings.length"
      :title="t('onboarding.list.emptyTitle')"
      :description="t('onboarding.list.emptyDesc')"
      icon="i-lucide-user-check"
    />

    <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
      <li
        v-for="item in onboardings"
        :key="item.id"
        class="cursor-pointer px-5 py-4 transition hover:bg-white/[0.02]"
        :class="selectedId === item.id ? 'bg-[var(--color-midesk-accent-soft)]' : ''"
        @click="emit('select', item)"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <UAvatar :alt="item.user.name" size="sm" icon="i-lucide-user" />
            <div>
              <p class="font-medium">{{ item.user.name }}</p>
              <p class="text-sm text-[var(--color-midesk-muted)]">
                {{ item.template_name }}
                · {{ formatDate(item.started_at) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="hidden w-24 sm:block">
              <div class="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  class="h-full rounded-full bg-[var(--color-midesk-accent)]"
                  :style="{ width: `${progressPercent(item)}%` }"
                />
              </div>
              <p class="mt-1 text-center text-xs text-[var(--color-midesk-muted)]">
                {{ item.completed_steps.length }}/{{ item.total_steps }}
              </p>
            </div>
            <UBadge :color="statusColor[item.status]" variant="subtle">
              {{ t(`onboarding.status.${item.status}`) }}
            </UBadge>
            <span class="text-xs text-[var(--color-midesk-muted)]">{{ formatRelative(item.started_at) }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
