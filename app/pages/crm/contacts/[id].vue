<script setup lang="ts">
import type {
  CreateCrmActivityPayload,
  CreateCrmContactPayload,
  CreateCrmOpportunityPayload,
  CrmActivity,
  CrmContact,
  CrmOpportunity
} from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const { can } = usePermissions()

const contact = ref<CrmContact | null>(null)
const opportunities = ref<CrmOpportunity[]>([])
const activities = ref<CrmActivity[]>([])
const allContacts = ref<CrmContact[]>([])

const loading = ref(true)
const saving = ref(false)
const showEdit = ref(false)
const showActivity = ref(false)
const showOpportunity = ref(false)

const id = computed(() => route.params.id as string)

async function load() {
  loading.value = true
  try {
    const [c, o, a] = await Promise.all([
      storeApi<{ data: CrmContact }>(`/crm/contacts/${id.value}`),
      storeApi<{ data: CrmOpportunity[] }>('/crm/opportunities'),
      storeApi<{ data: CrmActivity[] }>(`/crm/activities?contact_id=${id.value}`)
    ])
    contact.value = c.data
    opportunities.value = o.data.filter(x => x.contact.id === id.value)
    activities.value = a.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

async function loadContacts() {
  if (!can('crm:manage')) return
  try {
    allContacts.value = (await storeApi<{ data: CrmContact[] }>('/crm/contacts')).data
  } catch {
    allContacts.value = []
  }
}

async function onUpdate(payload: CreateCrmContactPayload) {
  saving.value = true
  try {
    const res = await storeApi<{ data: CrmContact }>(`/crm/contacts/${id.value}`, {
      method: 'PATCH',
      body: payload
    })
    contact.value = res.data
    showEdit.value = false
    toast.add({ title: t('common.save'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

async function addActivity(payload: CreateCrmActivityPayload) {
  saving.value = true
  try {
    await storeApi('/crm/activities', { method: 'POST', body: payload })
    showActivity.value = false
    toast.add({ title: t('crm.activityCreated'), color: 'success' })
    activities.value = (await storeApi<{ data: CrmActivity[] }>(`/crm/activities?contact_id=${id.value}`)).data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

async function addOpportunity(payload: CreateCrmOpportunityPayload) {
  saving.value = true
  try {
    await storeApi('/crm/opportunities', { method: 'POST', body: payload })
    showOpportunity.value = false
    toast.add({ title: t('crm.opportunityCreated'), color: 'success' })
    opportunities.value = (await storeApi<{ data: CrmOpportunity[] }>('/crm/opportunities')).data
      .filter(x => x.contact.id === id.value)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

watch(id, load)
onMounted(async () => {
  await Promise.all([load(), loadContacts()])
})
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      back-to="/crm/contacts"
      :back-label="t('crm.contacts')"
    >
      <template #title>
        <h1 v-if="contact" class="midesk-page-title">{{ contact.name }}</h1>
        <USkeleton v-else class="h-8 w-48" />
        <p v-if="contact?.company" class="midesk-page-subtitle">{{ contact.company }}</p>
      </template>
      <template v-if="contact && can('crm:manage')" #actions>
        <LayoutMideskPageHeaderButton variant="soft-neutral" icon="i-lucide-activity" @click="showActivity = true">
          {{ t('crm.addActivity') }}
        </LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton variant="soft-primary" icon="i-lucide-target" @click="showOpportunity = true">
          {{ t('crm.addOpportunity') }}
        </LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton variant="outline" icon="i-lucide-pencil" @click="showEdit = true">
          {{ t('common.edit') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <CrmSubNav />

    <div class="mt-6">
      <div v-if="loading" class="space-y-4">
        <USkeleton class="h-10 w-72 rounded-lg" />
        <USkeleton class="midesk-skeleton-card h-64" />
      </div>
      <CrmContactProfile
        v-else-if="contact"
        :contact="contact"
        :opportunities="opportunities"
        :activities="activities"
      />
    </div>

    <MideskModal v-model:open="showEdit" :title="t('common.edit')">
      <CrmContactForm
        v-if="contact"
        :initial="contact"
        :saving="saving"
        @submit="onUpdate"
        @cancel="showEdit = false"
      />
    </MideskModal>

    <MideskModal v-model:open="showActivity" :title="t('crm.addActivity')">
      <CrmActivityForm
        v-if="contact"
        :contact-id="contact.id"
        :saving="saving"
        @submit="addActivity"
        @cancel="showActivity = false"
      />
    </MideskModal>

    <MideskModal v-model:open="showOpportunity" :title="t('crm.addOpportunity')">
      <CrmOpportunityForm
        v-if="contact"
        :contacts="allContacts.length ? allContacts : [contact]"
        :default-contact-id="contact.id"
        :saving="saving"
        @submit="addOpportunity"
        @cancel="showOpportunity = false"
      />
    </MideskModal>
  </div>
</template>
