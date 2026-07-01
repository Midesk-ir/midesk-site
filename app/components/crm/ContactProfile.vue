<script setup lang="ts">
import type { CrmActivity, CrmContact, CrmOpportunity } from '~/types/phase5'

defineProps<{
  contact: CrmContact
  opportunities: CrmOpportunity[]
  activities: CrmActivity[]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const tab = ref<'info' | 'opportunities' | 'activities'>('info')

const tabItems = computed(() => [
  { label: t('crm.tabs.info'), value: 'info' as const, icon: 'i-lucide-user' },
  { label: t('crm.tabs.opportunities'), value: 'opportunities' as const, icon: 'i-lucide-target' },
  { label: t('crm.tabs.activities'), value: 'activities' as const, icon: 'i-lucide-activity' }
])

const typeColors = {
  lead: 'info',
  customer: 'success',
  partner: 'primary',
  vendor: 'warning'
} as const
</script>

<template>
  <div class="space-y-4">
    <UiSegmentTabs v-model="tab" :items="tabItems" />

    <div v-if="tab === 'info'" class="grid gap-4 lg:grid-cols-2">
      <UCard class="midesk-glass border-[var(--color-midesk-border)]">
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <p class="font-semibold">{{ t('crm.tabs.info') }}</p>
            <UBadge :color="typeColors[contact.type]" variant="subtle">
              {{ t(`crm.types.${contact.type}`) }}
            </UBadge>
          </div>
        </template>
        <dl class="space-y-3 text-sm">
          <div v-if="contact.email">
            <dt class="text-[var(--color-midesk-muted)]">{{ t('crm.fields.email') }}</dt>
            <dd class="midesk-ltr-field mt-0.5">{{ contact.email }}</dd>
          </div>
          <div v-if="contact.phone">
            <dt class="text-[var(--color-midesk-muted)]">{{ t('crm.fields.phone') }}</dt>
            <dd class="midesk-ltr-field mt-0.5">{{ contact.phone }}</dd>
          </div>
          <div v-if="contact.assigned_to">
            <dt class="text-[var(--color-midesk-muted)]">{{ t('crm.fields.assignedTo') }}</dt>
            <dd class="mt-0.5">{{ contact.assigned_to.name }}</dd>
          </div>
          <div v-if="contact.tags.length">
            <dt class="text-[var(--color-midesk-muted)]">{{ t('crm.fields.tags') }}</dt>
            <dd class="mt-1 flex flex-wrap gap-1">
              <UBadge v-for="tag in contact.tags" :key="tag" size="xs" variant="subtle">{{ tag }}</UBadge>
            </dd>
          </div>
        </dl>
      </UCard>
      <UCard class="midesk-glass border-[var(--color-midesk-border)]">
        <template #header><p class="font-semibold">{{ t('crm.summary') }}</p></template>
        <div class="grid grid-cols-2 gap-4 text-center">
          <div class="rounded-xl bg-white/[0.04] p-4">
            <p class="text-2xl font-bold">{{ opportunities.length }}</p>
            <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('crm.opportunities') }}</p>
          </div>
          <div class="rounded-xl bg-white/[0.04] p-4">
            <p class="text-2xl font-bold">{{ activities.length }}</p>
            <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('crm.activities') }}</p>
          </div>
        </div>
        <p class="mt-4 text-xs text-[var(--color-midesk-muted)]">
          {{ t('crm.createdAt') }}: {{ formatDate(contact.created_at) }}
        </p>
      </UCard>
    </div>

    <div v-else-if="tab === 'opportunities'">
      <UiEmptyState
        v-if="!opportunities.length"
        :title="t('crm.emptyOpportunitiesTitle')"
        :description="t('crm.emptyOpportunitiesDesc')"
        icon="i-lucide-target"
      />
      <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <CrmOpportunityCard v-for="o in opportunities" :key="o.id" :opportunity="o" />
      </div>
    </div>

    <div v-else>
      <UiEmptyState
        v-if="!activities.length"
        :title="t('crm.emptyActivitiesTitle')"
        :description="t('crm.emptyActivitiesDesc')"
        icon="i-lucide-activity"
      />
      <UCard v-else class="midesk-glass border-[var(--color-midesk-border)]">
        <CrmActivityTimeline :activities="activities" />
      </UCard>
    </div>
  </div>
</template>
