<script setup lang="ts">
import type { LeaveRequest } from '~/types/phase1'

const props = defineProps<{
  request: LeaveRequest
}>()

const emit = defineEmits<{
  approved: [id: string]
  rejected: [id: string]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const leaveStore = useLeaveStore()
const toast = useToast()

const showReject = ref(false)
const rejectReason = ref('')
const processing = ref(false)

async function approve() {
  processing.value = true
  try {
    await leaveStore.approve(props.request.id)
    emit('approved', props.request.id)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    processing.value = false
  }
}

async function reject() {
  if (!rejectReason.value.trim()) return
  processing.value = true
  try {
    await leaveStore.reject(props.request.id, rejectReason.value.trim())
    showReject.value = false
    rejectReason.value = ''
    emit('rejected', props.request.id)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <UAvatar :alt="request.user.name" icon="i-lucide-user" />
        <div>
          <p class="font-medium">{{ request.user.name }}</p>
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ request.leave_type.name }}
          </p>
          <p class="mt-1 text-sm">
            {{ formatDate(request.start_date) }} – {{ formatDate(request.end_date) }}
            · {{ request.duration_days }} {{ t('leave.balance.days') }}
          </p>
          <p v-if="request.note" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
            {{ request.note }}
          </p>
        </div>
      </div>

      <div class="flex gap-2">
        <UButton
          size="sm"
          color="success"
          variant="soft"
          :loading="processing"
          @click="approve"
        >
          {{ t('leave.approve') }}
        </UButton>
        <UButton
          size="sm"
          color="error"
          variant="soft"
          :disabled="processing"
          @click="showReject = true"
        >
          {{ t('leave.reject') }}
        </UButton>
      </div>
    </div>

    <MideskModal v-model:open="showReject" :title="t('leave.reject')">
      <div class="midesk-form-fields">
        <MideskFormField :label="t('leave.rejectReason')" :model-value="rejectReason" required>
          <UTextarea v-model="rejectReason" :rows="3" placeholder=" " />
        </MideskFormField>
      </div>
      <template #footer>
        <UButton variant="ghost" @click="showReject = false">
          {{ t('common.cancel') }}
        </UButton>
        <UButton color="error" :loading="processing" @click="reject">
          {{ t('leave.reject') }}
        </UButton>
      </template>
    </MideskModal>
  </div>
</template>
