<script setup lang="ts">
import type { Contract, CreateContractPayload, Personnel } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const { api } = useApi()
const toast = useToast()
const hrStore = useHrStore()
const { can } = usePermissions()

const contracts = ref<Contract[]>([])
const personnel = ref<Personnel[]>([])
const loading = ref(true)
const showRenew = ref(false)
const showCreate = ref(false)
const renewing = ref(false)
const creating = ref(false)
const renewContractId = ref<string | null>(null)
const renewInitial = ref<Partial<CreateContractPayload> | null>(null)

async function load() {
  loading.value = true
  try {
    const tasks: Promise<unknown>[] = [
      api<{ data: Contract[] }>('/hr/contracts').then(r => { contracts.value = r.data })
    ]
    if (can('hr:contracts:manage')) {
      tasks.push(
        hrStore.fetchPersonnel().then(data => { personnel.value = data })
      )
    }
    await Promise.all(tasks)
  } finally {
    loading.value = false
  }
}

function onRenew(id: string) {
  const contract = contracts.value.find(c => c.id === id)
  if (!contract) return
  renewContractId.value = id
  renewInitial.value = {
    personnel_id: contract.personnel_id,
    type: contract.type,
    start_date: contract.start_date,
    end_date: contract.end_date,
    base_salary: contract.base_salary,
    currency: contract.currency
  }
  showRenew.value = true
}

async function onRenewSubmit(payload: CreateContractPayload) {
  if (!renewContractId.value) return
  renewing.value = true
  try {
    await api(`/hr/contracts/${renewContractId.value}/renew`, {
      method: 'PATCH',
      body: {
        end_date: payload.end_date,
        base_salary: payload.base_salary
      }
    })
    showRenew.value = false
    renewContractId.value = null
    toast.add({ title: t('hr.contracts.renew'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    renewing.value = false
  }
}

async function onCreateSubmit(payload: CreateContractPayload) {
  creating.value = true
  try {
    await api('/hr/contracts', { method: 'POST', body: payload })
    showCreate.value = false
    toast.add({ title: t('common.create'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    creating.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header mb-6">
      <h1 class="midesk-page-title">{{ t('nav.hr.contracts') }}</h1>
      <UButton
        v-if="can('hr:contracts:manage')"
        icon="i-lucide-plus"
        color="primary"
        class="shrink-0"
        @click="showCreate = true"
      >
        {{ t('common.create') }}
      </UButton>
    </div>

    <div class="space-y-6">
      <HrContractExpiryAlert :contracts="contracts" />

      <HrContractList
        :contracts="contracts"
        :loading="loading"
        @renew="onRenew"
      />
    </div>

    <MideskModal v-model:open="showRenew" :title="t('hr.contracts.renew')">
      <HrContractForm
        :personnel="personnel"
        :initial="renewInitial ?? undefined"
        :allow-file="true"
        :loading="renewing"
        submit-label="save"
        @submit="onRenewSubmit"
      />
    </MideskModal>

    <MideskModal v-model:open="showCreate" :title="t('hr.contracts.create')">
      <HrContractForm
        :personnel="personnel"
        :loading="creating"
        @submit="onCreateSubmit"
      />
    </MideskModal>
  </div>
</template>
