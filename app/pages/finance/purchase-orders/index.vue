<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()

const loading = ref(true)

async function load() {
  loading.value = true
  try {
    await financeStore.fetchPurchaseOrders()
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('nav.finance.purchaseOrders') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.purchaseOrders.pageSubtitle') }}</p>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton to="/finance" back>
          {{ t('nav.finance.dashboard') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <FinanceSubNav />

    <FinancePurchaseOrderList :orders="financeStore.purchaseOrders" :loading="loading" />
  </div>
</template>
