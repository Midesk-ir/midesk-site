<script setup lang="ts">
const { t } = useI18n()
const leaveStore = useLeaveStore()
const { can } = usePermissions()

async function load() {
  await leaveStore.fetchAll()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="midesk-page-title">{{ t('leave.title') }}</h1>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-if="can('leave:policies:view')"
          to="/leave/policies"
          variant="soft"
          color="neutral"
          icon="i-lucide-shield"
        >
          {{ t('leave.policy.title') }}
        </UButton>
        <UButton
          v-if="can('leave:report:view')"
          to="/leave#leave-report"
          variant="soft"
          color="neutral"
          icon="i-lucide-bar-chart-3"
        >
          {{ t('leave.report.title') }}
        </UButton>
        <UButton
          v-if="leaveStore.pendingApprovals.length"
          to="/leave/requests"
          variant="soft"
          color="primary"
          icon="i-lucide-clipboard-check"
        >
          {{ t('leave.pendingApprovals') }}
          ({{ leaveStore.pendingApprovals.length }})
        </UButton>
      </div>
    </div>

    <div class="space-y-6">
      <LeaveBalance :balances="leaveStore.balances" :loading="leaveStore.loading" />
      <LeaveRequestForm @submitted="load" />
      <LeaveRequestList :requests="leaveStore.myRequests" :loading="leaveStore.loading" />
      <div v-if="can('leave:report:view')" id="leave-report">
        <LeaveReport />
      </div>
    </div>
  </div>
</template>
