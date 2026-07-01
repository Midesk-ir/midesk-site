<script setup lang="ts">
import type {
  CreateCrmOpportunityPayload,
  CrmContact,
  CrmOpportunity,
  CrmOpportunityStage
} from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const toast = useToast()
const { can } = usePermissions()

const opportunities = ref<CrmOpportunity[]>([])
const contacts = ref<CrmContact[]>([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)

const stages: CrmOpportunityStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost']

async function load() {
  loading.value = true
  try {
    const [o, c] = await Promise.all([
      storeApi<{ data: CrmOpportunity[] }>('/crm/opportunities'),
      storeApi<{ data: CrmContact[] }>('/crm/contacts')
    ])
    opportunities.value = o.data
    contacts.value = c.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

async function onMove({ id, stage }: { id: string, stage: CrmOpportunityStage }) {
  const prev = opportunities.value.find(o => o.id === id)
  if (!prev || prev.stage === stage) return
  try {
    await storeApi(`/crm/opportunities/${id}/stage`, { method: 'PATCH', body: { stage } })
    toast.add({ title: t('crm.stageUpdated'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
    await load()
  }
}

async function onCreate(payload: CreateCrmOpportunityPayload) {
  saving.value = true
  try {
    await storeApi('/crm/opportunities', { method: 'POST', body: payload })
    showForm.value = false
    toast.add({ title: t('crm.opportunityCreated'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('crm.pipeline')" :subtitle="t('crm.pipelineSubtitle')">
      <template v-if="can('crm:manage')" #actions>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="showForm = true">
          {{ t('crm.addOpportunity') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <CrmSubNav />

    <div class="mt-6">
      <CrmOpportunityPipeline
        :opportunities="opportunities"
        :stages="stages"
        :loading="loading"
        @move="onMove"
      />
    </div>

    <MideskModal v-model:open="showForm" :title="t('crm.addOpportunity')">
      <CrmOpportunityForm
        :contacts="contacts"
        :saving="saving"
        @submit="onCreate"
        @cancel="showForm = false"
      />
    </MideskModal>
  </div>
</template>
