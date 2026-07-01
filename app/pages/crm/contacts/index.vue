<script setup lang="ts">
import type { CreateCrmContactPayload, CrmContact } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const toast = useToast()
const { can } = usePermissions()

const contacts = ref<CrmContact[]>([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const filter = ref('all')
const search = ref('')

const filterItems = computed(() => [
  { label: t('crm.filters.all'), value: 'all', icon: 'i-lucide-layout-grid' },
  { label: t('crm.types.lead'), value: 'lead', icon: 'i-lucide-user-plus' },
  { label: t('crm.types.customer'), value: 'customer', icon: 'i-lucide-user-check' },
  { label: t('crm.types.partner'), value: 'partner', icon: 'i-lucide-handshake' },
  { label: t('crm.types.vendor'), value: 'vendor', icon: 'i-lucide-truck' }
])

const filteredContacts = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return contacts.value
  return contacts.value.filter(c =>
    c.name.toLowerCase().includes(q)
    || c.company?.toLowerCase().includes(q)
    || c.email?.toLowerCase().includes(q)
  )
})

async function load() {
  loading.value = true
  try {
    const qs = filter.value === 'all' ? '' : `?type=${filter.value}`
    const res = await storeApi<{ data: CrmContact[] }>(`/crm/contacts${qs}`)
    contacts.value = res.data
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

watch(filter, load)
onMounted(load)

async function onCreate(payload: CreateCrmContactPayload) {
  saving.value = true
  try {
    await storeApi('/crm/contacts', { method: 'POST', body: payload })
    showForm.value = false
    toast.add({ title: t('crm.contactCreated'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('crm.contacts')" :subtitle="t('crm.contactsSubtitle')">
      <template #actions>
        <LayoutMideskPageHeaderButton
          v-if="can('crm:manage')"
          variant="primary"
          icon="i-lucide-plus"
          @click="showForm = true"
        >
          {{ t('crm.addContact') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <CrmSubNav />

    <div class="mt-6 space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <UiSegmentTabs v-model="filter" :items="filterItems" />
        <UInput
          v-model="search"
          icon="i-lucide-search"
          :placeholder="t('crm.searchContacts')"
          class="w-full sm:max-w-xs"
        />
      </div>

      <CrmContactList :contacts="filteredContacts" :loading="loading" />
    </div>

    <MideskModal v-model:open="showForm" :title="t('crm.addContact')">
      <CrmContactForm :saving="saving" @submit="onCreate" @cancel="showForm = false" />
    </MideskModal>
  </div>
</template>
