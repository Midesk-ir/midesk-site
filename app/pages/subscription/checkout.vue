<script setup lang="ts">
import type { CheckoutPayload, SubscriptionPlan } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'owner'] })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()
const toast = useToast()

const planCode = computed(() => route.query.plan as string)
const cycle = ref<'monthly' | 'yearly'>('monthly')
const loading = ref(false)
const plan = ref<SubscriptionPlan | null>(null)

const region = computed(() => tenantStore.tenant?.region ?? 'IR')

onMounted(async () => {
  const res = await storeApi<{ data: SubscriptionPlan[] }>('/subscription/plans')
  plan.value = res.data.find(p => p.code === planCode.value) ?? null
})

async function pay() {
  if (!plan.value) return
  loading.value = true
  try {
    const payload: CheckoutPayload = { plan_code: plan.value.code, cycle: cycle.value }
    await storeApi('/subscription/pay', { method: 'POST', body: payload })
    await storeApi('/subscription/verify', { method: 'POST', body: { status: 'success' } })
    await router.push('/subscription?status=success')
  } catch {
    toast.add({ title: t('subscription.paymentFailed'), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg space-y-6">
    <LayoutMideskPageHeader :title="t('subscription.checkout')" />
    <SubscriptionCheckoutForm
      v-if="plan"
      :plan="plan"
      :region="region"
      :cycle="cycle"
      :loading="loading"
      @update:cycle="cycle = $event"
      @pay="pay"
      @cancel="router.push('/subscription')"
    />
  </div>
</template>
