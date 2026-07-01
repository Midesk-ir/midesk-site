<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { can, canAny } = usePermissions()

const links = computed(() => [
  { label: t('nav.finance.dashboard'), to: '/finance', show: can('finance:dashboard:view') },
  { label: t('nav.finance.expenses'), to: '/finance/expenses', show: canAny(['finance:expenses:view', 'finance:expenses:create', 'finance:expenses:approve', 'finance:expenses:pay']) },
  { label: t('nav.finance.budgets'), to: '/finance/budgets', show: can('finance:budgets:view') },
  { label: t('nav.finance.invoices'), to: '/finance/invoices', show: can('finance:invoices:view') },
  { label: t('nav.finance.purchaseRequests'), to: '/finance/purchase-requests', show: canAny(['finance:expenses:create', 'finance:expenses:view', 'finance:invoices:view']) },
  { label: t('nav.finance.purchaseOrders'), to: '/finance/purchase-orders', show: can('finance:invoices:view') },
  { label: t('nav.finance.vendors'), to: '/finance/vendors', show: can('finance:invoices:view') },
  { label: t('nav.finance.payroll'), to: '/finance/payroll', show: can('finance:payroll:view') }
].filter(item => item.show))

function isActive(path: string) {
  if (path === '/finance') return route.path === '/finance'
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <nav v-if="links.length > 1" class="midesk-subnav">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="midesk-subnav-link"
      :class="{ 'midesk-subnav-link--active': isActive(link.to) }"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
