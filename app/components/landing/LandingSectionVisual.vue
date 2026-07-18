<script setup lang="ts">
import type { LandingSectionKey } from '~/utils/landing-data'

defineProps<{
  sectionKey: LandingSectionKey
  accent: string
}>()

const { t } = useI18n()
</script>

<template>
  <div
    class="midesk-landing-section-visual"
    :class="`midesk-landing-section-visual--${sectionKey} midesk-landing-section-visual--accent-${accent}`"
    aria-hidden="true"
  >
    <!-- Onboarding -->
    <div v-if="sectionKey === 'onboarding'" class="midesk-lsv-onboarding">
      <div class="midesk-lsv-window">
        <div class="midesk-lsv-window-bar">
          <span /><span /><span />
        </div>
        <div class="midesk-lsv-onboarding-steps">
          <div v-for="step in 4" :key="step" class="midesk-lsv-step" :style="{ '--step-i': step }">
            <span class="midesk-lsv-step-dot" :class="{ 'is-done': step < 4 }" />
            <div class="midesk-lsv-step-lines">
              <span /><span />
            </div>
          </div>
        </div>
        <div class="midesk-lsv-onboarding-badge">
          <UIcon name="i-lucide-party-popper" class="size-4" />
          {{ t('landing.visuals.onboarding.ready') }}
        </div>
      </div>
    </div>

    <!-- Projects -->
    <div v-else-if="sectionKey === 'projects'" class="midesk-lsv-kanban">
      <div v-for="col in 3" :key="col" class="midesk-lsv-kanban-col" :style="{ '--col-i': col }">
        <div class="midesk-lsv-kanban-head" />
        <div
          v-for="card in col === 1 ? 3 : 2"
          :key="card"
          class="midesk-lsv-kanban-card"
          :class="{ 'is-accent': col === 2 && card === 1 }"
        />
      </div>
      <div class="midesk-lsv-kanban-float">
        <UIcon name="i-lucide-trending-down" class="size-3.5" />
        Burndown
      </div>
    </div>

    <!-- Work -->
    <div v-else-if="sectionKey === 'work'" class="midesk-lsv-work">
      <div class="midesk-lsv-calendar">
        <div class="midesk-lsv-calendar-head" />
        <div class="midesk-lsv-calendar-grid">
          <span v-for="d in 28" :key="d" :class="{ 'is-today': d === 14, 'is-event': d === 9 || d === 21 }" />
        </div>
      </div>
      <div class="midesk-lsv-worklog">
        <div v-for="row in 3" :key="row" class="midesk-lsv-worklog-row">
          <span /><span :style="{ width: `${40 + row * 20}%` }" />
        </div>
      </div>
    </div>

    <!-- Collab -->
    <div v-else-if="sectionKey === 'collab'" class="midesk-lsv-collab">
      <div class="midesk-lsv-chat">
        <div class="midesk-lsv-msg is-them">
          <span /><span class="is-short" />
        </div>
        <div class="midesk-lsv-msg is-me">
          {{ t('landing.visuals.collab.reply') }}
        </div>
        <div class="midesk-lsv-msg is-ai">
          <UIcon name="i-lucide-sparkles" class="size-3 text-violet-400" />
          <span /><span class="is-short" />
        </div>
      </div>
      <div class="midesk-lsv-meeting">
        <UIcon name="i-lucide-video" class="size-4" />
        {{ t('landing.visuals.collab.meeting') }}
      </div>
    </div>

    <!-- HR -->
    <div v-else-if="sectionKey === 'hr'" class="midesk-lsv-hr">
      <div v-for="person in 4" :key="person" class="midesk-lsv-person" :style="{ '--person-i': person }">
        <span class="midesk-lsv-person-avatar" />
        <div class="midesk-lsv-person-info">
          <span /><span />
        </div>
        <span class="midesk-lsv-person-status" :class="{ 'is-away': person === 3 }" />
      </div>
    </div>

    <!-- Finance -->
    <div v-else class="midesk-lsv-finance">
      <div class="midesk-lsv-chart">
        <div
          v-for="bar in 5"
          :key="bar"
          class="midesk-lsv-chart-bar"
          :style="{ '--bar-h': `${30 + bar * 14}%`, '--bar-i': bar }"
        />
      </div>
      <div class="midesk-lsv-finance-cards">
        <div class="midesk-lsv-finance-card">
          <span>{{ t('landing.visuals.finance.expense') }}</span>
          <strong>۱۲.۴M</strong>
        </div>
        <div class="midesk-lsv-finance-card is-positive">
          <span>{{ t('landing.visuals.finance.budget') }}</span>
          <strong>۸۶٪</strong>
        </div>
      </div>
    </div>
  </div>
</template>
