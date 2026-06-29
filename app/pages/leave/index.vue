<script setup lang="ts">
const { t } = useI18n()
const leaveStore = useLeaveStore()

async function load() {
  await leaveStore.fetchAll()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="midesk-page-title">{{ t('leave.title') }}</h1>
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

    <div class="space-y-6">
      <LeaveBalance :balances="leaveStore.balances" :loading="leaveStore.loading" />
      <LeaveRequestForm @submitted="load" />
      <LeaveRequestList :requests="leaveStore.myRequests" :loading="leaveStore.loading" />
    </div>
  </div>
</template>
