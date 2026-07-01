<script setup lang="ts">
import type { CreateLeavePolicyPayload, LeavePolicy } from '~/types/phase2'
import type { User } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'tenant', 'hr'],
  permission: 'leave:policies:view'
})

const { t } = useI18n()
const { api } = useApi()
const toast = useToast()
const leaveStore = useLeaveStore()
const { can } = usePermissions()

const policies = ref<LeavePolicy[]>([])
const approvers = ref<User[]>([])
const loading = ref(true)
const editingPolicy = ref<LeavePolicy | null>(null)
const showEdit = ref(false)

async function load() {
  loading.value = true
  try {
    await leaveStore.fetchAll()
    const res = await api<{ data: LeavePolicy[] }>('/leave/policies')
    policies.value = res.data
    if (can('leave:policies:manage')) {
      try {
        const membersRes = await api<{ data: User[] }>('/members')
        approvers.value = membersRes.data
      } catch {
        approvers.value = []
      }
    }
  } finally {
    loading.value = false
  }
}

async function onSubmit(payload: CreateLeavePolicyPayload) {
  try {
    await api('/leave/policies', { method: 'POST', body: payload })
    toast.add({ title: t('common.save'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function onEditPolicy(policy: LeavePolicy) {
  editingPolicy.value = policy
  showEdit.value = true
}

async function onUpdatePolicy(payload: CreateLeavePolicyPayload) {
  if (!editingPolicy.value) return
  try {
    await api(`/leave/policies/${editingPolicy.value.id}`, { method: 'PATCH', body: payload })
    showEdit.value = false
    editingPolicy.value = null
    toast.add({ title: t('common.save'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('leave.policy.title')">
      <template #actions>
        <LayoutMideskPageHeaderButton to="/leave" back>
          {{ t('nav.leave') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <div class="space-y-6">
      <LeavePolicyForm
        v-if="can('leave:policies:manage')"
        :approvers="approvers"
        @submit="onSubmit"
      />

      <section class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
          <h2 class="midesk-card-header mb-0">{{ t('leave.policy.listTitle') }}</h2>
        </div>

        <div v-if="loading" class="space-y-3 p-5">
          <USkeleton v-for="i in 3" :key="i" class="h-12" />
        </div>

        <UiEmptyState
          v-else-if="!policies.length"
          :title="t('leave.policy.emptyTitle')"
          icon="i-lucide-shield"
        />

        <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
          <li
            v-for="policy in policies"
            :key="policy.id"
            class="px-5 py-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-medium">{{ policy.leave_type.name }}</p>
                <p class="text-sm text-[var(--color-midesk-muted)]">
                  {{ t('leave.policy.minNoticeDays') }}: {{ policy.min_notice_days }}
                  · {{ policy.auto_approve ? t('leave.policy.autoApprove') : t('leave.policy.approvalChain') }}
                </p>
              </div>
              <UBadge :color="policy.auto_approve ? 'success' : 'warning'" variant="subtle">
                {{ policy.auto_approve ? t('leave.policy.autoApprove') : `${policy.approval_chain.length} ${t('leave.policy.approvers')}` }}
              </UBadge>
              <UButton
                v-if="can('leave:policies:manage')"
                size="xs"
                variant="ghost"
                icon="i-lucide-pencil"
                @click="onEditPolicy(policy)"
              >
                {{ t('common.edit') }}
              </UButton>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <MideskModal v-model:open="showEdit" :title="t('leave.policy.editTitle')">
      <LeavePolicyForm
        v-if="editingPolicy"
        :approvers="approvers"
        :initial="{
          leave_type_id: editingPolicy.leave_type.id,
          auto_approve: editingPolicy.auto_approve,
          approval_chain: editingPolicy.approval_chain,
          min_notice_days: editingPolicy.min_notice_days,
          allow_negative_balance: editingPolicy.allow_negative_balance
        }"
        @submit="onUpdatePolicy"
      />
    </MideskModal>
  </div>
</template>
