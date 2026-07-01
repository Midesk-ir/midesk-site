<script setup lang="ts">
definePageMeta({ middleware: ['manager'] })

const { t } = useI18n()
const leaveStore = useLeaveStore()
const toast = useToast()

const loading = ref(true)
const error = ref(false)

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
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('leave.pendingApprovals') }}</h1>
      </div>
      <UButton to="/leave" variant="ghost" icon="i-lucide-arrow-right" class="shrink-0">
        {{ t('leave.title') }}
      </UButton>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-24 rounded-xl" />
    </div>

    <UiEmptyState
      v-else-if="error"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton color="primary" @click="load">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <UiEmptyState
      v-else-if="!leaveStore.pendingApprovals.length"
      :title="t('common.noResults')"
      icon="i-lucide-circle-check"
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
