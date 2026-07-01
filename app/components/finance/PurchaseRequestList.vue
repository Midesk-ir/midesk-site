<script setup lang="ts">
import type { PurchaseRequest, PurchaseRequestStatus } from '~/types/phase3'

defineProps<{
  requests: PurchaseRequest[]
  loading?: boolean
  showUser?: boolean
}>()

const emit = defineEmits<{
  submit: [id: string]
  ownerApprove: [id: string]
  ownerReject: [id: string]
  financeApprove: [id: string]
  financeReject: [id: string]
  convert: [id: string]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { can } = usePermissions()
const authStore = useAuthStore()

const statusColor: Record<PurchaseRequestStatus, 'neutral' | 'warning' | 'success' | 'error' | 'info' | 'primary'> = {
  draft: 'neutral',
  submitted: 'info',
  owner_review: 'warning',
  finance_review: 'warning',
  approved: 'success',
  rejected: 'error',
  converted: 'primary'
}

function canSubmit(pr: PurchaseRequest) {
  return pr.status === 'draft' && pr.user.id === authStore.user?.id
}

function canOwnerReview(pr: PurchaseRequest) {
  return pr.status === 'owner_review' && can('finance:expenses:approve')
}

function canFinanceReview(pr: PurchaseRequest) {
  return pr.status === 'finance_review' && (can('finance:expenses:pay') || can('finance:invoices:view'))
}

function canConvert(pr: PurchaseRequest) {
  return pr.status === 'approved' && can('finance:invoices:view')
}
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!requests.length"
      :title="t('finance.purchaseRequests.emptyTitle')"
      :description="t('finance.purchaseRequests.emptyDesc')"
      icon="i-lucide-shopping-cart"
    />

    <div v-else class="overflow-x-auto">
      <table class="midesk-table w-full min-w-[760px]">
        <thead>
          <tr>
            <th>{{ t('finance.purchaseRequests.columns.title') }}</th>
            <th v-if="showUser">{{ t('finance.purchaseRequests.columns.user') }}</th>
            <th>{{ t('finance.purchaseRequests.columns.amount') }}</th>
            <th>{{ t('finance.purchaseRequests.columns.date') }}</th>
            <th>{{ t('finance.purchaseRequests.columns.status') }}</th>
            <th class="text-end">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pr in requests"
            :key="pr.id"
            class="hover:bg-[var(--color-midesk-surface-hover)]"
          >
            <td class="font-medium text-[var(--color-midesk-text)]">{{ pr.title }}</td>
            <td v-if="showUser" class="text-[var(--color-midesk-text)]">{{ pr.user.name }}</td>
            <td class="font-semibold text-[var(--color-midesk-text)]">
              <MideskCurrency :amount="pr.total_amount" :currency="pr.currency" />
            </td>
            <td class="whitespace-nowrap text-[var(--color-midesk-text)]">{{ formatDate(pr.created_at.slice(0, 10)) }}</td>
            <td>
              <UBadge variant="subtle" :color="statusColor[pr.status]" size="sm">
                {{ t(`finance.purchaseRequests.status.${pr.status}`) }}
              </UBadge>
            </td>
            <td class="text-end">
              <div class="flex flex-wrap justify-end gap-1">
                <UButton
                  v-if="canSubmit(pr)"
                  size="xs"
                  color="primary"
                  variant="soft"
                  @click="emit('submit', pr.id)"
                >
                  {{ t('finance.purchaseRequests.actions.submit') }}
                </UButton>
                <UButton
                  v-if="canOwnerReview(pr)"
                  size="xs"
                  color="success"
                  variant="soft"
                  icon="i-lucide-check"
                  @click="emit('ownerApprove', pr.id)"
                />
                <UButton
                  v-if="canOwnerReview(pr)"
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-lucide-x"
                  @click="emit('ownerReject', pr.id)"
                />
                <UButton
                  v-if="canFinanceReview(pr)"
                  size="xs"
                  color="success"
                  variant="soft"
                  icon="i-lucide-check-check"
                  @click="emit('financeApprove', pr.id)"
                />
                <UButton
                  v-if="canFinanceReview(pr)"
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-lucide-x"
                  @click="emit('financeReject', pr.id)"
                />
                <UButton
                  v-if="canConvert(pr)"
                  size="xs"
                  color="primary"
                  variant="soft"
                  icon="i-lucide-package-plus"
                  @click="emit('convert', pr.id)"
                >
                  {{ t('finance.purchaseRequests.actions.convert') }}
                </UButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
