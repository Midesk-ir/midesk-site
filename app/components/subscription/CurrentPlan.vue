<script setup lang="ts">
import type { CurrentSubscription } from '~/types/phase5'
import { formatCurrencyText } from '~/utils/currency-format'

const props = defineProps<{ subscription: CurrentSubscription }>()
const { t, locale } = useI18n()
const tenantStore = useTenantStore()
const region = computed(() => tenantStore.tenant?.region ?? 'IR')

const usagePercent = computed(() => ({
  users: Math.round((props.subscription.usage.users / props.subscription.plan.max_users) * 100),
  projects: Math.round((props.subscription.usage.projects / props.subscription.plan.max_projects) * 100)
}))
</script>

<template>
  <UCard class="midesk-glass border-[var(--color-midesk-border)]">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold">{{ t('subscription.currentPlan') }}</p>
          <p class="text-sm text-[var(--color-midesk-muted)]">{{ subscription.plan.name }}</p>
        </div>
        <UBadge :color="subscription.status === 'active' ? 'success' : 'warning'">
          {{ t(`subscription.status.${subscription.status}`) }}
        </UBadge>
      </div>
    </template>
    <div class="space-y-4">
      <p class="text-sm text-[var(--color-midesk-muted)]">
        {{ t('subscription.expiresAt') }}: {{ subscription.expires_at.slice(0, 10) }}
      </p>
      <div>
        <div class="mb-1 flex justify-between text-sm">
          <span>{{ t('subscription.usage.users') }}</span>
          <span>{{ subscription.usage.users }} / {{ subscription.plan.max_users }}</span>
        </div>
        <UProgress :value="usagePercent.users" color="primary" />
      </div>
      <div>
        <div class="mb-1 flex justify-between text-sm">
          <span>{{ t('subscription.usage.projects') }}</span>
          <span>{{ subscription.usage.projects }} / {{ subscription.plan.max_projects }}</span>
        </div>
        <UProgress :value="usagePercent.projects" color="primary" />
      </div>
      <ul class="text-sm text-[var(--color-midesk-muted)]">
        <li v-for="f in subscription.plan.features" :key="f">• {{ f }}</li>
      </ul>
    </div>
  </UCard>
</template>
