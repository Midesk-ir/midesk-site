<script setup lang="ts">
import type { CreateBudgetPayload } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()
const toast = useToast()
const { can } = usePermissions()

const loading = ref(true)
const currentYear = new Date().getFullYear()

async function load() {
  loading.value = true
  try {
    await Promise.all([
      financeStore.fetchBudgets(currentYear),
      financeStore.fetchBudgetOverview(),
      financeStore.fetchCostCenters()
    ])
  } finally {
    loading.value = false
  }
}

async function onCreateBudget(payload: CreateBudgetPayload) {
  try {
    await financeStore.createBudget(payload)
    toast.add({ title: t('finance.budgets.actions.created'), color: 'success' })
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
        <h1 class="midesk-page-title">{{ t('nav.finance.budgets') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.budgets.pageSubtitle') }}</p>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton to="/finance" back>
          {{ t('nav.finance.dashboard') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <FinanceSubNav />

    <div class="space-y-6">
      <FinanceBudgetOverview
        :items="financeStore.budgetOverview"
        :loading="loading"
      />

      <div class="grid gap-6 xl:grid-cols-2">
        <FinanceCostCenterTree
          :nodes="financeStore.costCenters"
          :budgets="financeStore.budgets"
        />

        <section
          v-if="can('finance:budgets:manage')"
          class="midesk-card p-5"
        >
          <h2 class="midesk-card-header">{{ t('finance.budgets.newBudget') }}</h2>
          <FinanceBudgetForm
            :cost-centers="financeStore.costCenters"
            @submit="onCreateBudget"
          />
        </section>
      </div>
    </div>
  </div>
</template>