<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'leave'] })

const { t } = useI18n()
const leaveStore = useLeaveStore()
const { can } = usePermissions()
const toast = useToast()
const route = useRoute()

const loading = ref(true)
const error = ref(false)

const tabItems = computed(() => {
  const items = [
    { label: t('leave.request.title'), value: 'request', icon: 'i-lucide-file-plus' }
  ]
  if (can('leave:report:view')) {
    items.push({
      label: t('leave.report.title'),
      value: 'report',
      icon: 'i-lucide-bar-chart-3'
    })
  }
  return items
})

const activeTab = ref('request')

watch(tabItems, (items) => {
  const fromQuery = route.query.tab as string | undefined
  if (fromQuery && items.some(i => i.value === fromQuery)) {
    activeTab.value = fromQuery
    return
  }
  if (route.hash === '#leave-report' && items.some(i => i.value === 'report')) {
    activeTab.value = 'report'
  }
}, { immediate: true })

async function load() {
  loading.value = true
  error.value = false
  try {
    await leaveStore.fetchAll()
  } catch {
    error.value = true
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('leave.title')">
      <template #actions>
        <LayoutMideskPageHeaderButton
          v-if="can('leave:policies:view')"
          to="/leave/policies"
          variant="soft-neutral"
          icon="i-lucide-shield"
        >
          {{ t('leave.policy.title') }}
        </LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton
          v-if="leaveStore.pendingApprovals.length"
          to="/leave/requests"
          variant="soft-primary"
          icon="i-lucide-clipboard-check"
        >
          {{ t('leave.pendingApprovals') }}
          ({{ leaveStore.pendingApprovals.length }})
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <UiEmptyState
      v-if="error"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton color="primary" @click="load">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <div v-else class="space-y-6">
      <LeaveBalance :balances="leaveStore.balances" :loading="loading || leaveStore.loading" />

      <UTabs v-model="activeTab" :items="tabItems" :content="false" class="w-full" />

      <div v-if="activeTab === 'request'" class="space-y-6">
        <LeaveRequestForm @submitted="load" />
        <LeaveRequestList :requests="leaveStore.myRequests" :loading="loading || leaveStore.loading" />
      </div>

      <LeaveReport v-else-if="activeTab === 'report' && can('leave:report:view')" />
    </div>
  </div>
</template>
