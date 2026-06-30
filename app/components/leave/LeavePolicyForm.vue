<script setup lang="ts">
import type { CreateLeavePolicyPayload } from '~/types/phase2'
import type { User } from '~/types'

const props = defineProps<{
  approvers?: User[]
  initial?: Partial<CreateLeavePolicyPayload>
}>()

const emit = defineEmits<{
  submit: [payload: CreateLeavePolicyPayload]
}>()

const { t } = useI18n()
const leaveStore = useLeaveStore()

const submitting = ref(false)

const form = reactive<CreateLeavePolicyPayload>({
  leave_type_id: '',
  auto_approve: false,
  approval_chain: [],
  min_notice_days: 0,
  allow_negative_balance: false
})

const typeItems = computed(() =>
  leaveStore.types.map(lt => ({ label: lt.name, value: lt.id }))
)

const approverItems = computed(() =>
  (props.approvers ?? []).map(u => ({ label: u.name, value: u.id }))
)

watch(
  () => leaveStore.types,
  (types) => {
    if (types.length && !form.leave_type_id) {
      form.leave_type_id = types[0]!.id
    }
  },
  { immediate: true }
)

watch(
  () => props.initial,
  (initial) => {
    if (!initial) return
    if (initial.leave_type_id) form.leave_type_id = initial.leave_type_id
    if (initial.auto_approve !== undefined) form.auto_approve = initial.auto_approve
    if (initial.approval_chain) form.approval_chain = [...initial.approval_chain]
    if (initial.min_notice_days !== undefined) form.min_notice_days = initial.min_notice_days
    if (initial.allow_negative_balance !== undefined) form.allow_negative_balance = initial.allow_negative_balance
  },
  { immediate: true }
)

function onSubmit() {
  if (!form.leave_type_id) return
  submitting.value = true
  emit('submit', {
    leave_type_id: form.leave_type_id,
    auto_approve: form.auto_approve,
    approval_chain: [...form.approval_chain],
    min_notice_days: form.min_notice_days,
    allow_negative_balance: form.allow_negative_balance
  })
  submitting.value = false
}
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
    <h2 class="midesk-card-header">{{ t('leave.policy.title') }}</h2>

    <form class="midesk-form-fields" @submit.prevent="onSubmit">
      <MideskFormField :label="t('leave.request.type')" :model-value="form.leave_type_id" required>
        <USelect v-model="form.leave_type_id" :items="typeItems" />
      </MideskFormField>

      <MideskFormField :label="t('leave.policy.autoApprove')" :model-value="form.auto_approve">
        <UCheckbox v-model="form.auto_approve" :label="t('leave.policy.autoApproveHint')" />
      </MideskFormField>

      <MideskFormField
        v-if="!form.auto_approve"
        :label="t('leave.policy.approvalChain')"
        :model-value="form.approval_chain"
        required
      >
        <USelect
          v-model="form.approval_chain"
          :items="approverItems"
          multiple
        />
        <p class="mt-1 text-xs text-[var(--color-midesk-muted)]">
          {{ t('leave.policy.approvalChainHint') }}
        </p>
      </MideskFormField>

      <MideskFormField :label="t('leave.policy.minNoticeDays')" :model-value="form.min_notice_days">
        <UInput v-model.number="form.min_notice_days" type="number" min="0" />
      </MideskFormField>

      <MideskFormField :label="t('leave.policy.allowNegativeBalance')" :model-value="form.allow_negative_balance">
        <UCheckbox v-model="form.allow_negative_balance" :label="t('leave.policy.allowNegativeBalanceHint')" />
      </MideskFormField>

      <div class="flex justify-end">
        <UButton type="submit" color="primary" :loading="submitting">
          {{ t('common.save') }}
        </UButton>
      </div>
    </form>
  </div>
</template>
