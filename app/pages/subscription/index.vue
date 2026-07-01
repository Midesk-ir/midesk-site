<script setup lang="ts">
import type { CurrentSubscription, SubscriptionInvoice, SubscriptionPlan } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'owner'] })

const { t } = useI18n()
const tenantStore = useTenantStore()
const route = useRoute()
const toast = useToast()

const loading = ref(true)
const current = ref<CurrentSubscription | null>(null)
const plans = ref<SubscriptionPlan[]>([])
const invoices = ref<SubscriptionInvoice[]>([])

const region = computed(() => tenantStore.tenant?.region ?? 'IR')

onMounted(async () => {
  loading.value = true
  try {
    const [sub, pl, inv] = await Promise.all([
      storeApi<{ data: CurrentSubscription }>('/subscription'),
      storeApi<{ data: SubscriptionPlan[] }>('/subscription/plans'),
      storeApi<{ data: SubscriptionInvoice[] }>('/subscription/invoices')
    ])
    current.value = sub.data
    plans.value = pl.data
    invoices.value = inv.data
  } finally {
    loading.value = false
  }

  if (route.query.status === 'success') {
    toast.add({ title: t('subscription.paymentSuccess'), color: 'success' })
  } else if (route.query.status === 'failed') {
    toast.add({ title: t('subscription.paymentFailed'), color: 'error' })
  }
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('nav.subscription')" :subtitle="t('subscription.pageSubtitle')" />

    <div v-if="loading" class="space-y-4">
      <USkeleton class="midesk-skeleton-card h-40" />
      <USkeleton class="midesk-skeleton-card h-64" />
    </div>

    <template v-else-if="current">
      <SubscriptionCurrentPlan :subscription="current" />

      <UCard class="midesk-glass border-[var(--color-midesk-border)]">
        <template #header>
          <p class="font-semibold">{{ t('subscription.comparePlans') }}</p>
        </template>
        <SubscriptionPlanComparison
          :plans="plans"
          :current-code="current.plan.code"
          :region="region"
        />
      </UCard>

      <UCard class="midesk-glass border-[var(--color-midesk-border)]">
        <template #header>
          <p class="font-semibold">{{ t('subscription.invoices') }}</p>
        </template>
        <SubscriptionInvoiceList :invoices="invoices" />
      </UCard>
    </template>
  </div>
</template>
