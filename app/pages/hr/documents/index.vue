<script setup lang="ts">
import type { DocumentCategory, HrDocument, Personnel } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const { api } = useApi()
const hrStore = useHrStore()
const { can } = usePermissions()

const documents = ref<HrDocument[]>([])
const personnel = ref<Personnel[]>([])
const loading = ref(true)

const filters = reactive({
  personnel_id: undefined as string | undefined,
  category: undefined as DocumentCategory | undefined
})

const categoryItems = computed(() => [
  { label: t('hr.documents.filters.allCategories'), value: undefined },
  ...(['contract', 'id', 'certificate', 'other'] as DocumentCategory[]).map(cat => ({
    label: t(`hr.documents.category.${cat}`),
    value: cat
  }))
])

const personnelItems = computed(() => [
  { label: t('hr.documents.filters.allPersonnel'), value: undefined },
  ...personnel.value.map(p => ({
    label: p.user.name,
    value: p.id
  }))
])

async function load() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.personnel_id) params.set('personnel_id', filters.personnel_id)
    if (filters.category) params.set('category', filters.category)
    const qs = params.toString()
    const res = await api<{ data: HrDocument[] }>(`/hr/documents${qs ? `?${qs}` : ''}`)
    documents.value = res.data
  } finally {
    loading.value = false
  }
}

async function loadPersonnel() {
  personnel.value = await hrStore.fetchPersonnel()
}

function onUploaded(doc: HrDocument) {
  documents.value.unshift(doc)
}

watch(filters, load, { deep: true })

onMounted(async () => {
  await loadPersonnel()
  await load()
})
</script>

<template>
  <div>
    <h1 class="midesk-page-title mb-6">{{ t('nav.hr.documents') }}</h1>

    <div class="space-y-6">
      <HrDocumentUpload
        v-if="can('hr:documents:manage')"
        :personnel="personnel"
        @uploaded="onUploaded"
      />

      <section class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
          <h2 class="midesk-card-header mb-4">{{ t('hr.documents.listTitle') }}</h2>
          <div class="midesk-filter-bar">
            <USelect
              v-model="filters.personnel_id"
              :items="personnelItems"
              class="sm:flex-1"
            />
            <USelect
              v-model="filters.category"
              :items="categoryItems"
              class="sm:w-48"
            />
          </div>
        </div>
        <HrDocumentList :documents="documents" :loading="loading" />
      </section>
    </div>
  </div>
</template>
