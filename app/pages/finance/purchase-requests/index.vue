<script setup lang="ts">
import type { CreatePurchaseRequestPayload } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()
const toast = useToast()
const { can } = usePermissions()

const loading = ref(true)
const showUser = computed(() => can('finance:expenses:view') || can('finance:invoices:view'))

async function load() {
  loading.value = true
  try {
    await financeStore.fetchPurchaseRequests()
  } finally {
    loading.value = false
  }
}

async function onCreate(payload: CreatePurchaseRequestPayload) {
  try {
    await financeStore.createPurchaseRequest(payload)
    toast.add({ title: t('finance.purchaseRequests.actions.created'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onSubmit(id: string) {
  try {
    await financeStore.submitPurchaseRequest(id)
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onOwnerApprove(id: string) {
  try {
    await financeStore.ownerReviewPurchaseRequest(id, true)
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onOwnerReject(id: string) {
  try {
    await financeStore.ownerReviewPurchaseRequest(id, false)
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onFinanceApprove(id: string) {
  try {
    await financeStore.financeReviewPurchaseRequest(id, true)
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onFinanceReject(id: string) {
  try {
    await financeStore.financeReviewPurchaseRequest(id, false)
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onConvert(id: string) {
  try {
    await financeStore.convertPurchaseRequest(id)
    toast.add({ title: t('finance.purchaseRequests.actions.converted'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('nav.finance.purchaseRequests') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.purchaseRequests.pageSubtitle') }}</p>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton to="/finance" back>
          {{ t('nav.finance.dashboard') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <FinanceSubNav />

    <div class="space-y-6">
      <section v-if="can('finance:expenses:create')" class="midesk-card p-5">
        <h2 class="midesk-card-header">{{ t('finance.purchaseRequests.newRequest') }}</h2>
        <FinancePurchaseRequestForm @submit="onCreate" />
      </section>

      <FinancePurchaseRequestList
        :requests="financeStore.purchaseRequests"
        :loading="loading"
        :show-user="showUser"
        @submit="onSubmit"
        @owner-approve="onOwnerApprove"
        @owner-reject="onOwnerReject"
        @finance-approve="onFinanceApprove"
        @finance-reject="onFinanceReject"
        @convert="onConvert"
      />
    </div>
  </div>
</template>
