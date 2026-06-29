<script setup lang="ts">
definePageMeta({ middleware: ['manager'] })

const { t } = useI18n()
const leaveStore = useLeaveStore()

async function load() {
  await leaveStore.fetchAll()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('leave.pendingApprovals') }}</h1>
      </div>
      <UButton to="/leave" variant="ghost" icon="i-lucide-arrow-right" class="shrink-0">
        {{ t('leave.title') }}
      </UButton>
    </div>

    <UiEmptyState
      v-if="!leaveStore.loading && !leaveStore.pendingApprovals.length"
      :title="t('common.noResults')"
      icon="i-lucide-check-circle"
    />

    <div v-else class="space-y-4">
      <LeaveApprovalCard
        v-for="req in leaveStore.pendingApprovals"
        :key="req.id"
        :request="req"
        @approved="load"
        @rejected="load"
      />
    </div>
  </div>
</template>
